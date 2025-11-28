# How to Start the Backend Server

## Quick Start

1. **Open a new PowerShell terminal**
2. **Navigate to the backend folder:**
   ```powershell
   cd backend
   ```

3. **Start the server:**
   ```powershell
   npm run dev
   ```

## Or Use the Startup Script

Run the `start-backend.ps1` script from the project root:
```powershell
.\start-backend.ps1
```

## Verify Backend is Running

The backend should start on `http://localhost:5000`

You should see:
- ✓ Database connected successfully
- Server is running on port 5000
- API available at http://localhost:5000/api

## Troubleshooting

If you see connection errors in the frontend:
1. Make sure the backend is running
2. Check that port 5000 is not being used by another application
3. Verify the `.env` file exists in the `backend` folder with correct `DATABASE_URL`

