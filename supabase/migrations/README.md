# Database Migration Guide

This folder contains SQL migrations to set up your database without Supabase.

## Files

1. **001_initial_schema.sql** - Creates the core tables and schema:
   - `users` table (for authentication)
   - `user_roles` table (for admin role management)
   - `portfolio_items` table (for portfolio content)
   - RLS policies and indexes

2. **002_seed_admin_user.sql** - Creates the admin user with:
   - Email: `soodpranav235@gmail.com`
   - Password: `par@&006`

## How to Use

### Option 1: PostgreSQL (Recommended)
```bash
# Connect to your PostgreSQL database
psql -h your_host -U your_user -d your_database -f migrations/001_initial_schema.sql
psql -h your_host -U your_user -d your_database -f migrations/002_seed_admin_user.sql
```

### Option 2: Using a GUI Tool
1. Open your PostgreSQL GUI client (pgAdmin, DBeaver, etc.)
2. Copy the contents of `001_initial_schema.sql`
3. Execute it in your database
4. Repeat for `002_seed_admin_user.sql`

## Important Notes

### ⚠️ Password Security
The SQL seed file stores passwords in plain text, which is **NOT secure for production**. 

For production, you should:
1. Hash passwords using bcrypt or similar before storing
2. Use environment variables for sensitive data
3. Implement proper authentication middleware

### 🔧 What Needs to Change in Your Code

The React app is currently built for Supabase. To use a custom database:

1. **Create a Backend API** (Node.js, Python, etc.) that handles:
   - User authentication (login/signup)
   - Admin role verification
   - Portfolio CRUD operations

2. **Update Authentication Flow** in `src/hooks/useAuth.tsx`:
   - Replace Supabase calls with your API endpoints
   - Implement JWT token handling or session management

3. **Update Supabase Client** in `src/integrations/supabase/client.ts`:
   - Replace with API client (fetch, axios, etc.)

### 📋 Database Schema Overview

```
users
├── id (UUID)
├── email (VARCHAR)
├── password_hash (VARCHAR)
├── created_at
└── updated_at

user_roles
├── id (UUID)
├── user_id (FK → users.id)
├── role (app_role: 'admin')
└── created_at

portfolio_items
├── id (UUID)
├── title (VARCHAR)
├── description (TEXT)
├── image_url (VARCHAR)
├── project_url (VARCHAR)
├── github_url (VARCHAR)
├── technologies (TEXT[])
├── created_at
├── updated_at
└── created_by (FK → users.id)
```

## Next Steps

1. Set up a PostgreSQL database
2. Run the migration files
3. Create a backend API to replace Supabase functionality
4. Update the React authentication code to call your API
