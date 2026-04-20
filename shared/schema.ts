import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const residents = pgTable("residents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  roomNumber: text("room_number").notNull(),
  college: text("college").notNull(),
  joiningDate: timestamp("joining_date").notNull(),
  roomType: text("room_type").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  college: text("college").notNull(),
  roomType: text("room_type").notNull(),
  stayDuration: text("stay_duration"),
  phone: text("phone").notNull(),
  pgLocation: text("pg_location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isHandled: boolean("is_handled").default(false),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  residentId: integer("resident_id").references(() => residents.id),
  month: text("month").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomStatus = pgTable("room_status", {
  id: serial("id").primaryKey(),
  roomType: text("room_type").notNull(),
  totalRooms: integer("total_rooms").notNull(),
  occupiedRooms: integer("occupied_rooms").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'income' or 'expense'
  category: text("category").notNull(),
  date: timestamp("date").defaultNow(),
});

// Relations
export const residentsRelations = relations(residents, ({ many }) => ({
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  resident: one(residents, {
    fields: [payments.residentId],
    references: [residents.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResidentSchema = createInsertSchema(residents, {
  joiningDate: z.coerce.date()
}).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  isHandled: true,
});

export const insertPaymentSchema = createInsertSchema(payments, {
  dueDate: z.coerce.date(),
  paidDate: z.coerce.date().optional()
}).omit({
  id: true,
  createdAt: true,
});

export const insertRoomStatusSchema = createInsertSchema(roomStatus).omit({
  id: true,
  updatedAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses, {
  date: z.coerce.date().optional(),
  amount: z.union([z.string(), z.number()]).transform((v) => v.toString()),
  type: z.enum(["income", "expense"])
}).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Resident = typeof residents.$inferSelect;
export type InsertResident = z.infer<typeof insertResidentSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type RoomStatus = typeof roomStatus.$inferSelect;
export type InsertRoomStatus = z.infer<typeof insertRoomStatusSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
