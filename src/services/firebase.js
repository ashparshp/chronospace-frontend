// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Replace with your Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAZakXKMvdhzQxE74pwd7fav1IGANKyl5s",
  authDomain: "chronospace-3d550.firebaseapp.com",
  projectId: "chronospace-3d550",
  storageBucket: "chronospace-3d550.appspot.com",
  messagingSenderId: "81648675498",
  appId: "1:81648675498:web:01afe323f630b31299fed3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Get the user's information
    const user = result.user;

    // Get the access token from the auth credential
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    return { user, accessToken };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export default auth;
