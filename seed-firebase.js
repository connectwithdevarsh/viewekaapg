import admin from 'firebase-admin';
import 'dotenv/config';

async function seedDatabase() {
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
    console.log("Pushing initial tables (collections) to Firebase...");

    const locations = ['chanakyapuri', 'khatraj'];
    const defaultRooms = [
      { roomType: "1-sharing", totalRooms: 5, occupiedRooms: 0 },
      { roomType: "2-sharing", totalRooms: 5, occupiedRooms: 0 },
      { roomType: "5-sharing", totalRooms: 2, occupiedRooms: 0 },
      { roomType: "6-sharing", totalRooms: 4, occupiedRooms: 0 }
    ];

    for (const loc of locations) {
      console.log(`Setting up collections for tenant: ${loc}`);
      
      // Seed room status
      for (const room of defaultRooms) {
        // Use set to prevent duplicates if ran multiple times
        await db.collection(`tenants/${loc}/roomStatus`).doc(room.roomType).set({
          ...room,
          updatedAt: new Date()
        });
      }

      // Create empty placeholder documents to ensure collections show up in Firebase Console
      await db.collection(`tenants/${loc}/residents`).doc('_init_').set({ _initialized: true, createdAt: new Date() });
      await db.collection(`tenants/${loc}/payments`).doc('_init_').set({ _initialized: true, createdAt: new Date() });
      await db.collection(`tenants/${loc}/expenses`).doc('_init_').set({ _initialized: true, createdAt: new Date() });
      await db.collection(`tenants/${loc}/inquiries`).doc('_init_').set({ _initialized: true, createdAt: new Date() });
      await db.collection(`tenants/${loc}/users`).doc('_init_').set({ _initialized: true, createdAt: new Date() });
    }
    
    console.log("SUCCESS! All collections have been initialized in Firestore.");
    process.exit(0);
  } catch (error) {
    console.error("FAILED to seed database:", error.message);
    process.exit(1);
  }
}

seedDatabase();
