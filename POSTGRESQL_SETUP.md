# PostgreSQL Installation & Setup Guide

## Step 1: Install PostgreSQL

### Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download PostgreSQL (latest version, e.g., 16.x)

### Install PostgreSQL
1. Run the installer
2. **Important Settings:**
   - Installation Directory: Keep default (usually `C:\Program Files\PostgreSQL\16`)
   - Data Directory: Keep default
   - **Password**: Set a password for the `postgres` superuser (REMEMBER THIS!)
   - Port: Keep default `5432`
   - Locale: Keep default

3. **Select Components:**
   - ✓ PostgreSQL Server
   - ✓ pgAdmin 4 (GUI tool - recommended)
   - ✓ Stack Builder (optional)
   - ✓ Command Line Tools

4. Complete the installation

## Step 2: Verify Installation

Open PowerShell and run:
```powershell
psql --version
```

If you see a version number, PostgreSQL is installed correctly!

## Step 3: Start PostgreSQL Service

### Option A: Using Services (Recommended)
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "postgresql-x64-16" (or similar)
4. Right-click → Start (if not running)
5. Set Startup type to "Automatic" (so it starts on boot)

### Option B: Using Command Line
```powershell
# Start PostgreSQL service
net start postgresql-x64-16
```

## Step 4: Create Database

### Using pgAdmin (GUI - Easier)
1. Open **pgAdmin 4** from Start Menu
2. Enter your PostgreSQL password when prompted
3. Expand "Servers" → "PostgreSQL 16" → "Databases"
4. Right-click "Databases" → "Create" → "Database"
5. Name: `inventory_db`
6. Click "Save"

### Using Command Line (Alternative)
1. Open PowerShell
2. Run:
```powershell
psql -U postgres
```
3. Enter your PostgreSQL password
4. Run:
```sql
CREATE DATABASE inventory_db;
\q
```

## Step 5: Update Backend Configuration

1. Open `backend/.env` file
2. Update the DATABASE_URL with your credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/inventory_db?schema=public"
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/inventory_db?schema=public"
```

## Step 6: Test Connection & Run Migrations

Open PowerShell in the `backend` folder:

```powershell
# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Test connection
npx prisma db pull

# If connection works, run migrations
npx prisma migrate dev --name init
```

## Step 7: Restart Backend Server

```powershell
cd backend
npm run dev
```

## Troubleshooting

### "psql: command not found"
- PostgreSQL bin directory not in PATH
- Add to PATH: `C:\Program Files\PostgreSQL\16\bin`
- Or use full path: `"C:\Program Files\PostgreSQL\16\bin\psql.exe"`

### "Connection refused"
- PostgreSQL service not running
- Start it from Services (services.msc)

### "Password authentication failed"
- Wrong password in DATABASE_URL
- Check your .env file

### "Database does not exist"
- Create it using pgAdmin or SQL command above

## Quick Test

After setup, test the connection:
```powershell
psql -U postgres -d inventory_db -c "SELECT version();"
```

If you see PostgreSQL version info, connection is working!

