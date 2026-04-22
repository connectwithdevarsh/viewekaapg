import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage1, storage2 } from "./storage";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Seed admin user
async function seedAdminUser() {
  const storages = [storage1, storage2];
  for (let index = 0; index < storages.length; index++) {
    const storage = storages[index];
    try {
      const existingAdmin = await storage.getUserByUsername("RADHE");
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("@RADHE011", 10);
        await storage.createUser({
          username: "RADHE",
          password: hashedPassword
        });
        log(`Admin user created successfully for DB ${index + 1}`);
      } else {
        log(`Admin user already exists for DB ${index + 1}`);
      }
    } catch (error) {
      log(`Error seeding admin user for DB ${index + 1}: ` + error);
    }
  }
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await seedAdminUser();
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000 for local development.
  // In Vercel (production), we use the /api/index.ts serverless endpoint exclusively.
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const port = 5000;
    server.listen(port, "localhost", () => {
      log(`serving on port ${port}`);
    });
  }
})();
