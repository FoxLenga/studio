import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBMZJDd4DcRKM-483UxAP2qBAwNOeDngUU",
  authDomain: "studio-2323550965-5c2f7.firebaseapp.com",
  projectId: "studio-2323550965-5c2f7",
  storageBucket: "studio-2323550965-5c2f7.appspot.com",
  messagingSenderId: "761993554418",
  appId: "1:761993554418:web:b8ebe0d4c8c771fecee36b",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn(
        'Multiple tabs open, persistence can only be enabled in one tab at a time.'
      );
    } else if (err.code == 'unimplemented') {
      console.warn(
        'The current browser does not support all of the features required to enable persistence.'
      );
    }
  });
}


export { app, auth, db };
