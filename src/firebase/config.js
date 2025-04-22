// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
  
export const firebaseConfig = {
  apiKey: "AIzaSyCk3nSg0O3uxkwyHFJCfcN9SIu17z3W1Ys",
  authDomain: "phonicslms.firebaseapp.com",
  projectId: "phonicslms",
  databaseURL: "https://phonicslms-default-rtdb.firebaseio.com", 
  storageBucket: "phonicslms.appspot.com",
  messagingSenderId: "421236695837",
  appId: "1:421236695837:web:28732b5f99a80f24a237f4",
  measurementId: "G-05DFTGRJL5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { firebaseConfig, auth, database, storage };
