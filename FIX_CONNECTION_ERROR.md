# Fix Connection Error - ERR_CONNECTION_REFUSED

## Problem
The error "ERR_CONNECTION_REFUSED" means the **backend server is not running**.

## Solution

### Step 1: Start the Backend Server

Open a **new PowerShell terminal** and run:

```powershell
cd "C:\Users\Koncept Solutions\Desktop\CTC-ERP system\backend"
npm run dev
```

You should see:
```
Server is running on port 5000
✓ Database connected successfully
```

### Step 2: Verify Backend is Running

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"Inventory API is running"}
```

### Step 3: Test Registration

1. Go to http://localhost:3000/register
2. Fill in the registration form
3. Click "Register"
4. Should work now! ✅

## Quick Start Commands

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend (if not running):**
```powershell
cd frontend
npm run dev
```

## Important Notes

- ✅ **Backend must be running** before you can register/login
- ✅ Backend runs on **port 5000**
- ✅ Frontend runs on **port 3000**
- ✅ Both servers need to run **simultaneously**

## Still Having Issues?

1. **Check if port 5000 is in use:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```

2. **Check backend .env file:**
   - Make sure `backend/.env` exists
   - Should have: `DATABASE_URL="file:./prisma/dev.db"`

3. **Check database exists:**
   - File should be at: `backend/prisma/dev.db`

4. **Restart both servers:**
   - Stop both (Ctrl+C)
   - Start backend first
   - Then start frontend

## Success Indicators

✅ Backend: "Server is running on port 5000"
✅ Backend: "✓ Database connected successfully"  
✅ Frontend: No errors in browser console
✅ Registration: Account created successfully

