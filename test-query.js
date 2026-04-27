import admin from 'firebase-admin';
import 'dotenv/config';

async function testQuery() {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
    }

    const db = admin.firestore();
    const snap = await db.collection('tenants/chanakyapuri/residents').where('isActive', '==', true).orderBy('createdAt', 'desc').get();
    console.log("Success! Docs:", snap.docs.length);
    process.exit(0);
  } catch (error) {
    console.error("Query failed:", error.message);
    process.exit(1);
  }
}

testQuery();
