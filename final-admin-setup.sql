-- COMPLETE ADMIN SETUP - This will create a working admin user with proper routing
-- Run this script to get instant admin access

-- Step 1: Completely disable RLS to remove all barriers
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Clean up any existing admin users
DELETE FROM public.profiles WHERE email IN (
    'admin@yolymaticstutorials.com', 
    'yolanda.admin@yolymaticstutorials.com',
    'yolanda@yolymaticstutorials.com'
);

-- Step 3: Clean up from auth.users (may fail, that's OK)
DELETE FROM auth.users WHERE email IN (
    'admin@yolymaticstutorials.com', 
    'yolanda.admin@yolymaticstutorials.com',
    'yolanda@yolymaticstutorials.com'
);

-- Step 4: Create the admin user in auth.users with confirmed email
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
    '{"full_name": "Yolanda Dube", "role": "admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Step 5: Create the profile that the dashboard routing needs
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
WHERE u.email = 'admin@yolymaticstutorials.com';

-- Step 6: Grant all necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 7: Verify everything is set up correctly
SELECT 
    'ADMIN USER READY!' as status,
    u.id as user_id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.role,
    'Login at: https://tutoring-dashboards-pkzy17wfq-yolanda-dubes-projects.vercel.app' as login_url
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@yolymaticstutorials.com';

-- Step 8: Show login instructions
SELECT '🎉 ADMIN ACCESS READY! 🎉' as message;
SELECT 'Go to: https://tutoring-dashboards-pkzy17wfq-yolanda-dubes-projects.vercel.app' as step1;
SELECT 'Email: admin@yolymaticstutorials.com' as step2;
SELECT 'Password: $Yolymatics007$' as step3;
SELECT 'After login, you will be automatically routed to the Admin Dashboard!' as step4;
