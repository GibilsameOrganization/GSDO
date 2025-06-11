# RLS Policy Fix for Profiles Table

## Problem
The application is unable to read user roles from the `profiles` table, likely due to Row Level Security (RLS) policies blocking access.

## Current Profile Data
```
| id                                   | email                     | full_name                 | role  | created_at                    | updated_at                    |
| ------------------------------------ | ------------------------- | ------------------------- | ----- | ----------------------------- | ----------------------------- |
| 8763d90a-39ab-41fd-b7c1-50832a93afbc | gibilsame.org01@gmail.com | gibilsame.org01@gmail.com | admin | 2025-06-07 23:25:48.830109+00 | 2025-06-07 23:25:48.830109+00 |
```

## Solution Options

### Option 1: Check Current RLS Policies
Run this in Supabase SQL Editor to see current policies:

```sql
-- Check if RLS is enabled on profiles table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Option 2: Create Proper RLS Policy for Profiles
Run this in Supabase SQL Editor:

```sql
-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);
```

### Option 3: Create Admin-Specific Policy
If you need admin users to read all profiles:

```sql
-- Allow admin users to read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Option 4: Use the is_admin Function (Recommended)
The database already has an `is_admin` function. Ensure it's properly defined:

```sql
-- Check if the function exists
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- If it doesn't exist, create it
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Option 5: Temporary Fix - Disable RLS (NOT RECOMMENDED FOR PRODUCTION)
```sql
-- ONLY for testing - disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

## Testing the Fix

After applying any of the above solutions, test in the browser console:

```javascript
// Test direct profile access
const { data, error } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', 'your-user-id')
  .single();
console.log('Profile access:', { data, error });

// Test is_admin function
const { data: isAdmin, error: funcError } = await supabase
  .rpc('is_admin', { user_id: 'your-user-id' });
console.log('is_admin function:', { isAdmin, funcError });
```

## Recommended Approach

1. First, try Option 2 (proper RLS policies)
2. If that doesn't work, ensure the `is_admin` function exists (Option 4)
3. The application code has been updated to try both approaches automatically

## Application Changes Made

The application now:
1. First tries to use the `is_admin` function (bypasses RLS)
2. Falls back to direct table query if function fails
3. Provides detailed error logging to identify RLS issues
4. Shows RLS status in the debug panel
