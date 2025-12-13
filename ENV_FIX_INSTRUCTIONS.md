# MANUAL FIX FOR IMAGE UPLOAD

The `.env.local` file needs to be created manually. Follow these steps:

## Step 1: Create `.env.local` file

1. Open your project folder: `c:\Users\Aditya\OneDrive\Desktop\Ashitya 2 antigravity`
2. Create a new file called `.env.local` (if it doesn't exist, delete the existing one)
3. Copy and paste EXACTLY this content:

```
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Ashitya
CLOUDINARY_API_KEY=273652718356478
CLOUDINARY_API_SECRET=BNRUoMCg9NCXDSOy4qzFu7EraiQ
RESEND_API_KEY=re_Q1opLveE_8PiMoSY8M3MUTxMoe2AEkpQH
CONTACT_EMAIL=kevaleaditya1@gmail.com
```

**IMPORTANT:** 
- Each variable should be on its OWN line
- NO spaces around the `=` sign
- NO quotes around values
- Save the file with UTF-8 encoding

## Step 2: Restart Dev Server

After saving `.env.local`:

1. Stop your dev server (Ctrl+C)
2. Run: `npm run dev`
3. Try uploading an image again

## Step 3: Verify It Works

1. Go to `http://localhost:3000/admin/login`
2. Login with password: `admin123`
3. Click "New Post"
4. Try uploading an image
5. If it works, you'll see the image preview!

## Troubleshooting

If it still doesn't work:
1. Check the browser console for errors (F12)
2. Check the terminal for server errors
3. Verify the `.env.local` file has NO extra spaces or line breaks
4. Make sure you restarted the server AFTER creating the file

## Alternative: Use VS Code

1. Open the project in VS Code
2. Create new file: `.env.local`
3. Paste the content above
4. Save
5. Restart server
