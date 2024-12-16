import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDrJQ81c1eDdixzH23wEMGHKzmQX3I4gYU",
  authDomain: "luten-a7799.firebaseapp.com",
  projectId: "luten-a7799",
  storageBucket: "luten-a7799.appspot.com",
  messagingSenderId: "1081041788287",
  appId: "1:1081041788287:web:d709547b7ba85d5609ce4a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
