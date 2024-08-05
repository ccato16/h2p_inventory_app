import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0xpjarOkN6L9ZJDe63GrCGhUXcF8G808",
  authDomain: "inventorymanagement-b298c.firebaseapp.com",
  projectId: "inventorymanagement-b298c",
  storageBucket: "inventorymanagement-b298c.appspot.com",
  messagingSenderId: "267052347510",
  appId: "1:267052347510:web:3b1cfd7a1b7e7ffe092f57",
  measurementId: "G-0CWSGQTKB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.log('Firebase Analytics is not supported in this environment', err);
});

const firestore = getFirestore(app);

export { firestore };
