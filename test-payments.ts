import { getStorage } from './server/storage.js';

async function test() {
  try {
    const storage = getStorage('chanakyapuri');
    const res = await storage.getAllPayments();
    console.log("Success! Found:", res.length);
    process.exit(0);
  } catch(e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
test();
