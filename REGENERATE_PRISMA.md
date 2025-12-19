# Prisma Client Regeneration Instructions

## ✅ Automatic Regeneration Setup

I've updated the `package.json` files to automatically regenerate Prisma clients when you restart the servers:

### Changes Made:
1. **Backend**: Added `prisma generate` to the `dev` script and added `postinstall` hook
2. **Frontend**: Added `prisma generate` to both `dev` and `dev:next` scripts

## 🚀 Next Steps

### Option 1: Restart Servers (Recommended)
Simply restart your development servers. The Prisma clients will regenerate automatically:

```bash
# Stop current servers (Ctrl+C)

# Terminal 1 - Backend (will auto-generate Prisma)
cd backend
npm run dev

# Terminal 2 - Frontend (will auto-generate Prisma)  
cd frontend
npm run dev
# OR if using Next.js directly:
npm run dev:next
```

### Option 2: Manual Regeneration
If you prefer to regenerate manually before restarting:

```bash
# Stop servers first (Ctrl+C)

# Backend
cd backend
npx prisma generate

# Frontend
cd ../frontend
npx prisma generate

# Then restart servers normally
```

## ✅ Verification

After restarting, verify everything works:

1. **Check console logs** - Should see Prisma generation messages
2. **Test Purchase Orders page** - Should load without 500 errors
3. **Test Customer form** - Should show Credit Limit and Opening Balance fields
4. **Test Status dropdown** - Should be editable in customer table

## 📝 Notes

- The Prisma clients are locked while servers are running (Windows file locking)
- The updated dev scripts will regenerate Prisma automatically on each server start
- This ensures Prisma clients stay in sync with schema changes
- No manual intervention needed after the first restart

