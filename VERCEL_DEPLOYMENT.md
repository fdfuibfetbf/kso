# Vercel Deployment Guide

This guide will help you deploy your CTC-ERP system to Vercel.

## Prerequisites

1. ✅ Your code is pushed to GitHub (you mentioned you've already done this)
2. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
3. A PostgreSQL database (Vercel Postgres recommended, or external like Supabase, Neon, etc.)

## Important: Database Migration from SQLite to PostgreSQL

**Your current setup uses SQLite, but Vercel requires PostgreSQL for production.** You'll need to:

1. Set up a PostgreSQL database
2. Update your Prisma schema
3. Run migrations

## Step-by-Step Deployment

### Step 1: Set Up PostgreSQL Database

#### Option A: Use Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to your project → Storage tab
3. Click "Create Database" → Select "Postgres"
4. Choose a plan (Hobby plan is free)
5. Copy the connection string (you'll need this later)

#### Option B: Use External PostgreSQL (Supabase, Neon, etc.)

- **Supabase**: https://supabase.com (free tier available)
- **Neon**: https://neon.tech (free tier available)
- **Railway**: https://railway.app (free tier available)

Get your PostgreSQL connection string from your provider.

### Step 2: Update Prisma Schema for PostgreSQL

You need to update your `frontend/prisma/schema.prisma` file to use PostgreSQL instead of SQLite:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Note:** Some SQLite-specific features may need adjustment:
- SQLite uses `String` for IDs, PostgreSQL can use `String` or `@default(uuid())`
- SQLite doesn't support some advanced features that PostgreSQL does

### Step 3: Deploy to Vercel

#### Method 1: Deploy via Vercel Dashboard (Recommended for first time)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Project Settings**
   - **Root Directory**: Set to `frontend` (since your Next.js app is in the frontend folder)
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```
   
   **Important**: 
   - Replace `your_postgresql_connection_string` with your actual PostgreSQL connection string
   - Use a strong, random string for `JWT_SECRET` (you can generate one with: `openssl rand -base64 32`)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

#### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set root directory (should be `.` if you're in frontend folder)
   - Override settings? No (use defaults)

5. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add JWT_EXPIRES_IN
   vercel env add NODE_ENV
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Step 4: Run Database Migrations

After deployment, you need to run Prisma migrations to set up your database schema:

1. **Option A: Use Vercel CLI**
   ```bash
   cd frontend
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Option B: Use Vercel Postgres Dashboard**
   - Go to Vercel Dashboard → Your Project → Storage → Postgres
   - Use the built-in SQL editor to run migrations manually

3. **Option C: Create a Migration API Route**
   Create `frontend/app/api/migrate/route.ts` (temporary, for one-time migration):
   ```typescript
   import { NextResponse } from 'next/server';
   import { prisma } from '@/lib/utils/prisma';
   
   export async function POST(request: Request) {
     try {
       // Run migrations
       // This is a simplified example - you may need to adjust
       return NextResponse.json({ success: true });
     } catch (error) {
       return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
     }
   }
   ```

### Step 5: Create Admin User

After migrations, create your admin user. You can:

1. **Use Vercel CLI to run script remotely** (if configured)
2. **Create a temporary API route** to create admin
3. **Use Prisma Studio** locally with production DATABASE_URL:
   ```bash
   DATABASE_URL=your_production_url npx prisma studio
   ```

### Step 6: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `your-project.vercel.app`)
2. Test login/registration
3. Verify database connections work
4. Check API routes are functioning

## Troubleshooting

### Build Fails

- **Error: Prisma Client not generated**
  - Solution: The `postinstall` script should handle this, but verify `prisma generate` runs during build

- **Error: Database connection failed**
  - Check your `DATABASE_URL` environment variable
  - Ensure your PostgreSQL database is accessible from Vercel's servers
  - Check if your database requires IP whitelisting (Vercel uses dynamic IPs)

### Runtime Errors

- **Error: Prisma Client not found**
  - Ensure `postinstall` script runs: `"postinstall": "prisma generate"`

- **Error: JWT_SECRET not found**
  - Verify environment variables are set in Vercel dashboard
  - Redeploy after adding environment variables

### Database Issues

- **Migration errors**
  - Ensure your Prisma schema is updated for PostgreSQL
  - Check for SQLite-specific syntax that needs updating
  - Run `prisma migrate dev` locally first to test

## Environment Variables Summary

Make sure these are set in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `NODE_ENV` | Environment mode | `production` |

## Post-Deployment Checklist

- [ ] Database migrations completed successfully
- [ ] Admin user created
- [ ] Login/Registration working
- [ ] API routes responding correctly
- [ ] Database queries executing properly
- [ ] Environment variables set correctly
- [ ] Custom domain configured (optional)

## Next Steps

1. **Set up Custom Domain** (optional)
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain

2. **Enable Analytics** (optional)
   - Vercel Analytics provides insights into your app performance

3. **Set up Monitoring**
   - Consider adding error tracking (Sentry, etc.)
   - Monitor database performance

## Important Notes

- **SQLite to PostgreSQL**: Your current setup uses SQLite. You MUST migrate to PostgreSQL for Vercel deployment.
- **Database File**: SQLite database files (`dev.db`) cannot be used on Vercel. You need a hosted PostgreSQL database.
- **Build Time**: First deployment may take longer due to Prisma generation and build process.
- **Environment Variables**: Always set sensitive variables in Vercel dashboard, never commit them to Git.

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Prisma Deployment Guide: https://www.prisma.io/docs/guides/deployment
- Vercel Support: https://vercel.com/support

