# Quick Setup Checklist

## ✅ Step-by-Step Setup

### 1. Install PostgreSQL
- [ ] Download from: https://www.postgresql.org/download/windows/
- [ ] Run installer
- [ ] **Remember the password you set for 'postgres' user!**
- [ ] Complete installation

### 2. Start PostgreSQL Service
- [ ] Press `Win + R`, type `services.msc`
- [ ] Find "postgresql-x64-16" (or similar)
- [ ] Right-click → Start (if not running)
- [ ] Set Startup type to "Automatic"

### 3. Create Database
**Option A: Using pgAdmin (Easier)**
- [ ] Open pgAdmin 4 from Start Menu
- [ ] Enter PostgreSQL password
- [ ] Right-click "Databases" → Create → Database
- [ ] Name: `inventory_db`
- [ ] Click Save

**Option B: Using Command Line**
- [ ] Open PowerShell
- [ ] Run: `psql -U postgres`
- [ ] Enter password
- [ ] Run: `CREATE DATABASE inventory_db;`
- [ ] Run: `\q`

### 4. Configure Backend
- [ ] Open `backend/.env` file
- [ ] Update DATABASE_URL:
  ```
  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/inventory_db?schema=public"
  ```
- [ ] Replace `YOUR_PASSWORD` with your PostgreSQL password

### 5. Run Setup Script
Open PowerShell in `backend` folder:
```powershell
.\quick-setup.ps1
```

Or manually:
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Restart Backend Server
```powershell
npm run dev
```

### 7. Test Registration
- [ ] Go to http://localhost:3000/register
- [ ] Try registering a new account
- [ ] Should work now! ✅

## 🚨 Troubleshooting

### "Can't reach database server"
- PostgreSQL service not running → Start it from Services
- Wrong port → Check if PostgreSQL is on port 5432
- Firewall blocking → Allow PostgreSQL through firewall

### "Password authentication failed"
- Wrong password in `.env` file
- Check DATABASE_URL in `backend/.env`

### "Database does not exist"
- Create it using pgAdmin or SQL command above

### "psql: command not found"
- PostgreSQL not installed, or
- Not in PATH (use full path or pgAdmin instead)

## 📝 Quick Commands

```powershell
# Check if PostgreSQL is running
Get-Service | Where-Object { $_.Name -like "postgresql*" }

# Start PostgreSQL service
Start-Service postgresql-x64-16

# Test connection
cd backend
.\test-connection.ps1
```

