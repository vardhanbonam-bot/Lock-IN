import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAoBEuZJN1yotCRWJK8yvTAsNiecETnt3g",
  authDomain: "pro-truck-mnzsc.firebaseapp.com",
  projectId: "pro-truck-mnzsc",
  storageBucket: "pro-truck-mnzsc.firebasestorage.app",
  messagingSenderId: "106252920572",
  appId: "1:106252920572:web:573affb611cf3450681979"
};

const app = initializeApp(firebaseConfig);
// Using custom database ID specified in configuration
export const db = getFirestore(app, "ai-studio-lockedin-c681a67a-bdda-4d49-b7bd-5e5c553ace49");
