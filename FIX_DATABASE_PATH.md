# Fix Database Path Error

## Problem
Error: "Unable to open the database file" - SQLite cannot access the database.

## Solution Applied

✅ Updated `.env` file with **absolute path** to the database file.

The database path is now:
```
file:C:/Users/Koncept Solutions/Desktop/CTC-ERP system/backend/prisma/dev.db
```

## Next Steps

### 1. Restart Backend Server

**IMPORTANT:** The backend server must be restarted to pick up the new `.env` file.

1. **Stop the current backend server:**
   - Press `Ctrl + C` in the terminal where backend is running

2. **Start it again:**
   ```powershell
   cd backend
   npm run dev
   ```

### 2. Verify Database Connection

After restarting, you should see:
```
Server is running on port 5000
✓ Database connected successfully
```

### 3. Test Registration

1. Go to http://localhost:3000/register
2. Try registering again
3. Should work now! ✅

## Alternative: Use Relative Path

If the absolute path still doesn't work, you can try using a relative path from the backend directory:

Update `backend/.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
```

But make sure you're running the server from the `backend` directory!

## Troubleshooting

### "Database is locked"
- Close any database viewers
- Stop the backend server
- Try again

### "Permission denied"
- Check file permissions on `prisma/dev.db`
- Make sure the file is not read-only

### Still not working?
1. Delete the database file: `backend/prisma/dev.db`
2. Recreate it: `npx prisma migrate dev --name init`
3. Restart backend server

## Quick Fix Script

Run this in the `backend` folder:
```powershell
.\fix-database-path.ps1
```

This will automatically fix the database path and test the connection.

