import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { getStorage, type IStorage } from "./storage.js";
import { insertExpenseSchema, insertResidentSchema, insertInquirySchema, insertPaymentSchema, type Resident, type Payment } from "../shared/schema.js";
import { auth } from "./firebase.js";

declare module 'express-serve-static-core' {
  interface Request {
    storage: IStorage;
    user?: any;
  }
}



// In-memory admin fallback (for when DB is not set up)
// Kept for backward compatibility if needed, but Firebase Auth is preferred
const ADMIN_USER = {
  id: "admin",
  username: "RADHE",
  password: "@RADHE011"
};

// Middleware to verify Firebase ID Token or Admin Fallback
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  // Allow a fallback "admin" token for the frontend before it's fully migrated
  if (token === 'admin-fallback-token') {
    req.user = { uid: "admin", role: "admin" };
    return next();
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase auth verification error", error);
    return res.sendStatus(403);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to attach storage based on pg location header/body
  app.use((req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.path.startsWith('/api/')) {
        return next();
      }
      if (req.path === '/api/auth/login') {
        return next();
      }
      const pgId = req.body?.pgLocation || req.query?.pgLocation || req.headers['x-pg-id'];
      if (!pgId) {
        return res.status(400).json({ 
          message: "pgLocation is REQUIRED", 
          details: "Missing pgLocation in body, query, or x-pg-id header."
        });
      }
      if (pgId !== 'chanakyapuri' && pgId !== 'khatraj') {
          return res.status(400).json({ message: "Invalid pgLocation. Strictly only 'chanakyapuri' or 'khatraj' allowed." });
      }
      req.storage = getStorage(pgId as string);
      next();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password, token } = req.body;

      // If client sends a Firebase ID token
      if (token) {
        try {
          const decoded = await auth.verifyIdToken(token);
          return res.json({ token, user: { id: decoded.uid, username: decoded.email } });
        } catch (err) {
          return res.status(401).json({ message: "Invalid Firebase token" });
        }
      }

      // Fallback to legacy hardcoded admin for frontend compatibility during migration
      if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        return res.json({ token: 'admin-fallback-token', user: { id: ADMIN_USER.id, username: ADMIN_USER.username } });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact form submission
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await req.storage.createInquiry(validatedData);
      return res.status(201).json(inquiry);
    } catch (error: any) {
      res.status(400).json({ 
        message: "Invalid inquiry data", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Protected admin routes
  app.get("/api/residents", authenticateToken, async (req, res) => {
    try {
      const residents = await req.storage.getAllResidents();
      return res.json(residents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch residents" });
    }
  });

  app.post("/api/residents", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertResidentSchema.parse(req.body);
      const resident = await req.storage.createResident(validatedData);
      return res.status(201).json(resident);
    } catch (error) {
      res.status(400).json({ message: "Invalid resident data" });
    }
  });

  app.put("/api/residents/:id", authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertResidentSchema.partial().parse(req.body);
      const resident = await req.storage.updateResident(id, validatedData);
      if (!resident) {
        return res.status(404).json({ message: "Resident not found" });
      }
      res.json(resident);
    } catch (error) {
      res.status(400).json({ message: "Invalid resident data" });
    }
  });

  app.delete("/api/residents/:id", authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const success = await req.storage.deleteResident(id);
      if (!success) {
        return res.status(404).json({ message: "Resident not found" });
      }
      res.json({ message: "Resident deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resident" });
    }
  });

  app.get("/api/inquiries", authenticateToken, async (req, res) => {
    try {
      const inquiries = await req.storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.put("/api/inquiries/:id/handled", authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const success = await req.storage.markInquiryHandled(id);
      if (!success) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json({ message: "Inquiry marked as handled" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  app.get("/api/payments", authenticateToken, async (req, res) => {
    try {
      const payments = await req.storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await req.storage.createPayment(validatedData);

      const amountAsNumber = Number(payment.amount);
      if (!isNaN(amountAsNumber)) {
        await req.storage.createExpense({
          amount: amountAsNumber.toString(),
          description: `Resident Payment (Resident ID: ${payment.residentId})`,
          type: 'income',
          category: 'Fee Payment',
          date: new Date()
        });
      }

      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid payment data", details: error });
    }
  });

  app.put("/api/payments/:id/status", authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const { status, paidDate } = req.body;
      const payment = await req.storage.updatePaymentStatus(id, status, paidDate ? new Date(paidDate) : undefined);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      if (status === 'paid') {
        const amountAsNumber = Number(payment.amount);
        if (!isNaN(amountAsNumber)) {
          await req.storage.createExpense({
            amount: amountAsNumber.toString(),
            description: `Fee payment from resident ${payment.residentId}`,
            type: 'income',
            category: 'Fee Payment',
            date: new Date()
          });
        }
      }
      
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  app.delete("/api/payments/:id", authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const success = await req.storage.deletePayment(id);
      if (!success) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  app.get("/api/room-status", authenticateToken, async (req, res) => {
    try {
      const dbRoomStatus = await req.storage.getAllRoomStatus();
      const residents = await req.storage.getAllResidents();
      const activeResidents = residents.filter((r: Resident) => r.isActive !== false);

      const counts = activeResidents.reduce((acc: Record<string, number>, r: Resident) => {
        const type = r.roomType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const defaultTotal = { "1-sharing": 5, "2-sharing": 5, "5-sharing": 2, "6-sharing": 4 };
      const roomTypes = ["1-sharing", "2-sharing", "5-sharing", "6-sharing"];

      const result = roomTypes.map(type => {
        let dbTotal = defaultTotal[type as keyof typeof defaultTotal];
        const dbStatus = dbRoomStatus.find((rs: any) => rs.roomType === type || rs.roomType.startsWith(type.split('-')[0]));
        if (dbStatus) {
           dbTotal = dbStatus.totalRooms;
        }

        return {
          roomType: type,
          totalRooms: dbTotal,
          occupiedRooms: counts[type] || 0
        };
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room status" });
    }
  });

  app.get("/api/room-details/:roomType", authenticateToken, async (req, res) => {
    try {
      const roomType = req.params.roomType;
      const residents = await req.storage.getAllResidents();
      const payments = await req.storage.getAllPayments();
      
      const normalizedParam = roomType.toLowerCase().replace(/[^a-z0-9]/g, '');
      const roomResidents = residents.filter((r: Resident) => {
        const normalizedDb = (r.roomType || "").toLowerCase().replace(/[^a-z0-9]/g, '');
        return (normalizedDb === normalizedParam || normalizedDb.includes(normalizedParam) || normalizedParam.includes(normalizedDb)) && r.isActive !== false;
      });
      
      roomResidents.sort((a: Resident, b: Resident) => {
         const aNum = parseInt(a.roomNumber) || 0;
         const bNum = parseInt(b.roomNumber) || 0;
         if (aNum === bNum) return a.roomNumber.localeCompare(b.roomNumber);
         return aNum - bNum;
      });

      const roomDetails = roomResidents.map((resident: Resident) => {
        const residentPayments = payments.filter((p: Payment) => p.residentId === resident.id);
        return {
          ...resident,
          payments: residentPayments
        };
      });
      
      res.json(roomDetails);
    } catch (error) {
      console.error("Room details error:", error);
      res.status(500).json({ message: "Failed to fetch room details" });
    }
  });

  app.get("/api/expenses", authenticateToken, async (req: any, res) => {
    try {
      const expenses = await req.storage.getAllExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await req.storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      console.error("Expense creation error:", error);
      res.status(400).json({ message: "Invalid expense data", details: error });
    }
  });

  app.delete("/api/expenses/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = req.params.id;
      const success = await req.storage.deleteExpense(id);
      if (!success) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
