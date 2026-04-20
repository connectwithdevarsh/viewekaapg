# EKAA PG Management System

## Project Overview
A multi-location PG (Paying Guest) management system designed to streamline operations across different properties. It currently manages two PGs:
1. **EKAA PG (Chanakyapuri)**
2. **EKAA PG (Khakhrej, Ahmedabad)**

The system features a comprehensive admin panel for administrators to track and manage residents, rooms, payments, expenses, and inquiries seamlessly across multiple properties.

## Core Features
* **Multi-PG Support**: Full data isolation between different PG properties.
* **Dual Databases**: Separate PostgreSQL databases (hosted on Neon) for each PG.
* **Admin Dashboard**: Centralized dashboard with a simple UI and dynamic PG switching.
* **Resident Management**: Add, view, and manage resident data effortlessly.
* **Room Management**: Structured hierarchy handling sharing types → room numbers → resident details.
* **Payment Tracking**: Keep track of monthly student payments and dues.
* **Expense Management**: Supports manual input and automatic, real-time calculation of expenses versus income.
* **Inquiry System**: Intelligent inquiry routing with PG location selection.
* **Google Maps Integration**: Integrated maps for easy navigation to each PG location.

## Architecture & Technical Details
The application employs a **multi-tenant architecture with dual databases** to ensure strict data isolation and security between different PG locations.

* **Dual Connection Setup**: Uses 2 separate database connection strings (`DATABASE_URL` and `DATABASE_URL_2`).
* **Runtime Database Switching**: The backend automatically routes queries to the correct database based on the selected PG location in the request or session.
* **Identical Schema Structure**: Both databases share the exact same schema, minimizing maintenance overhead and bugs while ensuring feature parity.
* **Backend Managed Isolation**: Strict data isolation is handled entirely on the backend side so that cross-property data leaks do not occur.

### Admin Features
* **Isolated Views**: Separate views per PG—data is never mixed.
* **Monthly Financial Summaries**: Built-in expense vs. income tracking with detailed monthly summaries.
* **User-Friendly UI**: An easy-to-use and responsive user interface for daily management operations.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- 2 Neon Serverless Postgres Database instances

### 1. Clone & Install
```bash
git clone https://github.com/connectwithdevarsh/viewekaapg.git
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in the root directory by specifying your two distinct database URLs from Neon:

```env
# Database 1: EKAA PG (Chanakyapuri)
DB_1="postgresql://user:password@hostname/dbname_1?sslmode=require"

# Database 2: EKAA PG (Khakhrej)
DB_2="postgresql://user:password@hostname/dbname_2?sslmode=require"

# Other environment variables as required
PORT=5000
JWT_SECRET="your-session-secret"
```

## Deployment (Vercel Serverless)

This application has been structured to run specifically on Vercel utilizing its Serverless Functions.

1. **Push your code to GitHub**, ensuring all `.env` variables are secure and not tracked.
2. **Import your repository** into Vercel.
3. Vercel will automatically detect the **Vite** framework for the frontend.
4. **Configure Environment Variables** in your Vercel Project Settings for both `DB_1` and `DB_2` (as well as your `JWT_SECRET`). 
   > **Note**: After adding environment variables in Vercel, you **must trigger a Re-deployment** for them to be applied!
5. **Deploy!** Vercel will seamlessly build your Vite frontend and map all `/api/*` endpoints to the serverless `api/index.ts` handler according to the `vercel.json` routing configuration.

### Vercel Serverless Function Compatibility
The backend has been heavily optimized for Vercel's Node Runtime and Edge Network:
- **Strict ESM Path Resolution**: All internal module imports within the `server/` directory explicitly feature `.js` extensions (e.g., `import { registerRoutes } from "../server/routes.js"`). This seamlessly bridges TypeScript paths with strict Node.js Execution environments where native ESM demands exact file extensions to avoid `ERR_MODULE_NOT_FOUND` on 500 crashes.
- **Pure Javascript Cryptography**: Specifically utilizing `bcryptjs` instead of the standard `bcrypt` C++ add-on, eliminating the ubiquitous 'Invalid ELF Header' or module missing build errors native to Amazon Linux 2 platforms used by Vercel's architecture.

## Database Setup

This project uses Drizzle ORM paired with Neon Serverless Postgres. After creating your Neon databases and updating your local `.env` or Vercel Environment Variables, you need to push the schema to both databases.

```bash
# Push schema to Database 1 (Chanakyapuri)
npm run db:push

# Push schema to Database 2 (Khakhrej)
npm run db:push:secondary
```

## Folder Structure

```
├── api/                     # Vercel Serverless Function entry point
│   └── index.ts             
├── client/                  # Frontend React application (Vite + TailwindCSS)
│   └── src/
│       ├── components/      # Reusable UI components
│       └── pages/           # Page layouts and views
├── server/                  # Backend Express routes and logic
│   ├── routes.ts            # API routes handling DB switching
│   └── db.ts                # Database connection setup
├── shared/                  # Code shared between frontend and backend
│   └── schema.ts            # Drizzle ORM schema definition
├── drizzle.config.ts        # Database migration configuration
├── tailwind.config.ts       # TailwindCSS styling configuration
├── package.json             # Project dependencies and basic scripts
├── vercel.json              # Vercel Serverless build & rewriting rules
├── vite.config.ts           # Vite Bundler configuration
├── index.html               # Main HTML entry point (Project Root)
└── README.md                # Project documentation
```

## Future Improvements
- **Automated Invoicing**: Generation and email delivery of PDF rent and payment receipts.
- **Resident Portal**: A self-service portal for residents to view their dues and submit maintenance requests.
- **Role-Based Access Control (RBAC)**: Support for multiple staff accounts with restricted access levels.
- **Analytics & Reporting**: Deeper financial forecasting and occupancy analytics.
- **Payment Gateway Integration**: Direct online payment collection through UPI or banking gateways.
