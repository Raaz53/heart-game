// src/pages/Game.jsx
import React, { useEffect, useState } from "react";
import { fetchHeartQuestion } from "../services/api";
import ImageCard from "../components/ImageCard";
import { useEventBus } from "../context/EventBusContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Game() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  // current consecutive-correct streak (this is the "score" that counts)
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak") || 0));
  // stored high score from user profile
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore") || 0));

  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { publish, subscribe } = useEventBus();
  const { user } = useAuth();
  const navigate = useNavigate();

  // user profile fetched from Firestore (document id == auth uid)
  const [profile, setProfile] = useState(null);

  // redirect to sign-in if no user
  useEffect(() => {
    // try to determine authenticated uid from useAuth or firebase auth
    const uid = user?.uid ?? auth?.currentUser?.uid;
    if (!uid) {
      navigate("/signin");
      return;
    }

    // fetch user profile
    (async () => {
      try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          if (typeof data.high_score === "number") {
            setHighScore(data.high_score);
            localStorage.setItem("highScore", String(data.high_score));
          }
        }
      } catch (e) {
        // ignore failures but do not block the user
        console.warn("Could not fetch profile:", e);
      }
    })();
  }, [user, navigate]);

  // subscribe to events
  useEffect(() => {
    const unsubQ = subscribe("questionFetched", q => {
      setQuestion(q);
      setResult(null);
      setAnswer("");
    });
    const unsubA = subscribe("answerSubmitted", r => {
      console.log("answerSubmitted event", r);
    });
    return () => {
      unsubQ();
      unsubA();
    };
  }, [subscribe]);

  // fetch new question
  async function loadNewQuestion() {
    try {
      const q = await fetchHeartQuestion();
      setQuestion(q);
      publish("questionFetched", q);
      localStorage.setItem("lastQuestion", JSON.stringify(q));

      // start image loading state if image present
      setImgError(false);
      setImgLoading(!!q?.image);
    } catch (e) {
      setResult({ status: "error", message: e.message });
    }
  }

  // helper: update leaderboard (first, second, third) in a transaction
  async function updateTopScorers(uid, display_name, newScore) {
    if (!uid) return;
    const firstRef = doc(db, "top_scorer", "first");
    const secondRef = doc(db, "top_scorer", "second");
    const thirdRef = doc(db, "top_scorer", "third");

    try {
      await runTransaction(db, async (tx) => {
        const [fSnap, sSnap, tSnap] = await Promise.all([tx.get(firstRef), tx.get(secondRef), tx.get(thirdRef)]);

        const first = fSnap.exists() ? fSnap.data() : { user_uid: null, display_name: null, high_score: 0 };
        const second = sSnap.exists() ? sSnap.data() : { user_uid: null, display_name: null, high_score: 0 };
        const third = tSnap.exists() ? tSnap.data() : { user_uid: null, display_name: null, high_score: 0 };

        // remove existing occurrences of this uid from leaderboard to avoid duplicates
        let f = { ...first }, s = { ...second }, t = { ...third };
        if (f.user_uid === uid) f = { user_uid: null, display_name: null, high_score: 0 };
        if (s.user_uid === uid) s = { user_uid: null, display_name: null, high_score: 0 };
        if (t.user_uid === uid) t = { user_uid: null, display_name: null, high_score: 0 };

        // compute insert position
        if (newScore > (f.high_score || 0)) {
          // shift f -> s, s -> t, set f = new
          tx.set(thirdRef, { user_uid: s.user_uid, display_name: s.display_name, high_score: s.high_score });
          tx.set(secondRef, { user_uid: f.user_uid, display_name: f.display_name, high_score: f.high_score });
          tx.set(firstRef, { user_uid: uid, display_name, high_score: newScore });
        } else if (newScore > (s.high_score || 0)) {
          // shift s -> t, set s = new
          tx.set(thirdRef, { user_uid: s.user_uid, display_name: s.display_name, high_score: s.high_score });
          tx.set(secondRef, { user_uid: uid, display_name, high_score: newScore });
        } else if (newScore > (t.high_score || 0)) {
          // set t = new
          tx.set(thirdRef, { user_uid: uid, display_name, high_score: newScore });
        }
        // if not beating any, do nothing
      });
    } catch (err) {
      // non-fatal: log for debugging
      // eslint-disable-next-line no-console
      console.warn("Failed to update top_scorers:", err);
    }
  }

  // submit answer
  async function submitAnswer() {
    if (!question) {
      setResult({ status: "error", message: "No question loaded" });
      return;
    }
    const sol = question.solution;
    if (!sol) {
      setResult({ status: "unknown", message: "Solution not provided by API." });
      publish("answerSubmitted", { answer, correct: null });
      return;
    }

    const correct = String(answer).trim().toLowerCase() === String(sol).trim().toLowerCase();

    if (correct) {
      const nextStreak = (streak || 0) + 1;
      setStreak(nextStreak);
      localStorage.setItem("streak", String(nextStreak));
      setResult({ status: "correct" });

      if (nextStreak > (highScore || 0)) {
        setHighScore(nextStreak);
        localStorage.setItem("highScore", String(nextStreak));

        // persist high score to Firestore user document (doc id must equal auth uid)
        try {
          const uid = user?.uid ?? auth?.currentUser?.uid;
          if (uid) {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { high_score: nextStreak });
            // update leaderboard
            const displayName = profile?.display_name || user?.username || "guest";
            await updateTopScorers(uid, displayName, nextStreak);
          }
        } catch (e) {
          console.warn("Failed to update high_score in Firestore:", e);
        }
      }
    } else {
      // wrong answer: reset streak to 0
      setStreak(0);
      localStorage.setItem("streak", "0");
      setResult({ status: "incorrect", message: "Incorrect." });

      // optionally also persist reset (we don't lower stored high_score)
      try {
        const uid = user?.uid ?? auth?.currentUser?.uid;
        if (uid) {
          const userRef = doc(db, "users", uid);
          // do not change high_score on mistake; only update if you want to store last_streak etc.
          // await updateDoc(userRef, { last_streak: 0 });
        }
      } catch (e) {
        console.warn("Failed to write streak reset to Firestore (optional):", e);
      }
    }

    publish("answerSubmitted", { answer, correct });
  }

  // load last cached question
  function loadCached() {
    const raw = localStorage.getItem("lastQuestion");
    if (raw) {
      const q = JSON.parse(raw);
      setQuestion(q);
      publish("questionFetched", q);
      setImgError(false);
      setImgLoading(!!q?.image);
    }
  }

  // restore question on mount
  useEffect(() => {
    const raw = localStorage.getItem("lastQuestion");
    if (raw) {
      const q = JSON.parse(raw);
      setQuestion(q);
      setImgLoading(!!q?.image);
    }
  }, []);

  // logout handler: sign out, clear local state and navigate to /signin (replace history)
  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore signOut failures but continue cleanup
      // eslint-disable-next-line no-console
      console.warn("signOut failed:", e);
    }

    // clear local session state
    try {
      localStorage.removeItem("streak");
      localStorage.removeItem("highScore");
      localStorage.removeItem("lastQuestion");
    } catch {}

    // navigate to signin and replace history entry so back won't return to game
    // using location.replace ensures the browser history entry is replaced
    window.location.replace(`${window.location.origin}/signin`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center text-center">
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">Heart Game</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 sm:mt-0">
            <div>
              User: <span className="font-medium">{profile?.display_name || user?.username || "guest"}</span> | Score:{" "}
              <span className="font-semibold text-indigo-600">{streak}</span> | High:{" "}
              <span className="font-semibold text-indigo-600">{highScore}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={loadNewQuestion}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Fetch New Question
          </button>
          <button
            onClick={loadCached}
            className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            Load Cached
          </button>
        </div>

        {/* Question Image */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-full max-w-md h-56 sm:h-72 flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 shadow-inner bg-gray-50 relative">
            {question?.image ? (
              <>
                {imgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-4 border-t-indigo-600 border-gray-200 animate-spin" />
                      <div className="text-sm text-gray-600">Loading image…</div>
                    </div>
                  </div>
                )}

                <img
                  src={question.image}
                  alt={question.title || "question image"}
                  className="object-contain w-full h-full"
                  onLoad={() => setImgLoading(false)}
                  onError={() => { setImgLoading(false); setImgError(true); }}
                />

                {imgError && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="text-sm text-red-600 bg-white/80 p-2 rounded">Failed to load image</div>
                  </div>
                )}
              </>
            ) : (
              <ImageCard src={question?.image} />
            )}
          </div>
        </div>

        {/* Answer input */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
            placeholder="Type your answer..."
          />
          <button
            onClick={submitAnswer}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            Submit
          </button>
        </div>

        {/* Result Message */}
        <div className="mt-6 text-lg font-medium">
          {result?.status === "correct" && <div className="text-green-600">✅ Correct!</div>}
          {result?.status === "incorrect" && <div className="text-red-600">❌ Incorrect.</div>}
          {result?.status === "unknown" && <div className="text-yellow-600">⚠️ Solution not provided by API.</div>}
          {result?.status === "error" && <div className="text-red-600">⚠️ {result.message}</div>}
        </div>
      </div>
    </div>
  );
}
