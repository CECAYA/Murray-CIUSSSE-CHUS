// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAElbh1G-0B5xadXbLNxFBxtHXLo8eRcJE",
  authDomain: "murray-ciussse-chus-d010a.firebaseapp.com",
  projectId: "murray-ciussse-chus-d010a",
  storageBucket: "murray-ciussse-chus-d010a.appspot.com",
  messagingSenderId: "494340123930",
  appId: "1:494340123930:web:aa035f4d1dce87828690a3",
  measurementId: "G-1T54V9VL43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);