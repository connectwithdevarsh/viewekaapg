import admin from 'firebase-admin';
import 'dotenv/config';

async function testConnection() {
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
    console.log("Checking Firebase connection...");
    
    // Perform a simple read to verify connectivity
    const testDoc = await db.collection('system_test').doc('ping').get();
    
    console.log("SUCCESS! Database connectivity is established. Connected to project:", process.env.FIREBASE_PROJECT_ID);
    process.exit(0);
  } catch (error) {
    console.error("FAILED! Could not connect to Firebase. Error:", error.message);
    process.exit(1);
  }
}

testConnection();
