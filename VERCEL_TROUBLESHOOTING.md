# Vercel Deployment Troubleshooting Guide

## Common Errors & Solutions

### 1. "Cannot find module" Errors
**Error:** `Error: Cannot find module 'dotenv'` or similar

**Fix:** Add build configuration in Vercel:
- Go to Project Settings → General → Build & Development Settings
- **Install Command:** `npm install`
- **Build Command:** Leave empty
- Click Save

### 2. "MONGODB_URI is not defined"
**Error:** Database connection fails, or "MONGODB_URI not configured"

**Fix:** Add environment variables:
- Go to Settings → Environment Variables
- Add `MONGODB_URI` (see VERCEL_ENVIRONMENT_VARIABLES.txt)
- Must select all 3 environments: Production, Preview, Development
- Redeploy after adding

### 3. API Routes Return 404
**Error:** `/api/contact` returns "Not Found" or 404

**Fix:** Check `vercel.json` routing:
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

### 4. CSS Not Loading (White/Unstyled Page)
**Error:** Page loads but no styles, liquid glass missing

**Fix:** 
- Verify `vercel.json` only rewrites `/api/(.*)` not `/(.*)`
- Check browser DevTools → Network → style.css should be `text/css` not `text/html`

### 5. "Function Execution Timeout"
**Error:** Serverless function timeout after 10 seconds

**Fix:** This is likely database connection delay
- Make sure MongoDB Atlas allows connections from "0.0.0.0/0"
- Check MongoDB connection string is correct
- Use MongoDB Atlas (not localhost) for production

### 6. Build Fails with Package Errors
**Error:** npm install fails during build

**Fix:**
- Check `package.json` has all dependencies
- Make sure Node version matches: `"node": ">=18.0.0"`
- Try: Settings → General → Node.js Version → 18.x

### 7. "Internal Server Error" on All Pages
**Error:** 500 error on every page

**Causes:**
1. Missing environment variables
2. Database connection failing
3. Missing dependencies

**Debug Steps:**
1. Check Runtime Logs in Vercel dashboard
2. Look for specific error messages
3. Verify all environment variables are set
4. Test locally first: `npm start`

---

## How to Read Vercel Logs

### Build Logs
- Shows npm install, file copying
- Look for "Error:" or "Failed to compile"

### Runtime Logs (Most Important)
- Shows actual errors when users visit site
- Look for:
  - `Error: Cannot find module`
  - `MONGODB_URI not configured`
  - `Database connection error`
  - Stack traces

### Function Logs
- Shows API route execution
- Each `/api/*` call shows here
- Look for timing and errors

---

## Quick Debug Commands

Test API health:
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

---

## What to Share for Help

When asking for help, provide:
1. Full error message from logs
2. Which log section (Build / Runtime / Function)
3. Screenshot of error if possible
4. What URL/page is failing

