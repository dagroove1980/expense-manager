# Expense Manager - Setup Guide

Follow these steps to complete the setup and deploy your expense management website.

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - Project name: `expense-manager` (or your choice)
   - Database password: (save this!)
   - Region: Choose closest to you
4. Wait for project to be created (2-3 minutes)

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

## Step 3: Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 4: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
cd expense-manager
git init
git branch -M main
gh repo create expense-manager --public --source=. --remote=origin
git add -A
git commit -m "Initial commit: Expense Manager"
git push -u origin main
```

### Option B: Manual GitHub Setup

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `expense-manager`
3. Don't initialize with README (we already have one)
4. Then run:

```bash
cd expense-manager
git init
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-manager.git
git add -A
git commit -m "Initial commit: Expense Manager"
git push -u origin main
```

## Step 5: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Login to Vercel
vercel login

# Link project
cd expense-manager
vercel link

# Set environment variables
vercel env add VITE_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted

# Deploy
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository `expense-manager`
4. Configure:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `.`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
6. Click "Deploy"

## Step 6: Verify Deployment

1. After deployment, Vercel will give you a URL (e.g., `expense-manager.vercel.app`)
2. Visit the URL
3. Try adding an expense
4. Check Supabase Dashboard → Table Editor → `expenses` to see your data

## Troubleshooting

### Build Fails

- Make sure environment variables are set correctly in Vercel
- Check Vercel build logs for errors
- Verify `vercel-build.js` is running correctly

### Data Not Saving

- Check browser console for errors
- Verify Supabase credentials in Vercel environment variables
- Check Supabase Dashboard → Table Editor to see if tables exist
- Verify RLS policies allow operations (check `supabase-schema.sql`)

### Can't Connect to Supabase

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check that the Supabase project is active
- Verify the anon key is correct (Settings → API)

## Local Development

To run locally:

```bash
cd expense-manager
npm install
npm run dev
```

Create a `.env.local` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

- Customize categories in the Categories page
- Add your first expense
- Set up budgets (future feature)
- Customize colors and styling in `styles.css`

## Support

If you encounter issues:
1. Check browser console (F12)
2. Check Vercel build logs
3. Check Supabase logs (Dashboard → Logs)
4. Verify all environment variables are set correctly

