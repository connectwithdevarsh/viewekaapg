import { 
  type User, type InsertUser, type Resident, type InsertResident,
  type Inquiry, type InsertInquiry, type Payment, type InsertPayment,
  type RoomStatus, type InsertRoomStatus, type Expense, type InsertExpense
} from "../shared/schema.js";
import { db } from "./firebase.js";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resident methods
  getAllResidents(): Promise<Resident[]>;
  getResident(id: string): Promise<Resident | undefined>;
  createResident(resident: InsertResident): Promise<Resident>;
  updateResident(id: string, resident: Partial<InsertResident>): Promise<Resident | undefined>;
  deleteResident(id: string): Promise<boolean>;

  // Inquiry methods
  getAllInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  markInquiryHandled(id: string): Promise<boolean>;

  // Payment methods
  getAllPayments(): Promise<(Payment & { resident: Resident })[]>;
  getPaymentsByResident(residentId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string, paidDate?: Date): Promise<Payment | undefined>;
  deletePayment(id: string): Promise<boolean>;

  // Room status methods
  getAllRoomStatus(): Promise<RoomStatus[]>;
  updateRoomStatus(roomType: string, totalRooms: number, occupiedRooms: number): Promise<RoomStatus>;

  // Expense methods
  getAllExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: string): Promise<boolean>;
}

export class FirebaseStorage implements IStorage {
  private basePath: string;

  constructor(pgId: string) {
    this.basePath = `tenants/${pgId}`;
  }

  private col(name: string) {
    if (!db) {
      throw new Error("Firebase DB is not initialized. Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables in Vercel.");
    }
    return db.collection(`${this.basePath}/${name}`);
  }

  private convertDate(data: any) {
    for (const key in data) {
      if (data[key] && typeof data[key].toDate === 'function') {
        data[key] = data[key].toDate();
      }
    }
    return data;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const doc = await this.col('users').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...this.convertDate(doc.data()) } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snap = await this.col('users').where('username', '==', username).limit(1).get();
    if (snap.empty) return undefined;
    const doc = snap.docs[0];
    return { id: doc.id, ...this.convertDate(doc.data()) } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const ref = await this.col('users').add({ ...insertUser });
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as User;
  }

  // Resident methods
  async getAllResidents(): Promise<Resident[]> {
    const snap = await this.col('residents').where('isActive', '==', true).get();
    const residents = snap.docs.map(doc => ({ id: doc.id, ...this.convertDate(doc.data()) } as Resident));
    return residents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getResident(id: string): Promise<Resident | undefined> {
    const doc = await this.col('residents').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...this.convertDate(doc.data()) } as Resident;
  }

  async createResident(insertResident: InsertResident): Promise<Resident> {
    const data = { ...insertResident, createdAt: new Date() };
    const ref = await this.col('residents').add(data);
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as Resident;
  }

  async updateResident(id: string, updateResident: Partial<InsertResident>): Promise<Resident | undefined> {
    const ref = this.col('residents').doc(id);
    await ref.update(updateResident);
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as Resident;
  }

  async deleteResident(id: string): Promise<boolean> {
    // Delete associated payments
    const paymentsSnap = await this.col('payments').where('residentId', '==', id).get();
    const batch = db.batch();
    paymentsSnap.docs.forEach(doc => batch.delete(doc.ref));
    batch.delete(this.col('residents').doc(id));
    await batch.commit();
    return true;
  }

  // Inquiry methods
  async getAllInquiries(): Promise<Inquiry[]> {
    const snap = await this.col('inquiries').get();
    const inquiries = snap.docs.map(doc => ({ id: doc.id, ...this.convertDate(doc.data()) } as Inquiry));
    return inquiries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const data = { ...insertInquiry, createdAt: new Date(), isHandled: false };
    const ref = await this.col('inquiries').add(data);
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as Inquiry;
  }

  async markInquiryHandled(id: string): Promise<boolean> {
    const ref = this.col('inquiries').doc(id);
    await ref.update({ isHandled: true });
    return true;
  }

  // Payment methods
  async getAllPayments(): Promise<(Payment & { resident: Resident })[]> {
    const paymentsSnap = await this.col('payments').orderBy('createdAt', 'desc').get();
    const payments = paymentsSnap.docs.map(doc => ({ id: doc.id, ...this.convertDate(doc.data()) } as Payment));
    
    // Fetch residents for these payments
    const residentIds = Array.from(new Set(payments.map(p => p.residentId)));
    const residentsMap = new Map<string, Resident>();
    
    await Promise.all(residentIds.map(async (rid) => {
      if (!residentsMap.has(rid)) {
        const res = await this.getResident(rid);
        if (res) residentsMap.set(rid, res);
      }
    }));

    return payments.map(p => ({
      ...p,
      resident: residentsMap.get(p.residentId)!
    })).filter(p => p.resident); // Filter out if resident not found
  }

  async getPaymentsByResident(residentId: string): Promise<Payment[]> {
    const snap = await this.col('payments').where('residentId', '==', residentId).get();
    return snap.docs.map(doc => ({ id: doc.id, ...this.convertDate(doc.data()) } as Payment));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const data = { ...insertPayment, createdAt: new Date() };
    const ref = await this.col('payments').add(data);
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as Payment;
  }

  async updatePaymentStatus(id: string, status: string, paidDate?: Date): Promise<Payment | undefined> {
    const ref = this.col('payments').doc(id);
    const updateData: any = { status };
    if (paidDate) updateData.paidDate = paidDate;
    await ref.update(updateData);
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as Payment;
  }

  async deletePayment(id: string): Promise<boolean> {
    await this.col('payments').doc(id).delete();
    return true;
  }

  // Room status methods
  async getAllRoomStatus(): Promise<RoomStatus[]> {
    const snap = await this.col('roomStatus').get();
    return snap.docs.map(doc => ({ id: doc.id, ...this.convertDate(doc.data()) } as RoomStatus));
  }

  async updateRoomStatus(roomType: string, totalRooms: number, occupiedRooms: number): Promise<RoomStatus> {
    const snap = await this.col('roomStatus').where('roomType', '==', roomType).limit(1).get();
    if (snap.empty) {
      const ref = await this.col('roomStatus').add({
        roomType, totalRooms, occupiedRooms, updatedAt: new Date()
      });
      const doc = await ref.get();
      return { id: doc.id, ...this.convertDate(doc.data()) } as RoomStatus;
    } else {
      const ref = snap.docs[0].ref;
      await ref.update({ totalRooms, occupiedRooms, updatedAt: new Date() });
      const doc = await ref.get();
      return { id: doc.id, ...this.convertDate(doc.data()) } as RoomStatus;
    }
  }

  // Expense methods
  async getAllExpenses(): Promise<Expense[]> {
    const snap = await this.col('expenses').orderBy('date', 'desc').limit(200).get();
    return snap.docs.map(doc => ({ id: doc.id, ...this.convertDate(doc.data()) } as Expense));
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const data = { ...expense, date: expense.date || new Date() };
    const ref = await this.col('expenses').add(data);
    const doc = await ref.get();
    return { id: doc.id, ...this.convertDate(doc.data()) } as Expense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    await this.col('expenses').doc(id).delete();
    return true;
  }
}

export const getStorage = (pgId?: string): IStorage => {
  if (pgId === 'chanakyapuri') return new FirebaseStorage('chanakyapuri');
  if (pgId === 'khatraj') return new FirebaseStorage('khatraj');
  throw new Error(`Invalid or missing pgLocation: ${pgId}. Strict routing requires either 'chanakyapuri' or 'khatraj'.`);
};
