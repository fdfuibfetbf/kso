# Single Database Configuration

## Overview
Both frontend and backend now use the **same database** located at:
```
backend/prisma/dev.db
```

## Configuration Changes Made

### 1. Frontend Prisma Schema (`frontend/prisma/schema.prisma`)
- Updated `datasource db.url` to point to: `file:../backend/prisma/dev.db`
- This ensures the frontend uses the backend database

### 2. Frontend Prisma Client (`frontend/lib/utils/prisma.ts`)
- Updated to automatically detect and use the backend database path
- Falls back to frontend database if backend doesn't exist

### 3. Backend Prisma Schema (`backend/prisma/schema.prisma`)
- Already configured to use: `file:./dev.db` (relative to `backend/prisma/`)
- No changes needed

## Benefits
✅ **Single Source of Truth**: All data in one database  
✅ **No Data Duplication**: Parts added once are available everywhere  
✅ **Consistent Data**: Frontend and backend always see the same data  
✅ **Easier Maintenance**: Only one database to backup/manage  

## Current Database Status
- **Location**: `backend/prisma/dev.db`
- **Total Parts**: 92 (all Active)
- **Used By**: Both Frontend and Backend

## Important Notes
1. **Always use the backend database** for any data operations
2. **Migrations** should be run from the backend: `cd backend && npm run prisma:migrate`
3. **Prisma Studio** can be opened from backend: `cd backend && npm run prisma:studio`
4. The frontend will automatically use the backend database

## Troubleshooting
If you see "database not found" errors:
1. Make sure `backend/prisma/dev.db` exists
2. Run migrations: `cd backend && npm run prisma:migrate`
3. Regenerate Prisma client: `cd frontend && npx prisma generate`

