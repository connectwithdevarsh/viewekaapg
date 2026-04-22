import express from "express";
import cors from "cors";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the routes on the Express app
registerRoutes(app);

// Export the app as a serverless function endpoint for Vercel
export default app;
