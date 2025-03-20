import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || null,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
  projectId: process.env.FIREBASE_PROJECT_ID || null,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || null,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || null,
  appId: process.env.FIREBASE_APP_ID || null,
};

const firebase = initializeApp(firebaseConfig);

export default firebase;

