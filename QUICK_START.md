# Quick Start Guide

## Prerequisites

Before starting, make sure you have:

1. **Node.js 18+** installed
   - Download from: https://nodejs.org/
   - Verify installation: Open PowerShell and run `node --version`

2. **PostgreSQL** database running
   - Download from: https://www.postgresql.org/download/
   - Make sure PostgreSQL service is running

3. **Git** (optional, if cloning from repository)

## Step 1: Install Node.js

If Node.js is not installed:

1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Restart your terminal/PowerShell after installation
5. Verify: `node --version` and `npm --version`

## Step 2: Set Up Database

1. Create a PostgreSQL database named `inventory_db` (or any name you prefer)
2. Note down your database connection details:
   - Host: usually `localhost`
   - Port: usually `5432`
   - Username: your PostgreSQL username
   - Password: your PostgreSQL password
   - Database name: `inventory_db`

## Step 3: Configure Backend

1. Navigate to the `backend` folder
2. Create a `.env` file with the following content:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/inventory_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

## Step 4: Install Dependencies

### Backend

Open PowerShell in the project root and run:

```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### Frontend

Open a new PowerShell window and run:

```powershell
cd frontend
npm install
```

## Step 5: Start the Application

### Option A: Using PowerShell Scripts (Easiest)

1. **Start Backend** (First Terminal):
   ```powershell
   .\start-backend.ps1
   ```

2. **Start Frontend** (Second Terminal):
   ```powershell
   .\start-frontend.ps1
   ```

### Option B: Manual Start

1. **Start Backend** (First Terminal):
   ```powershell
   cd backend
   npm run dev
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend** (Second Terminal):
   ```powershell
   cd frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

## Step 6: Access the Application

1. Open your browser
2. Navigate to: http://localhost:3000
3. Register a new account or login
4. Start managing your inventory!

## Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "npm is not recognized"
- Usually comes with Node.js installation
- Reinstall Node.js if npm is missing

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Ensure database exists: `createdb inventory_db` (in PostgreSQL)

### Port Already in Use
- Backend (5000): Change PORT in backend/.env
- Frontend (3000): Kill the process or use a different port

### Prisma Migration Errors
- Make sure database exists
- Check DATABASE_URL is correct
- Try: `npx prisma migrate reset` (WARNING: This deletes all data)

## Need Help?

Check the main README.md for more detailed information.

