
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: "AIzaSyDGj7DT5lLQ2Qj659_kmYtdP_VlqHJg09s",
  authDomain: "balatro-360d8.firebaseapp.com",
  projectId: "balatro-360d8",
  storageBucket: "balatro-360d8.firebasestorage.app",
  messagingSenderId: "379887965503",
  appId: "1:379887965503:web:fded34160ea4b2cf3e6f8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
