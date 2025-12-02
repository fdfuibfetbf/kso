# Vercel Deployment Guide

## ⚠️ Important: Database Configuration for Vercel

SQLite file databases (`file:./prisma/dev.db`) **do not work** on Vercel's serverless environment. You need to use a cloud database.

## Recommended Solutions

### Option 1: Turso (Cloud SQLite) - Easiest Migration
1. Sign up at [Turso](https://turso.tech/)
2. Create a new database
3. Get your database URL (looks like `libsql://...`)
4. In Vercel, add environment variable:
   - `DATABASE_URL` = Your Turso database URL
5. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
6. Run migrations on Turso database

### Option 2: PostgreSQL (Recommended for Production)
1. Use a PostgreSQL service (Vercel Postgres, Supabase, Neon, etc.)
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. In Vercel, add environment variable:
   - `DATABASE_URL` = Your PostgreSQL connection string
4. Run migrations: `npx prisma migrate deploy`

### Option 3: MySQL
1. Use a MySQL service (PlanetScale, Railway, etc.)
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```
3. In Vercel, add environment variable:
   - `DATABASE_URL` = Your MySQL connection string
4. Run migrations: `npx prisma migrate deploy`

## Required Environment Variables in Vercel

1. **DATABASE_URL** - Your cloud database connection string
2. **JWT_SECRET** - Your JWT secret key
3. **JWT_EXPIRES_IN** - JWT expiration (e.g., "7d")
4. **NODE_ENV** - Set to "production"

## Steps to Deploy

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

## Quick Setup with Turso (SQLite Compatible)

```bash
# Install Turso CLI
npm install -g @libsql/client

# Create database
turso db create your-db-name

# Get database URL
turso db show your-db-name

# Add to Vercel environment variables
DATABASE_URL=libsql://your-db-url
```

Then run migrations:
```bash
npx prisma migrate deploy
```
