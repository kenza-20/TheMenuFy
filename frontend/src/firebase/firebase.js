// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_VIOJGlrC5BFZ5pHnsPs7e9pzR3bKztM",
  authDomain: "menufy-1740831067195.firebaseapp.com",
  projectId: "menufy-1740831067195",
  storageBucket: "menufy-1740831067195.firebasestorage.app",
  messagingSenderId: "783007975316",
  appId: "1:783007975316:web:2111ccc188f0fbde663181",
  measurementId: "G-1XS1CY4ESS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

// Google Sign-In Function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user); // Handle user data here
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};
export { auth, provider, signInWithGoogle };
