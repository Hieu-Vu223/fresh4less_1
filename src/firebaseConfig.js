import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, onMessage } from 'firebase/messaging'; // Import messaging

const firebaseConfig = {
  apiKey: "AIzaSyCdYjWcicM_IoHhBoB5q80o-HVjSOjLahY",
  authDomain: "fresh4less-d3f51.firebaseapp.com",
  projectId: "fresh4less-d3f51",
  storageBucket: "fresh4less-d3f51.appspot.com",
  messagingSenderId: "307206325270",
  appId: "1:307206325270:web:a5e410426709ea5327a137",
  measurementId: "G-15SR8E55VR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app); // Initialize FCM

// Request permission for notifications
const requestFCMPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Unable to get notification permission:", error);
  }
};

function getDB() {
  return db
}

export { auth, db, getDB, messaging, requestFCMPermission };
