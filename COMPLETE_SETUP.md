# Complete Setup Guide - Expense Manager

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project (Manual - Recommended)

The Supabase CLI has limitations with project creation, so manual creation is faster:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Click "New Project"**
3. **Fill in:**
   - Name: `expense-manager`
   - Database Password: `ExpenseManager2024!` (or your choice)
   - Region: Choose closest to you
4. **Wait 2-3 minutes** for project creation

### Step 2: Link Project Locally

```bash
cd expense-manager

# Get your project reference ID from Supabase dashboard (URL or project settings)
# It looks like: gwcjqeufvntetkzivaix

supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Run Database Schema

```bash
supabase db execute --file supabase-schema.sql
```

### Step 4: Insert Dummy Data

```bash
supabase db execute --file supabase-dummy-data.sql
```

### Step 5: Get Credentials

```bash
# Get project URL and anon key
supabase projects api-keys --project-ref YOUR_PROJECT_REF
```

Or get them from: Supabase Dashboard → Settings → API

### Step 6: Set Environment Variables in Vercel

```bash
# Set Supabase URL
vercel env add VITE_SUPABASE_URL production
# Paste your Supabase URL when prompted

# Set Supabase anon key
vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted
```

### Step 7: Deploy

```bash
vercel --prod
```

## ✅ Done!

Your expense manager is now live and ready to use!

## Alternative: Use Vercel Dashboard

If you prefer the web interface:

1. Go to https://vercel.com/dashboard
2. Select `expense-manager` project
3. Settings → Environment Variables
4. Add:
   - `VITE_SUPABASE_URL` = [your Supabase URL]
   - `VITE_SUPABASE_ANON_KEY` = [your anon key]
5. Redeploy (or push to GitHub for auto-deploy)

