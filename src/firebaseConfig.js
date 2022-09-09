import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAjAdErz2dVxvIvl6wugtUIctB7_logoVw",
  authDomain: "notes-app-1e2dc.firebaseapp.com",
  projectId: "notes-app-1e2dc",
  storageBucket: "notes-app-1e2dc.appspot.com",
  messagingSenderId: "926778008419",
  appId: "1:926778008419:web:598a0a18f823e1c2b2a956",
  measurementId: "G-LE63K8F8Z3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);