// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhFvqAZRtaqoa3eeLiP-vl5hoQHRAzR8I",
  authDomain: "skills-chat-app.firebaseapp.com",
  projectId: "skills-chat-app",
  storageBucket: "skills-chat-app.appspot.com",
  messagingSenderId: "331790088451",
  appId: "1:331790088451:web:b096f466c1aa7ff4609136"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)