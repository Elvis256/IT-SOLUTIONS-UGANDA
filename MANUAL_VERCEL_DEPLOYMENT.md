# Manual Vercel Deployment Steps

## You need to authenticate with Vercel first

### Step 1: Login to Vercel

Open a **new terminal** and run:

```bash
cd ~/Downloads/files
vercel login
```

This will:
1. Show you a device code (like: XXXX-XXXX)
2. Try to open your browser automatically
3. Ask you to visit: https://vercel.com/device

**Authenticate in the browser:**
- Go to the URL shown
- Enter the device code
- Click "Confirm"
- Return to terminal

### Step 2: Deploy to Production

After successful login, run:

```bash
cd ~/Downloads/files
vercel --prod
```

**Answer the prompts:**
- `Set up and deploy?` → **Y** (yes)
- `Which scope?` → Select your account
- `Link to existing project?` → **N** (no - create new)
- `What's your project's name?` → **it-solutions-uganda** (or press enter for default)
- `In which directory is your code located?` → **./** (press enter)

### Step 3: Add Environment Variables

After deployment, go to Vercel Dashboard:

1. Visit: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production, Preview, and Development**:

```
MONGODB_URL=mongodb+srv://elvis:Mun00nDa5%23%23%23%23@cluster0.j1pstg8.mongodb.net/itsolutions?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=jwt_secret_key_it_solutions_uganda_2024_secure
SESSION_SECRET=session_secret_key_it_solutions_2024_secure
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

### Alternative: Deploy via Vercel Dashboard

If CLI doesn't work, use the web interface:

1. Go to: https://vercel.com/new
2. Click **Import Project**
3. Select **Import Git Repository**
4. Choose: `Elvis256/IT-SOLUTIONS-UGANDA`
5. Configure:
   - Framework: **Other**
   - Root Directory: **./** (leave default)
   - Build Command: leave empty
   - Output Directory: leave empty
6. Add environment variables (see above)
7. Click **Deploy**

---

✅ Your code is ready on GitHub: https://github.com/Elvis256/IT-SOLUTIONS-UGANDA
✅ All fixes applied (liquid glass CSS, API routes, MongoDB support)
✅ vercel.json fixed to serve static files correctly

