import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return {
      user: result.user,
      accessToken: idToken,
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export default auth;
