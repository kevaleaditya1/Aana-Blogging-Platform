# Admin Login Troubleshooting

## Issue: Stuck on "Signing in..."

### Quick Fixes:

**1. Check Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Try logging in
- Look for error messages

**2. Common Issues:**

**A) Database Not Connected**
- Make sure Neon database is set in `.env.local`
- Run `npx prisma db push` to verify connection

**B) Admin Account Doesn't Exist**
- Run: `npx tsx create-admin.ts`
- This creates the admin account

**C) Wrong Password**
- Password: `Ashitya@2605`
- Email: `kevaleaditya1@gmail.com`

**D) Session Issues**
- Clear browser cookies
- Try in incognito mode

### Test Steps:

1. **Verify Database:**
   ```bash
   npx prisma db push
   ```

2. **Create Admin (if needed):**
   ```bash
   npx tsx create-admin.ts
   ```

3. **Check Console Logs:**
   - Open DevTools
   - Try login
   - Check what it says

4. **Try Direct URL:**
   - After login, manually go to: `http://localhost:3000/admin`

### What to Look For in Console:

- "Attempting login with: kevaleaditya1@gmail.com" ✅
- "Login result: { ok: true }" ✅
- "Login successful, redirecting..." ✅

If you see errors, tell me what they say!
