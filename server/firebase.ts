import admin from 'firebase-admin';
import 'dotenv/config';

let db: admin.firestore.Firestore | undefined;
let auth: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn("Firebase environment variables are missing. Firebase will NOT initialize.");
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      db = admin.firestore();
      auth = admin.auth();
      console.log("Firebase Admin SDK initialized successfully.");
    }
  } catch (e) {
    console.error("Failed to initialize Firebase Admin SDK", e);
  }
} else {
  db = admin.firestore();
  auth = admin.auth();
}

export { db, auth };
