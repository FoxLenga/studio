import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence, type Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if the config is valid
const app = !!firebaseConfig.apiKey && !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
let db: Firestore;

// Only initialize services on the client side
if (typeof window !== 'undefined') {
  auth = getAuth(app);
  db = getFirestore(app);
  try {
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
  } catch (error) {
    console.error("Firebase persistence error:", error);
  }
}

// @ts-ignore
export { app, auth, db };
