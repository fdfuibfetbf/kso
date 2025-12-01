# Quick Vercel Deployment Checklist

## ⚡ Quick Steps

### 1. Update Prisma Schema for PostgreSQL
```bash
# Copy the PostgreSQL schema
cd frontend/prisma
cp schema.postgresql.prisma schema.prisma
```

Or manually change line 9 in `frontend/prisma/schema.prisma`:
```prisma
provider = "postgresql"  // Change from "sqlite"
```

### 2. Set Up PostgreSQL Database

**Option A: Vercel Postgres (Easiest)**
- Go to Vercel Dashboard → Your Project → Storage → Create Postgres Database
- Copy the connection string

**Option B: External (Supabase/Neon)**
- Sign up at supabase.com or neon.tech
- Create a new database
- Copy the connection string

### 3. Deploy to Vercel

**Via Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Set Root Directory to `frontend`**
5. Add Environment Variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `JWT_SECRET` = random secret (use: `openssl rand -base64 32`)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`
6. Click Deploy

**Via CLI:**
```bash
cd frontend
npm i -g vercel
vercel login
vercel
# Follow prompts, then:
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add NODE_ENV
vercel --prod
```

### 4. Run Database Migrations

After first deployment:
```bash
cd frontend
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's Postgres dashboard SQL editor.

### 5. Create Admin User

Use Prisma Studio or create a temporary API route.

## ✅ Files Created for You

- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ `frontend/.vercelignore` - Files to ignore
- ✅ `frontend/prisma/schema.postgresql.prisma` - PostgreSQL schema
- ✅ `VERCEL_DEPLOYMENT.md` - Detailed guide

## 🔑 Required Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |

## ⚠️ Important Notes

1. **You MUST change from SQLite to PostgreSQL** - Vercel doesn't support SQLite
2. **Root Directory** must be set to `frontend` in Vercel settings
3. **Environment Variables** must be set before deployment
4. **Migrations** must be run after first deployment

## 🆘 Troubleshooting

**Build fails?**
- Check that Prisma schema uses `postgresql` not `sqlite`
- Verify `DATABASE_URL` is set correctly

**Database connection fails?**
- Check your PostgreSQL connection string
- Ensure database allows connections from Vercel (most cloud providers do by default)

**Prisma errors?**
- Run `npx prisma generate` locally first to test
- Check that `postinstall` script in package.json includes `prisma generate`

## 📚 Full Guide

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

