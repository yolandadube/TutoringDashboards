-- Quick debug - let's see what's actually in your database
-- Run this first to understand the current state

-- Check all users in auth.users
SELECT 
    'AUTH USERS:' as table_name,
    id,
    email,
    email_confirmed_at IS NOT NULL as confirmed,
    created_at
FROM auth.users 
WHERE email LIKE '%yolymatic%'
ORDER BY created_at DESC;

-- Check all profiles
SELECT 
    'PROFILES:' as table_name,
    user_id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles 
WHERE email LIKE '%yolymatic%'
ORDER BY created_at DESC;

-- Check if there are any RLS policies still active
SELECT 
    'ACTIVE POLICIES:' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename = 'profiles'
ORDER BY tablename, policyname;

-- Check table permissions
SELECT 
    'TABLE PERMISSIONS:' as info,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND grantee = 'authenticated';

-- Check if RLS is enabled
SELECT 
    'RLS STATUS:' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';
