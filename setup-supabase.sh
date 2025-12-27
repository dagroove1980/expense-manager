#!/bin/bash

# Supabase Setup Helper Script
# This script helps you set up your Supabase project connection

echo "🚀 Supabase Setup Helper"
echo "========================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  Found existing .env.local file"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        exit 0
    fi
fi

echo ""
echo "📋 Follow these steps to get your Supabase credentials:"
echo ""
echo "1. Go to https://supabase.com/dashboard"
echo "2. Sign in or create an account"
echo "3. Click 'New Project'"
echo "4. Fill in:"
echo "   - Project name: expense-manager (or your choice)"
echo "   - Database password: (save this!)"
echo "   - Region: Choose closest to you"
echo "5. Wait for project creation (2-3 minutes)"
echo "6. Go to Settings → API"
echo "7. Copy your Project URL and anon/public key"
echo ""

read -p "Press Enter when you have your Supabase credentials ready..."

echo ""
read -p "Enter your Supabase Project URL: " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_KEY

# Validate inputs
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Error: Both URL and Key are required!"
    exit 1
fi

# Create .env.local file
cat > .env.local << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
EOF

echo ""
echo "✅ Created .env.local file with your credentials"
echo ""
echo "📝 Next steps:"
echo "1. Run the SQL schema in Supabase SQL Editor:"
echo "   - Go to SQL Editor in Supabase dashboard"
echo "   - Copy contents of supabase-schema.sql"
echo "   - Paste and run it"
echo ""
echo "2. Test locally:"
echo "   npm run dev"
echo ""
echo "3. For Vercel deployment, add these as environment variables:"
echo "   VITE_SUPABASE_URL=$SUPABASE_URL"
echo "   VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY"
echo ""
