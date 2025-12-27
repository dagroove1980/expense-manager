#!/bin/bash

# Verify Supabase Setup Script

echo "🔍 Verifying Supabase Setup..."
echo "================================"
echo ""

# Check .env.local
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check for SUPABASE_URL
    if grep -q "VITE_SUPABASE_URL" .env.local; then
        URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d '=' -f2 | tr -d ' ' | tr -d '"')
        if [ -n "$URL" ] && [ "$URL" != "your-project-id.supabase.co" ]; then
            echo "✅ VITE_SUPABASE_URL is configured: ${URL:0:30}..."
        else
            echo "❌ VITE_SUPABASE_URL is not set correctly"
        fi
    else
        echo "❌ VITE_SUPABASE_URL not found in .env.local"
    fi
    
    # Check for SUPABASE_ANON_KEY
    if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        KEY=$(grep "VITE_SUPABASE_ANON_KEY" .env.local | cut -d '=' -f2 | tr -d ' ' | tr -d '"')
        if [ -n "$KEY" ] && [ "$KEY" != "your-anon-key-here" ]; then
            echo "✅ VITE_SUPABASE_ANON_KEY is configured: ${KEY:0:30}..."
        else
            echo "❌ VITE_SUPABASE_ANON_KEY is not set correctly"
        fi
    else
        echo "❌ VITE_SUPABASE_ANON_KEY not found in .env.local"
    fi
else
    echo "❌ .env.local file not found"
    echo "   Create it with:"
    echo "   VITE_SUPABASE_URL=https://your-project-id.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=your-anon-key-here"
fi

echo ""
echo "📋 Database Schema Check:"
echo "   Go to Supabase Dashboard → SQL Editor"
echo "   Make sure you've run supabase-schema.sql"
echo ""

echo "📋 Next Steps:"
echo "   1. Create Supabase project at https://supabase.com/dashboard"
echo "   2. Run supabase-schema.sql in SQL Editor"
echo "   3. Get credentials from Settings → API"
echo "   4. Update .env.local with your credentials"
echo "   5. Run: npm run dev"
echo ""
