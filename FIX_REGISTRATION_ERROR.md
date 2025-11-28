# Fix Registration Error - Step by Step

## Problem
The 500 Internal Server Error occurs because the database is not configured or connected.

## Solution

### Step 1: Update Database Credentials

1. Open `backend/.env` file
2. Update the `DATABASE_URL` line with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/inventory_db?schema=public"
```

Replace:
- `YOUR_USERNAME` - Your PostgreSQL username (often `postgres`)
- `YOUR_PASSWORD` - Your PostgreSQL password
- `inventory_db` - Your database name (create it if it doesn't exist)

### Step 2: Create Database (if needed)

If the database doesn't exist, create it:

```sql
-- In PostgreSQL command line or pgAdmin:
CREATE DATABASE inventory_db;
```

### Step 3: Run Database Migrations

Open PowerShell in the `backend` folder and run:

```powershell
# Refresh PATH first
.\..\refresh-path.ps1

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### Step 4: Restart Backend Server

1. Stop the current backend server (Ctrl+C)
2. Restart it:

```powershell
cd backend
npm run dev
```

### Step 5: Test Registration

1. Go to http://localhost:3000/register
2. Try registering again

## Quick Fix Script

You can also run this in the `backend` folder:

```powershell
.\setup-database.ps1
```

This will:
- Check/create .env file
- Generate Prisma Client
- Run migrations

## Common Issues

### "Database does not exist"
- Create the database first: `CREATE DATABASE inventory_db;`

### "Connection refused"
- Make sure PostgreSQL is running
- Check the port (default is 5432)
- Verify username and password

### "Password authentication failed"
- Double-check your PostgreSQL password in the DATABASE_URL

## After Fixing

Once the database is set up, registration should work! You can then:
- Register new users via the web interface
- Or create an admin user: `npm run create-admin`

