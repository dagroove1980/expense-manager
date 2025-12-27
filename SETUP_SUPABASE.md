# Supabase Project Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in or create a free account (if you don't have one)

2. **Create New Project**
   - Click the **"New Project"** button (top right)
   - Fill in:
     - **Name**: `expense-manager` (or your preferred name)
     - **Database Password**: Create a strong password (⚠️ **SAVE THIS** - you'll need it!)
     - **Region**: Choose the region closest to you
   - Click **"Create new project"**
   - ⏳ Wait 2-3 minutes for the project to be created

3. **Get Your Credentials**
   - Once the project is ready, click on your project
   - Go to **Settings** (gear icon) → **API**
   - Copy these two values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: Long string starting with `eyJ...`

### Step 2: Set Up Database Schema

1. In your Supabase project dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase-schema.sql` from this project
4. Copy **ALL** the SQL code from that file
5. Paste it into the SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
7. You should see: **"Success. No rows returned"**

This creates:
- ✅ `categories` table (with 9 default categories)
- ✅ `expenses` table
- ✅ `budgets` table (for future use)
- ✅ Indexes and triggers for performance

### Step 3: Configure Local Development

Create a `.env.local` file in the project root:

```bash
# In the project root directory
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
```

**Replace** `your-project-id` and `your-anon-key-here` with your actual values from Step 1.

### Step 4: Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and try:
- Adding an expense
- Creating a category
- Check Supabase Dashboard → Table Editor → `expenses` to see your data!

### Step 5: Deploy to Vercel

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Configure Supabase connection"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click **"Add New Project"**
   - Import your GitHub repository
   - In **Environment Variables**, add:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Click **"Deploy"**

## Verify Your Setup

Run this to check your configuration:

```bash
# Check if .env.local exists and has values
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    grep -q "VITE_SUPABASE_URL" .env.local && echo "✅ SUPABASE_URL configured" || echo "❌ SUPABASE_URL missing"
    grep -q "VITE_SUPABASE_ANON_KEY" .env.local && echo "✅ SUPABASE_ANON_KEY configured" || echo "❌ SUPABASE_ANON_KEY missing"
else
    echo "❌ .env.local not found"
fi
```

## Troubleshooting

### ❌ "Can't connect to Supabase"
- ✅ Check `.env.local` exists and has correct values (no extra spaces)
- ✅ Verify Supabase project is active (not paused)
- ✅ Check browser console (F12) for specific errors
- ✅ Make sure you're using the **anon/public** key, not the service_role key

### ❌ "Database errors"
- ✅ Make sure you ran `supabase-schema.sql` in SQL Editor
- ✅ Check Supabase Dashboard → Table Editor to see if tables exist
- ✅ Verify RLS (Row Level Security) policies allow operations

### ❌ "Build fails on Vercel"
- ✅ Make sure environment variables are set in Vercel dashboard
- ✅ Check Vercel build logs for specific errors
- ✅ Verify variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### ❌ "Data not syncing"
- ✅ Check browser console for errors
- ✅ Verify Supabase credentials in `.env.local` (local) or Vercel (production)
- ✅ Check Supabase Dashboard → Logs for database errors
- ✅ Make sure RLS policies allow INSERT/UPDATE/DELETE operations

## Next Steps

Once setup is complete:
1. ✅ Add your first expense
2. ✅ Create custom categories
3. ✅ View statistics on the home page
4. ✅ Deploy to Vercel for production use

## Need Help?

- 📖 See `SETUP.md` for detailed deployment instructions
- 📖 See `QUICK_START.md` for quick reference
- 🔍 Check browser console (F12) for errors
- 🔍 Check Supabase Dashboard → Logs for database errors
