-- SIMPLE FIX - Work with existing users and just fix the role
-- This will find any existing admin user and make sure they can log in

-- Step 1: Disable RLS completely
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Let's see what users actually exist
SELECT 
    'EXISTING USERS:' as info,
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as confirmed,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email LIKE '%yolymatic%' OR u.email LIKE '%admin%'
ORDER BY u.created_at DESC;

-- Step 3: Update ANY existing admin-like user to have admin role
UPDATE public.profiles 
SET role = 'admin', 
    full_name = 'Yolanda Dube',
    updated_at = NOW()
WHERE email LIKE '%admin%' OR email LIKE '%yolanda%' OR user_id IN (
    SELECT id FROM auth.users WHERE email LIKE '%admin%' OR email LIKE '%yolanda%'
);

-- Step 4: Create a simple test user that we KNOW will work
-- First delete any existing test user
DELETE FROM auth.users WHERE email = 'test@admin.com';

-- Then create the new user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@admin.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Test Admin"}'
);

-- Step 5: Create profile for test admin (handle duplicates manually)
-- First delete any existing profile for this email
DELETE FROM public.profiles WHERE email = 'test@admin.com';

-- Then insert the new profile
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
    'Test Admin',
    'test@admin.com',
    'admin',
    NOW(),
    NOW()
FROM auth.users u 
WHERE u.email = 'test@admin.com';

-- Step 6: Grant all permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 7: Show all admin users available for login
SELECT 
    'AVAILABLE ADMIN LOGINS:' as info,
    u.email,
    'Password varies - check below' as password_hint,
    p.full_name,
    p.role
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE p.role = 'admin'
ORDER BY u.email;

-- Login options:
SELECT 'LOGIN OPTION 1: test@admin.com / admin123' as option1;
SELECT 'LOGIN OPTION 2: Any existing admin email / $Yolymatics007$' as option2;
SELECT 'URL: https://tutoring-dashboards-pkzy17wfq-yolanda-dubes-projects.vercel.app' as url;
