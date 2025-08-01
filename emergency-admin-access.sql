-- EMERGENCY ADMIN ACCESS - Complete reset and new admin creation
-- This will create a fresh admin user and remove all barriers

-- Step 1: Completely disable RLS on ALL tables
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tutors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lessons DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant ALL permissions to authenticated users
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON SCHEMA public TO authenticated;

-- Step 3: Delete any existing admin user to start fresh
DELETE FROM public.profiles WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'yolanda.admin@yolymaticstutorials.com'
);

-- Delete from auth.users (this might fail if you don't have permission, that's ok)
DELETE FROM auth.users WHERE email = 'yolanda.admin@yolymaticstutorials.com';

-- Step 4: Create a completely new admin user directly in auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@yolymaticstutorials.com',
    crypt('$Yolymatics007$', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Yolanda Dube"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Step 5: Create the profile for the new admin user
INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    role,
    created_at,
    updated_at
) 
SELECT 
    u.id,
    'Yolanda Dube',
    'admin@yolymaticstutorials.com',
    'admin',
    NOW(),
    NOW()
FROM auth.users u 
WHERE u.email = 'admin@yolymaticstutorials.com'
ON CONFLICT (user_id) DO UPDATE SET
    full_name = 'Yolanda Dube',
    email = 'admin@yolymaticstutorials.com',
    role = 'admin',
    updated_at = NOW();

-- Step 6: Verify the new admin user
SELECT 
    'NEW ADMIN USER CREATED!' as status,
    u.id as user_id,
    u.email,
    u.email_confirmed_at,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@yolymaticstutorials.com';

-- Step 7: Alternative - Try creating with the original email too
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'yolanda.admin@yolymaticstutorials.com',
    crypt('$Yolymatics007$', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Yolanda Dube"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('$Yolymatics007$', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW();

-- Create profile for backup admin
INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    role,
    created_at,
    updated_at
) 
SELECT 
    u.id,
    'Yolanda Dube',
    'yolanda.admin@yolymaticstutorials.com',
    'admin',
    NOW(),
    NOW()
FROM auth.users u 
WHERE u.email = 'yolanda.admin@yolymaticstutorials.com'
ON CONFLICT (user_id) DO UPDATE SET
    full_name = 'Yolanda Dube',
    role = 'admin',
    updated_at = NOW();

-- Final verification
SELECT 
    'ALL ADMIN USERS:' as status,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email LIKE '%admin%yolymaticstutorials.com%'
ORDER BY u.email;

SELECT '🎉 EMERGENCY ADMIN ACCESS COMPLETE! 🎉' as message;
SELECT 'Try logging in with either:' as instructions;
SELECT '1. admin@yolymaticstutorials.com' as option1;
SELECT '2. yolanda.admin@yolymaticstutorials.com' as option2;
SELECT 'Password: $Yolymatics007$' as password;
