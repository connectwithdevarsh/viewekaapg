import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DB_1 || !process.env.DB_2) {
  throw new Error(
    "CRITICAL: DB_1 and DB_2 must be set in your .env file to ensure strict data isolation between Chanakyapuri and Khakhrej."
  );
}

export const pool1 = new Pool({ connectionString: process.env.DB_1 });
export const pool2 = new Pool({ connectionString: process.env.DB_2 });

export const db1 = drizzle({ client: pool1, schema });
export const db2 = drizzle({ client: pool2, schema });