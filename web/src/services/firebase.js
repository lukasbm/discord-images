import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTNjVSFxWMyMCCEC79Zg7JPFcAJ2V767o",
  authDomain: "discord-images.firebaseapp.com",
  projectId: "discord-images",
  storageBucket: "discord-images.appspot.com",
  messagingSenderId: "561420974982",
  appId: "1:561420974982:web:e27213fcafb15f22aa0a07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
