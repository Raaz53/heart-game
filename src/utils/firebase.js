// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// read config from Vite env (import.meta.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDGqU1RGCv3xAM17u1oS_n0cXa6rVK7qWA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "heart-game-e7c87.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "heart-game-e7c87",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "heart-game-e7c87.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "442390835808",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:442390835808:web:de65d4a8f4beb229100905",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GM20V2CM95",
};

// initialize app once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// analytics only in browser and if measurementId present
let analytics = null;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics may fail in some environments — ignore
    analytics = null;
  }
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db, firebaseConfig };