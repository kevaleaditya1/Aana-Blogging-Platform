# Database Setup - Manual Steps Required

The automated database setup is blocked by file permissions. Please follow these steps:

## Step 1: Stop Dev Server

Press `Ctrl+C` in the terminal running `npm run dev`

## Step 2: Run Database Migration

```bash
npx prisma db push
```

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema. Done in 2.5s

✔ Generated Prisma Client (v5.22.0)
```

## Step 3: Restart Dev Server

```bash
npm run dev
```

## If It Still Fails:

1. Make sure `.env` file exists (not just `.env.local`)
2. Check that `DATABASE_URL` is in the `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:ashitya2605@db.cqqdqyvfgipyxdncmrjn.supabase.co:5432/postgres
   ```
3. Try again

## After Success:

Once you see "Database synchronized", I'll implement:
- ✅ Public user authentication (Google OAuth + email/password)
- ✅ Admin authentication (email/password only)
- ✅ Comments on blog posts
- ✅ Bookmark/save articles feature
- ✅ Forgot password functionality

Let me know when the database is connected!
