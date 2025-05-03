import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjZ59IM10FZsyICbBzztflkQ4xWZFBrfk",
  authDomain: "visual-area.firebaseapp.com",
  projectId: "visual-area",
  storageBucket: "visual-area.firebasestorage.app",
  messagingSenderId: "469502796285",
  appId: "1:469502796285:web:3b985441ee10e60802f994",
  measurementId: "G-L1RS03YHW4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);


