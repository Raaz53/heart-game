import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { createUserModel } from "../models/userModel";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

// simple UUID fallback for login records
function createUUID() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = [...buf].map(n => n.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  } catch {
    return `uid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
  }
}

export default function SignIn() {
  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupError, setSignupError] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // snackbar
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    // clear errors when inputs change
    setLoginError(null);
    setSignupError(null);
  }, []);

  function validateEmail(e) {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  async function handleLoginSubmit(e) {
    e?.preventDefault();
    setLoginError(null);
    if (!loginEmail.trim()) return setLoginError("Email is required.");
    if (!validateEmail(loginEmail.trim())) return setLoginError("Invalid email.");
    if (!loginPassword.trim()) return setLoginError("Password is required.");

    setLoginLoading(true);
    try {
      // sign in with Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const user = cred?.user ?? auth.currentUser;
      if (!user) throw new Error("Authentication succeeded but no user found.");

      const uid = user.uid;

      // wait briefly (up to ~2s) for client auth state to settle
      if (!auth.currentUser || auth.currentUser.uid !== uid) {
        let attempts = 0;
        while ((!auth.currentUser || auth.currentUser.uid !== uid) && attempts < 10) {
          // 200ms * 10 = 2s max
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 200));
          attempts++;
        }
        if (!auth.currentUser || auth.currentUser.uid !== uid) {
          throw new Error("Auth state did not settle after sign-in.");
        }
      }

      // ensure users document exists (create minimal if missing)
      try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          const record = createUserModel
            ? createUserModel({ uid, display_name: "", email: loginEmail.trim() })
            : { uid, display_name: "", email: loginEmail.trim(), high_score: 0, created_at: serverTimestamp() };
          await setDoc(userRef, record);
        }
      } catch (e) {
        // non-fatal but surface to user
        setSnackbar({ show: true, message: "Signed in but failed to ensure profile." });
      }

      // record login in user_logins collection (non-fatal)
      try {
        await addDoc(collection(db, "user_logins"), {
          login_uid: createUUID(),
          user_uid: uid,
          email: loginEmail.trim(),
          created_at: serverTimestamp(),
        });
      } catch (e) {
        setSnackbar({ show: true, message: "Failed to record login." });
      }

      // write user_data snapshot (non-fatal)
      try {
        await addDoc(collection(db, "user_data"), {
          user_uid: uid,
          key: "profile",
          value: { email: loginEmail.trim(), signed_in_at: new Date().toISOString() },
          created_at: serverTimestamp(),
        });
      } catch (e) {
        setSnackbar({ show: true, message: "Could not write user_data." });
      }

      // only navigate after auth + profile ensured
      navigate("/game");
    } catch (err) {
      setLoginError(err?.message || "Sign in failed");
      setSnackbar({ show: true, message: err?.message || "Sign in failed" });
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignupSubmit(e) {
    e?.preventDefault();
    setSignupError(null);
    if (!signupEmail.trim()) return setSignupError("Email is required.");
    if (!validateEmail(signupEmail.trim())) return setSignupError("Invalid email.");
    if (!signupPassword.trim()) return setSignupError("Password is required.");

    setSignupLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      const user = cred.user;
      if (!user) throw new Error("Failed to create auth user");

      // use serverTimestamp for created_at
      const uid = user.uid;

      // ensure auth state is set (optional)
      if (!auth.currentUser || auth.currentUser.uid !== uid) {
        // wait briefly for client auth state to settle
        await new Promise((r) => setTimeout(r, 200));
      }

      const record = createUserModel
        ? createUserModel({ uid, display_name: signupUsername.trim() || "", email: signupEmail.trim() })
        : { uid, display_name: signupUsername.trim() || "", email: signupEmail.trim(), high_score: 0, created_at: serverTimestamp() };

      // now write user doc (doc id must equal auth uid to satisfy rules)
      await setDoc(doc(db, "users", uid), record);

      // create user_data snapshot
      try {
        await addDoc(collection(db, "user_data"), {
          user_uid: uid,
          key: "profile",
          value: { email: signupEmail.trim(), created_at: new Date().toISOString() },
          created_at: serverTimestamp(),
        });
      } catch (e) {
        setSnackbar({ show: true, message: "Could not write user_data." });
      }

      navigate("/game");
    } catch (err) {
      setSignupError(err?.message || "Signup failed");
      setSnackbar({ show: true, message: err?.message || "Signup failed" });
    } finally {
      setSignupLoading(false);
    }
  }

  // snackbar auto-hide
  useEffect(() => {
    if (!snackbar.show) return;
    const t = setTimeout(() => setSnackbar({ show: false, message: "" }), 4000);
    return () => clearTimeout(t);
  }, [snackbar.show]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Login box */}
        <form onSubmit={handleLoginSubmit} className="relative bg-white rounded-lg shadow-md p-6 flex flex-col">
          {loginLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin" />
                <div className="text-sm text-gray-600 mt-2">Signing in…</div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Login</h3>
          </div>

          <div className="mb-3">
            <label className="text-sm mb-1 block">Email (required)</label>
            <input
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-sm mb-1 block">Password</label>
            <input
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {loginError && <div className="text-red-600 text-sm mb-3">{loginError}</div>}

          <div className="mt-auto flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
            <button type="button" onClick={() => { setLoginEmail(""); setLoginPassword(""); setLoginError(null); }} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </form>

        {/* Signup box */}
        <form onSubmit={handleSignupSubmit} className="relative bg-white rounded-lg shadow-md p-6 flex flex-col">
          {signupLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-t-green-600 border-gray-200 rounded-full animate-spin" />
                <div className="text-sm text-gray-600 mt-2">Creating account…</div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Sign Up</h3>
          </div>

          <div className="mb-3">
            <label className="text-sm mb-1 block">Email (required)</label>
            <input
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-sm mb-1 block">Password</label>
            <input
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-sm mb-1 block">Display name (optional)</label>
            <input
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              type="text"
              placeholder="Optional display name"
              className="w-full border p-2 rounded"
            />
          </div>

          {signupError && <div className="text-red-600 text-sm mb-3">{signupError}</div>}

          <div className="mt-auto flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded">Sign Up</button>
            <button type="button" onClick={() => { setSignupEmail(""); setSignupPassword(""); setSignupUsername(""); setSignupError(null); }} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </form>
      </div>

      {/* Snackbar */}
      {snackbar.show && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-8 bg-gray-900 text-white px-4 py-2 rounded shadow">
          {snackbar.message}
        </div>
      )}
    </div>
  );
}