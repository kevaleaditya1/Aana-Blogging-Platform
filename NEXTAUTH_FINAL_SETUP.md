# NextAuth Setup - Final Steps

The automated setup hit some issues with environment variables. Please complete these manual steps:

## Step 1: Clean `.env.local` File

**Open `.env.local` in a text editor (VS Code, Notepad++) and replace ALL content with:**

```
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqxfpk0jj
CLOUDINARY_API_KEY=273652718356478
CLOUDINARY_API_SECRET=BNRUoMCg9NCXDSOy4qzFu7EraiQ
RESEND_API_KEY=re_Q1opLveE_8PiMoSY8M3MUTxMoe2AEkpQH
CONTACT_EMAIL=kevaleaditya1@gmail.com
DATABASE_URL=postgresql://postgres:ashitya2605@db.cqqdqyvfgipyxdncmrjn.supabase.co:5432/postgres
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-12345
GOOGLE_CLIENT_ID=321460989508-vurfro9vvkbu0vgt370j2blol3ie0gak.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
EMAIL_FROM=Ashitya <onboarding@resend.dev>
```

**Save the file.**

## Step 2: Run Prisma Commands

Open a **NEW terminal** (not the one running `npm run dev`) and run:

```bash
cd "c:\Users\Aditya\OneDrive\Desktop\Ashitya 2 antigravity"
npx prisma generate
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
✔ Database synchronized
```

## Step 3: Update Google OAuth Redirect

1. Go to: https://console.cloud.google.com/
2. Navigate to your OAuth credentials
3. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Click "Save"

## Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 5: Test Authentication

1. Visit: `http://localhost:3000/admin/login`
2. You should see:
   - "Continue with Google" button
   - Email magic link form

### Test Google OAuth:
1. Click "Continue with Google"
2. Select your Google account (kevaleaditya1@gmail.com or adityakevale2904@gmail.com)
3. You should be redirected to `/admin` dashboard

### Test Email Magic Link:
1. Enter your admin email
2. Click "Send Magic Link"
3. Check your email inbox
4. Click the link in the email
5. You should be logged in

## ✅ What Works Now:

- Google OAuth login
- Email magic link login
- Only admin emails can access `/admin`
- Sessions stored in database
- Secure authentication

## 🔒 Admin Emails:

Only these emails have access:
- kevaleaditya1@gmail.com
- adityakevale2904@gmail.com

Anyone else will be denied.

## ❌ Troubleshooting:

### "Prisma Client not found"
Run: `npx prisma generate`

### "Can't reach database"
- Check DATABASE_URL in `.env.local`
- Verify Supabase database is running
- Check password is `ashitya2605`

### "Redirect URI mismatch"
- Add callback URL to Google OAuth settings
- Make sure it's exactly: `http://localhost:3000/api/auth/callback/google`

### "Email not sent"
- Check RESEND_API_KEY is correct
- Verify Resend account is active

## 📝 What Changed:

1. **Login Page**: Now has Google button + email form
2. **Authentication**: Uses NextAuth (no more simple password)
3. **Database**: Stores users and sessions in Supabase
4. **Security**: Only whitelisted emails can access admin

Let me know when you've completed these steps and I'll help with any issues!
