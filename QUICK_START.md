# Quick Start Guide - Supabase Setup

## Step 1: Create Supabase Project

### Option A: Via Web Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in or create a free account

2. **Create New Project**
   - Click "New Project" button
   - Fill in project details:
     - **Name**: `expense-manager` (or your choice)
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose the region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for project to be created

3. **Get Your Credentials**
   - Once project is ready, go to **Settings** → **API**
   - Copy these two values:
     - **Project URL** (looks like `https://xxxxx.supabase.co`)
     - **anon/public key** (long string starting with `eyJ...`)

### Option B: Using Setup Script

Run the setup script to guide you through the process:

```bash
chmod +x setup-supabase.sh
./setup-supabase.sh
```

## Step 2: Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates:
- `categories` table (with default categories)
- `expenses` table
- `budgets` table (for future use)
- All necessary indexes and triggers

## Step 3: Configure Local Development

### Create `.env.local` file:

```bash
# Copy the template
cp .env.example .env.local  # if .env.example exists
# OR create manually:
```

Create `.env.local` with:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual credentials from Step 1.

## Step 4: Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and try adding an expense!

## Step 5: Deploy to Vercel

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Supabase configuration"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Add Environment Variables:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Click "Deploy"

## Troubleshooting

### Can't connect to Supabase?
- ✅ Check that `.env.local` exists and has correct values
- ✅ Verify Supabase project is active (not paused)
- ✅ Check browser console for errors (F12)

### Database errors?
- ✅ Make sure you ran `supabase-schema.sql` in SQL Editor
- ✅ Check Supabase Dashboard → Table Editor to see if tables exist
- ✅ Verify RLS policies allow operations

### Build fails on Vercel?
- ✅ Make sure environment variables are set in Vercel dashboard
- ✅ Check Vercel build logs for specific errors
- ✅ Verify `vercel-build.js` is running correctly

## Need Help?

- Check `SETUP.md` for detailed instructions
- Check browser console (F12) for errors
- Check Supabase Dashboard → Logs for database errors
