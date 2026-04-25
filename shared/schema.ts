import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertResidentSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().min(1),
  roomNumber: z.string().min(1),
  college: z.string().min(1),
  joiningDate: z.coerce.date(),
  roomType: z.string().min(1),
  isActive: z.boolean().optional().default(true),
});

export const insertInquirySchema = z.object({
  studentName: z.string().min(1),
  college: z.string().min(1),
  roomType: z.string().min(1),
  stayDuration: z.string().optional(),
  phone: z.string().min(1),
  pgLocation: z.string().optional().default("chanakyapuri"),
});

export const insertPaymentSchema = z.object({
  residentId: z.string().min(1),
  month: z.string().min(1),
  amount: z.union([z.string(), z.number()]).transform((v) => v.toString()),
  dueDate: z.coerce.date(),
  paidDate: z.coerce.date().optional(),
  status: z.string().optional().default("pending"),
});

export const insertRoomStatusSchema = z.object({
  roomType: z.string().min(1),
  totalRooms: z.number().int(),
  occupiedRooms: z.number().int().optional().default(0),
});

export const insertExpenseSchema = z.object({
  amount: z.union([z.string(), z.number()]).transform((v) => v.toString()),
  description: z.string().min(1),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  date: z.coerce.date().optional(),
});

export interface User {
  id: string;
  username: string;
}

export interface Resident {
  id: string;
  name: string;
  mobile: string;
  roomNumber: string;
  college: string;
  joiningDate: Date;
  roomType: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Inquiry {
  id: string;
  studentName: string;
  college: string;
  roomType: string;
  stayDuration?: string | null;
  phone: string;
  pgLocation: string;
  createdAt: Date;
  isHandled: boolean;
}

export interface Payment {
  id: string;
  residentId: string;
  month: string;
  amount: string;
  dueDate: Date;
  paidDate?: Date | null;
  status: string;
  createdAt: Date;
}

export interface RoomStatus {
  id: string;
  roomType: string;
  totalRooms: number;
  occupiedRooms: number;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  amount: string;
  description: string;
  type: "income" | "expense";
  category: string;
  date: Date;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertResident = z.infer<typeof insertResidentSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertRoomStatus = z.infer<typeof insertRoomStatusSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
