import { 
  users, residents, inquiries, payments, roomStatus, expenses,
  type User, type InsertUser, type Resident, type InsertResident,
  type Inquiry, type InsertInquiry, type Payment, type InsertPayment,
  type RoomStatus, type InsertRoomStatus, type Expense, type InsertExpense
} from "../shared/schema.js";
import { db1, db2 } from "./db.js";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resident methods
  getAllResidents(): Promise<Resident[]>;
  getResident(id: number): Promise<Resident | undefined>;
  createResident(resident: InsertResident): Promise<Resident>;
  updateResident(id: number, resident: Partial<InsertResident>): Promise<Resident | undefined>;
  deleteResident(id: number): Promise<boolean>;

  // Inquiry methods
  getAllInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  markInquiryHandled(id: number): Promise<boolean>;

  // Payment methods
  getAllPayments(): Promise<(Payment & { resident: Resident })[]>;
  getPaymentsByResident(residentId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string, paidDate?: Date): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;

  // Room status methods
  getAllRoomStatus(): Promise<RoomStatus[]>;
  updateRoomStatus(roomType: string, totalRooms: number, occupiedRooms: number): Promise<RoomStatus>;

  // Expense methods
  getAllExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  constructor(private db: any) {}

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Resident methods
  async getAllResidents(): Promise<Resident[]> {
    return await this.db.select().from(residents).where(eq(residents.isActive, true)).orderBy(desc(residents.createdAt));
  }

  async getResident(id: number): Promise<Resident | undefined> {
    const [resident] = await this.db.select().from(residents).where(eq(residents.id, id));
    return resident || undefined;
  }

  async createResident(insertResident: InsertResident): Promise<Resident> {
    const [resident] = await this.db
      .insert(residents)
      .values(insertResident)
      .returning();
    return resident;
  }

  async updateResident(id: number, updateResident: Partial<InsertResident>): Promise<Resident | undefined> {
    const [resident] = await this.db
      .update(residents)
      .set(updateResident)
      .where(eq(residents.id, id))
      .returning();
    return resident || undefined;
  }

  async deleteResident(id: number): Promise<boolean> {
    // Delete associated payments first to prevent foreign key errors
    await this.db.delete(payments).where(eq(payments.residentId, id));
    
    // Now perform a hard delete on the resident
    const result = await this.db
      .delete(residents)
      .where(eq(residents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Inquiry methods
  async getAllInquiries(): Promise<Inquiry[]> {
    return await this.db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await this.db
      .insert(inquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async markInquiryHandled(id: number): Promise<boolean> {
    const result = await this.db
      .update(inquiries)
      .set({ isHandled: true })
      .where(eq(inquiries.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Payment methods
  async getAllPayments(): Promise<(Payment & { resident: Resident })[]> {
    return await this.db
      .select()
      .from(payments)
      .leftJoin(residents, eq(payments.residentId, residents.id))
      .orderBy(desc(payments.createdAt))
      .then((results: any) => 
        results.map((result: any) => ({
          ...result.payments,
          resident: result.residents!
        }))
      );
  }

  async getPaymentsByResident(residentId: number): Promise<Payment[]> {
    return await this.db.select().from(payments).where(eq(payments.residentId, residentId));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await this.db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async updatePaymentStatus(id: number, status: string, paidDate?: Date): Promise<Payment | undefined> {
    const [payment] = await this.db
      .update(payments)
      .set({ status, paidDate })
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await this.db
      .delete(payments)
      .where(eq(payments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Room status methods
  async getAllRoomStatus(): Promise<RoomStatus[]> {
    return await this.db.select().from(roomStatus);
  }

  async updateRoomStatus(roomType: string, totalRooms: number, occupiedRooms: number): Promise<RoomStatus> {
    const [status] = await this.db
      .insert(roomStatus)
      .values({ roomType, totalRooms, occupiedRooms })
      .onConflictDoUpdate({
        target: roomStatus.roomType,
        set: { totalRooms, occupiedRooms, updatedAt: new Date() }
      })
      .returning();
    return status;
  }

  // Expense methods
  async getAllExpenses(): Promise<Expense[]> {
    return await this.db.select().from(expenses).orderBy(desc(expenses.date)).limit(200);
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [ex] = await this.db.insert(expenses).values(expense).returning();
    return ex;
  }

  async deleteExpense(id: number): Promise<boolean> {
    const result = await this.db.delete(expenses).where(eq(expenses.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage1 = new DatabaseStorage(db1);
export const storage2 = new DatabaseStorage(db2);

export const getStorage = (pgId?: string): IStorage => {
  if (pgId === 'chanakyapuri') return storage1;
  if (pgId === 'khatraj') return storage2;
  throw new Error(`Invalid or missing pgLocation: ${pgId}. Strict routing requires either 'chanakyapuri' or 'khatraj'.`);
};
