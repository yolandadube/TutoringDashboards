-- SIMPLE NO-EMAIL ADMIN - Creates a user that can login immediately
-- No email verification required!

-- Step 1: Disable RLS
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 3: Clean up any existing test user
DELETE FROM public.profiles WHERE email = 'admin@local.test';
DELETE FROM auth.users WHERE email = 'admin@local.test';

-- Step 4: Create confirmed user (minimal approach)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@local.test',
    crypt('admin123', gen_salt('bf')),
    NOW(),  -- Email confirmed immediately
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Local Admin"}',
    NOW(),
    NOW()
);

-- Step 5: Create admin profile
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

-- Step 6: Verify setup
SELECT 
    '✅ READY TO LOGIN!' as status,
    u.email,
    'Email is confirmed: ' || (u.email_confirmed_at IS NOT NULL) as confirmation_status,
    p.role
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@local.test';

-- Login instructions
SELECT 'Email: admin@local.test' as login_email;
SELECT 'Password: admin123' as login_password;
SELECT 'No email verification needed!' as note;
