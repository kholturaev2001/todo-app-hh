import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJ0HPjgcFbaqV5foCOG8P0sEGhs_AsGC4",
  authDomain: "todo-app-65c0e.firebaseapp.com",
  projectId: "todo-app-65c0e",
  storageBucket: "todo-app-65c0e.appspot.com",
  messagingSenderId: "1015520767273",
  appId: "1:1015520767273:web:82ee4019f3a7ed66b4db38"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);