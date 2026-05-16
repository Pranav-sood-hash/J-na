# Supabase Database Setup

## Steps to Enable Database Functionality

Your app needs the Supabase database table `portfolio_content` to be created. Follow these steps:

### 1. Go to Supabase Dashboard
- Visit https://app.supabase.com
- Sign in with your account
- Select the project `jilkccmpudcqylnpehai`

### 2. Run the SQL Migration
- Go to **SQL Editor** (left sidebar)
- Click **New Query**
- Copy and paste the entire content from `supabase/migrations/20250516_create_portfolio_content.sql`
- Click **Run** (or Cmd+Enter)

The migration will create:
- `portfolio_content` table with all necessary columns
- Indexes for performance
- Row Level Security (RLS) policies
- Auto-update trigger for `updated_at`

### 3. Configure Supabase Storage for File Uploads
- Go to **Storage** (left sidebar)
- Click **Create a new bucket**
- Name it: `portfolio-media`
- Make it **Public** (uncheck "Private bucket")
- Click **Create bucket**

### 4. Test the Connection
- Refresh the app in your browser
- Go to `/admin/create` and try creating a new certificate
- You should now be able to upload files and create content

## Environment Variables
Your environment variables are already configured:
- `VITE_SUPABASE_URL`: `https://jilkccmpudcqylnpehai.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: Set in `.env`

## Troubleshooting

### Still getting "Failed to fetch" errors?
1. Check that the `portfolio_content` table was created successfully
   - Go to Supabase Dashboard → SQL Editor → Run: `SELECT * FROM portfolio_content LIMIT 1;`
2. Verify RLS policies are enabled
   - Go to Supabase Dashboard → Authentication → Policies
3. Check browser console for detailed error messages

### File uploads not working?
1. Verify the `portfolio-media` storage bucket exists and is public
2. Check that you're authenticated as admin (should see your email in top right)

## What's Enabled After Setup

✅ Create certificates, videos, and websites  
✅ Upload images/videos with automatic cloud storage  
✅ Edit and delete content  
✅ Control visibility (show/hide from portfolio)  
✅ Automatic database persistence  
✅ Public portfolio displays only visible items
