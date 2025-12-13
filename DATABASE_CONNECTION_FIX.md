# Database Connection Error - Fix Guide

## Error
```
Can't reach database server at db.cqqdqyvfgipyxdncmrjn.supabase.co:5432
```

## Possible Causes

### 1. Supabase Project Paused (Most Common)
Free tier Supabase projects pause after 7 days of inactivity.

**Fix:**
1. Go to https://supabase.com/dashboard
2. Find your project: `db.cqqdqyvfgipyxdncmrjn`
3. If it says "Paused", click **"Resume"**
4. Wait 1-2 minutes for it to start
5. Restart your dev server

### 2. Wrong DATABASE_URL

**Check your `.env.local` file has:**
```
DATABASE_URL=postgresql://postgres:ashitya2605@db.cqqdqyvfgipyxdncmrjn.supabase.co:5432/postgres
```

**If it's different:**
1. Go to Supabase Dashboard
2. Project Settings → Database
3. Copy the **Connection String** (Direct connection)
4. Replace `[YOUR-PASSWORD]` with your actual password
5. Update `.env.local`

### 3. Network/Firewall Issue

**Test connection:**
```bash
# Try to ping the database
ping db.cqqdqyvfgipyxdncmrjn.supabase.co
```

If ping fails, check:
- Your internet connection
- Firewall settings
- VPN (try disabling if active)

### 4. Restart Everything

Sometimes a simple restart fixes it:

```bash
# Stop dev server (Ctrl+C)
# Then restart
npm run dev
```

## Quick Checklist

- [ ] Supabase project is **not paused**
- [ ] DATABASE_URL in `.env.local` is correct
- [ ] Internet connection is working
- [ ] Restarted dev server
- [ ] Cleared `.next` folder: `rm -rf .next` (then restart)

## Still Not Working?

### Option 1: Use Local Database (Temporary)
If you need to work offline, you can use SQLite temporarily.

### Option 2: Create New Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Get new DATABASE_URL
4. Update `.env.local`
5. Run `npx prisma db push`

## Most Likely Solution

**Your Supabase project is paused.** Go to the dashboard and resume it!

After resuming:
1. Wait 1-2 minutes
2. Restart dev server
3. Try logging in again

The features will work once the database is connected! 🚀
