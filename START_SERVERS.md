# How to Start the Application

## Quick Start (Easiest Method)

### Option 1: Start Both Servers at Once

**Run this single command:**
```powershell
.\start-app.ps1
```

This will open two PowerShell windows - one for backend and one for frontend.

### Option 2: Using Individual PowerShell Scripts

**Terminal 1 - Backend:**
```powershell
cd backend
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
.\start-frontend.ps1
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Verify Servers Are Running

### Backend (Port 5000)
- Open: http://localhost:5000/api/health
- Should show: `{"status":"ok","message":"Inventory API is running"}`

### Frontend (Port 3000)
- Open: http://localhost:3000
- Should show the login/register page

## Test Registration

1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Password: Your password (min 6 characters)
3. Click "Register"
4. Should work now! ✅

## Troubleshooting

### PowerShell Execution Policy Error
If you see: `cannot be loaded because running scripts is disabled`

**Solution 1 (Recommended):** Use the startup script which handles this automatically:
```powershell
.\start-app.ps1
```

**Solution 2:** Set execution policy for current session:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
```

**Solution 3:** Set execution policy permanently (requires admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "ERR_CONNECTION_REFUSED"
- Backend server is not running
- Start it: `cd backend && npm run dev`

### "Registration failed"
- Check backend server is running
- Check browser console for errors
- Verify `.env` file in backend folder has correct DATABASE_URL

### Port Already in Use
- Backend (5000): Change PORT in `backend/.env`
- Frontend (3000): Kill the process or use different port

## Quick Test Script

Run this to test if backend is running:
```powershell
.\test-backend.ps1
```

