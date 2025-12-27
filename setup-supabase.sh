#!/bin/bash
# Supabase Setup Script for Expense Manager
# Run this after installing Supabase CLI: npm install -g supabase

set -e

echo "🚀 Setting up Supabase for Expense Manager"
echo "═══════════════════════════════════════════════════"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "   Install it using one of these methods:"
    echo ""
    echo "   Option 1: Homebrew (macOS/Linux)"
    echo "      brew install supabase/tap/supabase"
    echo ""
    echo "   Option 2: Scoop (Windows)"
    echo "      scoop bucket add supabase https://github.com/supabase/scoop-bucket.git"
    echo "      scoop install supabase"
    echo ""
    echo "   Option 3: Direct download"
    echo "      Visit: https://github.com/supabase/cli/releases"
    echo ""
    echo "   Then run: supabase login"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo "   Run: supabase login"
    exit 1
fi

echo "✅ Supabase CLI is ready"
echo ""

# Get database password
read -sp "Enter database password (min 8 chars): " DB_PASSWORD
echo ""
if [ ${#DB_PASSWORD} -lt 8 ]; then
    echo "❌ Password must be at least 8 characters"
    exit 1
fi

# Get organization ID
echo ""
echo "📋 Getting organization ID..."
ORG_ID=$(supabase projects list 2>/dev/null | grep -v "LINKED" | grep -v "---" | awk 'NR==2 {print $2}' | head -1)

if [ -z "$ORG_ID" ]; then
    echo "❌ Could not determine organization ID"
    echo "   Please create project manually at: https://supabase.com/dashboard"
    echo "   Or provide org-id: supabase projects create expense-manager --org-id YOUR_ORG_ID --db-password PASSWORD"
    exit 1
fi

echo "✅ Organization ID: $ORG_ID"

# Create Supabase project
echo ""
echo "📊 Creating Supabase project..."
PROJECT_NAME="expense-manager"

# Try creating with org-id (region may be optional in some CLI versions)
supabase projects create "$PROJECT_NAME" --org-id "$ORG_ID" --db-password "$DB_PASSWORD" 2>&1 || {
    echo "⚠️  Project creation via CLI failed"
    echo "   This might be due to CLI version or region requirements"
    echo "   Creating project manually is recommended:"
    echo "   1. Go to https://supabase.com/dashboard"
    echo "   2. Click 'New Project'"
    echo "   3. Name: expense-manager"
    echo "   4. Password: [use the one you entered]"
    echo "   5. Wait for creation, then continue with linking..."
    echo ""
    read -p "Press Enter after you've created the project manually, or Ctrl+C to exit..."
}

# Get project details
echo ""
echo "📋 Getting project details..."
PROJECT_REF=$(supabase projects list | grep "$PROJECT_NAME" | awk '{print $1}' | head -1)

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Could not find project reference"
    echo "   Please create project manually at: https://supabase.com/dashboard"
    exit 1
fi

echo "✅ Project Reference: $PROJECT_REF"

# Link local project
echo ""
echo "🔗 Linking local project..."
supabase link --project-ref "$PROJECT_REF" || {
    echo "⚠️  Could not link project automatically"
    echo "   You may need to link manually"
}

# Run schema
echo ""
echo "📊 Running database schema..."
if [ -f "supabase-schema.sql" ]; then
    supabase db execute --file supabase-schema.sql || {
        echo "⚠️  Schema execution failed"
        echo "   Please run supabase-schema.sql manually in Supabase SQL Editor"
    }
else
    echo "❌ supabase-schema.sql not found"
fi

# Insert dummy data
echo ""
echo "📊 Inserting dummy data..."
if [ -f "supabase-dummy-data.sql" ]; then
    supabase db execute --file supabase-dummy-data.sql || {
        echo "⚠️  Dummy data insertion failed"
        echo "   Please run supabase-dummy-data.sql manually in Supabase SQL Editor"
    }
else
    echo "❌ supabase-dummy-data.sql not found"
fi

# Get project URL and keys
echo ""
echo "🔑 Getting project credentials..."
PROJECT_URL=$(supabase projects api-keys --project-ref "$PROJECT_REF" 2>/dev/null | grep "Project URL" | awk '{print $3}' || echo "")
ANON_KEY=$(supabase projects api-keys --project-ref "$PROJECT_REF" 2>/dev/null | grep "anon" | awk '{print $2}' || echo "")

if [ -z "$PROJECT_URL" ] || [ -z "$ANON_KEY" ]; then
    echo "⚠️  Could not retrieve credentials automatically"
    echo "   Get them from: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
else
    echo "✅ Project URL: $PROJECT_URL"
    echo "✅ Anon Key: ${ANON_KEY:0:20}..."
    echo ""
    echo "📋 Set these in Vercel:"
    echo "   VITE_SUPABASE_URL=$PROJECT_URL"
    echo "   VITE_SUPABASE_ANON_KEY=$ANON_KEY"
fi

echo ""
echo "✅ Supabase setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel (see above)"
echo "2. Deploy: vercel --prod"

