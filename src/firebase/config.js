// src/firebase/config.js
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCk3nSg0O3uxkwyHFJCfcN9SIu17z3W1Ys",
    authDomain: "phonicslms.firebaseapp.com",
    projectId: "phonicslms",
    storageBucket: "phonicslms.firebasestorage.app",
    messagingSenderId: "421236695837",
    appId: "1:421236695837:web:28732b5f99a80f24a237f4",
    measurementId: "G-05DFTGRJL5"
};


const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };