// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa2oHOul1XFn0i3_nMCcAfZL5FAb4Tm7g",
  authDomain: "tcc-projeto-ebe62.firebaseapp.com",
  projectId: "tcc-projeto-ebe62",
  storageBucket: "tcc-projeto-ebe62.appspot.com",
  messagingSenderId: "582297812864",
  appId: "1:582297812864:web:aa869782f70ff455fa4b65",
  measurementId: "G-7CJJM13Y9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database, collection, doc, deleteDoc, addDoc, updateDoc };