# Quick Setup Guide - Expense Manager

## 🚀 Fastest Way to Complete Setup

### Step 1: Install Supabase CLI (if not already installed)

**On macOS:**
```bash
brew install supabase/tap/supabase
supabase login
```

**If you get permission errors:**
```bash
sudo chown -R $(whoami) /opt/homebrew/Cellar
brew install supabase/tap/supabase
```

### Step 2: Run Automated Setup

```bash
cd expense-manager
./setup-supabase.sh
```

The script will:
- ✅ Create Supabase project
- ✅ Link it locally  
- ✅ Run database schema
- ✅ Insert dummy data
- ✅ Show you credentials for Vercel

### Step 3: Set Environment Variables in Vercel

After the script completes, you'll see your Supabase credentials. Set them in Vercel:

```bash
cd expense-manager
vercel env add VITE_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted
```

### Step 4: Deploy

```bash
vercel --prod
```

## 🎉 Done!

Your expense manager will be live and ready to use!

## Alternative: Manual Setup

If you prefer manual setup or the script doesn't work:

1. **Create Supabase Project:**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name: `expense-manager`
   - Set password and region

2. **Run SQL Files:**
   - Go to SQL Editor
   - Run `supabase-schema.sql`
   - Run `supabase-dummy-data.sql`

3. **Get Credentials:**
   - Settings → API
   - Copy Project URL and anon key

4. **Set in Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add both variables

5. **Deploy:**
   - `vercel --prod` or push to GitHub

