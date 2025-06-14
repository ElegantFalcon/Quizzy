// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fix persistence setup by making it async and handling properly
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
})();

const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, provider };
