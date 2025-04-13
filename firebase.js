// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { browserLocalPersistence, setPersistence } from "firebase/auth";

// Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDmBd80V7KlHSpurc9NQRvXAuD16N8Pdr8",
  authDomain: "quizzy-4bbf4.firebaseapp.com",
  projectId: "quizzy-4bbf4",
  storageBucket: "quizzy-4bbf4.appspot.com",
  //messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Add this if you have it
  //appId: "YOUR_APP_ID", // Add this if you have it
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider
provider.setCustomParameters({
  prompt: 'select_account'
});

// Set persistence properly
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error("Error setting persistence:", error);
  }
})();

export { auth, provider };
