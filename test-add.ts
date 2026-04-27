import { getStorage } from './server/storage.js';

async function testAdd() {
  try {
    const storage = getStorage('chanakyapuri');
    const newRes = await storage.createResident({
      name: "Test User",
      mobile: "9876543210",
      roomNumber: "101",
      college: "Test College",
      joiningDate: new Date(),
      roomType: "1-sharing",
      isActive: true
    });
    console.log("Successfully added resident! ID:", newRes.id);
    
    // Now delete it
    await storage.deleteResident(newRes.id);
    console.log("Successfully deleted resident!");
    
    process.exit(0);
  } catch(e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
testAdd();
