# 🗄️ Supabase Database Setup Guide

This guide will help you set up Supabase to store user information and fitness plans.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Your project name (e.g., "AI Fitness Coach")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (Optional - for admin operations, keep secret!)

## Step 3: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL to create the necessary tables:

```sql
-- Create users table to store Firebase user information
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on firebase_uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

-- Create fitness_plans table to store user plans
CREATE TABLE IF NOT EXISTS fitness_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firebase_user_id TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  user_form_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on firebase_user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_fitness_plans_user_id ON fitness_plans(firebase_user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_created_at ON fitness_plans(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to access only their own data
-- Policy for users table
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'firebase_uid');

CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (firebase_uid = current_setting('request.jwt.claims', true)::json->>'firebase_uid');

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'firebase_uid');

-- Policy for fitness_plans table
CREATE POLICY "Users can view their own plans"
  ON fitness_plans FOR SELECT
  USING (firebase_user_id = current_setting('request.jwt.claims', true)::json->>'firebase_uid');

CREATE POLICY "Users can insert their own plans"
  ON fitness_plans FOR INSERT
  WITH CHECK (firebase_user_id = current_setting('request.jwt.claims', true)::json->>'firebase_uid');

CREATE POLICY "Users can delete their own plans"
  ON fitness_plans FOR DELETE
  USING (firebase_user_id = current_setting('request.jwt.claims', true)::json->>'firebase_uid');
```

**Note**: Since we're using Firebase Auth, the RLS policies might not work exactly as shown. You can either:
- Disable RLS for now and handle authorization in your API routes (simpler)
- Or set up JWT verification with Firebase tokens

For simplicity, you can disable RLS for now:

```sql
-- Disable RLS (for development - handle auth in API routes)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_plans DISABLE ROW LEVEL SECURITY;
```

## Step 4: Add Environment Variables

Add your Supabase credentials to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 5: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Sign up/login with Firebase
3. Generate a fitness plan
4. The plan should automatically save to Supabase

5. Check your Supabase dashboard:
   - Go to **Table Editor** → `fitness_plans`
   - You should see your saved plan!

## Database Schema

### `users` Table
- `id` (UUID): Primary key
- `firebase_uid` (TEXT): Firebase user ID (unique)
- `email` (TEXT): User email
- `display_name` (TEXT): User display name (optional)
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### `fitness_plans` Table
- `id` (UUID): Primary key
- `firebase_user_id` (TEXT): Firebase user ID
- `plan_data` (JSONB): The generated fitness plan data
- `user_form_data` (JSONB): User's form input data
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Security Notes

⚠️ **Important**: 
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- The anon key is safe to use in client-side code
- Handle user authorization in your API routes
- Use Firebase Auth to verify user identity before database operations

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the SQL scripts to create the tables
- Check that you're using the correct database

### "permission denied" error
- Check your RLS policies
- Or disable RLS for development
- Verify your Supabase credentials are correct

### Plans not saving
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase tables exist

### Can't query plans
- Verify the `firebase_user_id` matches the logged-in user's UID
- Check that RLS policies allow the query (or disable RLS)
- Check Supabase logs in the dashboard

