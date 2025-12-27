# Wealth OS

Personal wealth and expense management system built with HTML, JavaScript, Supabase, and deployed on Vercel.

## Features

- ✅ Track expenses with categories, dates, and payment methods
- ✅ View spending statistics (total, monthly, weekly)
- ✅ Organize expenses by custom categories
- ✅ Search and filter expenses
- ✅ Cloud storage with Supabase
- ✅ Responsive design

## Setup

This project is automatically configured with:
- ✅ GitHub repository
- ✅ Supabase database
- ✅ Vercel deployment

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployment is automatic via Vercel when you push to main branch.

## Environment Variables

Set in Vercel dashboard:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

## Database Setup

1. Go to Supabase SQL Editor
2. Run the SQL from `supabase-schema.sql`
3. Your database will be ready!

## Project Structure

- `index.html` - Landing page with stats
- `expenses.html` - Expense list and management
- `categories.html` - Category management
- `app.js` - Core application logic
- `expenses.js` - Expense-specific functions
- `supabase.js` - Supabase integration
- `styles.css` - Styling
- `vercel-build.js` - Build script for environment variables

## Next Steps

1. Run the SQL schema in Supabase SQL Editor
2. Set environment variables in Vercel
3. Deploy and start tracking expenses!

