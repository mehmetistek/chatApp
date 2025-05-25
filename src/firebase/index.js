// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMp1772FBV-YZHvTOVbqfjv___rg-Vaio",
  authDomain: "fir-lesson-1-31206.firebaseapp.com",
  projectId: "fir-lesson-1-31206",
  storageBucket: "fir-lesson-1-31206.appspot.com",
  messagingSenderId: "877215009016",
  appId: "1:877215009016:web:d555f8ad5a505fff44530d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firebase auth referensını al
export const auth = getAuth(app);

// google sağlayıcısını kur
export const provider = new GoogleAuthProvider();

// firestore veritabanını referansını al
export const db = getFirestore(app);