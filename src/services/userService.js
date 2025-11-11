import { auth, db } from "../utils/firebase";
import { createUserModel } from "../models/userModel";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Sign up using Firebase Auth and create a user document in Firestore 'users' collection.
 * Returns { user, profile } on success.
 */
export async function signUpUser({ email, password, displayName = "" }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred?.user;
  if (!user) throw new Error("Failed to create auth user");

  const uid = user.uid;

  const record = {
    uid,
    display_name: displayName || "",
    email,
    high_score: 0,
    created_at: serverTimestamp(),
  };

  // create / overwrite the user document using uid as doc id
  await setDoc(doc(db, "users", uid), record);

  // return minimal profile copy (created_at will be server timestamp)
  return { user, profile: record };
}
