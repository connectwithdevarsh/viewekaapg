import admin from 'firebase-admin';
import 'dotenv/config';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (e) {
    console.error("Failed to initialize Firebase Admin SDK", e);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
