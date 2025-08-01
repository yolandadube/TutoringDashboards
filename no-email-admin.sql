-- ULTIMATE ADMIN ACCESS - Bypass email confirmation entirely
-- This creates a user that can log in immediately without email verification

-- Step 1: Disable RLS completely
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant all permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 3: Create a user that bypasses email confirmation
-- Delete any existing user first
DELETE FROM public.profiles WHERE email = 'admin@local.test';
DELETE FROM auth.users WHERE email = 'admin@local.test';

-- Create the auth user with email already confirmed
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    phone_confirmed_at,
    confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    confirmed_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@local.test',
    crypt('admin123', gen_salt('bf')),
    NOW(),           -- email_confirmed_at - CONFIRMED IMMEDIATELY
    NOW(),           -- phone_confirmed_at
    NOW(),           -- confirmed_at - FULLY CONFIRMED
    NOW(),           -- last_sign_in_at
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Local Admin", "email": "admin@local.test"}',
    false,           -- is_super_admin
    NOW(),           -- created_at
    NOW(),           -- updated_at
    null,            -- phone
    '',              -- phone_change
    '',              -- phone_change_token
    null,            -- phone_change_sent_at
    NOW(),           -- confirmed_at (duplicate but required)
    '',              -- email_change_token_current
    0,               -- email_change_confirm_status
    null,            -- banned_until
    '',              -- reauthentication_token
    null,            -- reauthentication_sent_at
    false,           -- is_sso_user
    null             -- deleted_at
);

-- Step 4: Create the profile
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
    'Local Admin',
    'admin@local.test',
    'admin',
    NOW(),
    NOW()
FROM auth.users u 
WHERE u.email = 'admin@local.test';

-- Step 5: Verify the setup
SELECT 
    'ADMIN USER READY FOR IMMEDIATE LOGIN!' as status,
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    u.confirmed_at IS NOT NULL as fully_confirmed,
    p.full_name,
    p.role
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@local.test';

-- Final instructions
SELECT '🎉 NO EMAIL VERIFICATION NEEDED! 🎉' as message;
SELECT 'Login immediately with:' as instruction;
SELECT 'Email: admin@local.test' as email;
SELECT 'Password: admin123' as password;
SELECT 'URL: https://tutoring-dashboards-pkzy17wfq-yolanda-dubes-projects.vercel.app' as website;
SELECT 'This user is already confirmed and ready to use!' as note;
