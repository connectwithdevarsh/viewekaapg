import admin from 'firebase-admin';
import 'dotenv/config';

async function cleanupInitDocs() {
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
    const locations = ['chanakyapuri', 'khatraj'];
    
    for (const loc of locations) {
      await db.collection(`tenants/${loc}/residents`).doc('_init_').delete().catch(() => {});
      await db.collection(`tenants/${loc}/payments`).doc('_init_').delete().catch(() => {});
      await db.collection(`tenants/${loc}/expenses`).doc('_init_').delete().catch(() => {});
      await db.collection(`tenants/${loc}/inquiries`).doc('_init_').delete().catch(() => {});
      await db.collection(`tenants/${loc}/users`).doc('_init_').delete().catch(() => {});
    }
    
    console.log("Cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("FAILED to cleanup database:", error.message);
    process.exit(1);
  }
}

cleanupInitDocs();
