# NextAuth Setup - Manual Steps Required

I've implemented most of the NextAuth authentication, but there are a few manual steps needed to complete the setup.

## ✅ What's Already Done:

1. **Installed Dependencies**:
   - `next-auth@beta`
   - `@prisma/client`
   - `@auth/prisma-adapter`
   - `prisma`

2. **Created Files**:
   - `prisma/schema.prisma` - Database schema
   - `lib/auth.ts` - NextAuth configuration
   - `app/api/auth/[...nextauth]/route.ts` - Auth API handler
   - Updated `app/admin/login/page.tsx` - New login UI

3. **Environment Variables Added**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `EMAIL_FROM`

## ⚠️ Manual Steps Required:

### Step 1: Fix Database URL

The password `Ashitya@2605` contains `@` which needs URL encoding.

**Open `.env.local` and find the line:**
```
DATABASE_URL=postgresql://postgres:Ashitya@2605@db...
```

**Replace it with (URL-encoded password):**
```
DATABASE_URL=postgresql://postgres:Ashitya%402605@db.cqqdqyvfgipyxdncmrjn.supabase.co:5432/postgres
```

Note: `@` becomes `%40` in URLs

### Step 2: Run Database Migrations

After fixing the DATABASE_URL, run:

```bash
npx prisma generate
npx prisma db push
```

This will create the necessary tables in your Supabase database.

### Step 3: Update Google OAuth Redirect URI

1. Go to Google Cloud Console
2. Navigate to your OAuth credentials
3. Add this redirect URI:
   - `http://localhost:3000/api/auth/callback/google`

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🧪 Testing:

1. **Visit**: `http://localhost:3000/admin/login`
2. **You'll see**:
   - "Continue with Google" button
   - Email magic link form
3. **Try Google OAuth**: Click the Google button
4. **Try Email**: Enter your admin email and check inbox

## 🔒 Admin Access:

Only these emails can access admin:
- kevaleaditya1@gmail.com
- adityakevale2904@gmail.com

Anyone else will be denied access.

## 📝 What Changed:

### Login Page
- Removed password field
- Added Google OAuth button
- Added email magic link form

### Authentication
- Uses NextAuth sessions (stored in database)
- Supports Google OAuth
- Supports email magic links via Resend
- Admin email whitelist

## ❌ If You Get Errors:

### "Invalid client_id"
- Check `GOOGLE_CLIENT_ID` in `.env.local`
- Verify it matches Google Cloud Console

### "Redirect URI mismatch"
- Add `http://localhost:3000/api/auth/callback/google` to Google OAuth settings

### "Database connection failed"
- Check `DATABASE_URL` has URL-encoded password (`%40` instead of `@`)
- Verify Supabase database is running

### "Email not sent"
- Check `RESEND_API_KEY` in `.env.local`
- Verify Resend account is active

## 🚀 Next Steps After Setup:

1. Test Google login
2. Test email magic link
3. Verify admin access control
4. Update middleware (I'll do this after database is connected)

Let me know when you've completed the manual steps and I'll continue!
