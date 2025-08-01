-- Create NEW admin user for Yolanda Dube with different email
-- Email: yolanda.admin@yolymaticstutorials.com
-- Password: $Yolymatics007$
-- Name: Yolanda Dube

-- First check if this new email already exists
SELECT 
    'Checking if new email exists:' as info,
    email,
    email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users 
WHERE email = 'yolanda.admin@yolymaticstutorials.com';

-- Create the new admin user
DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
BEGIN
    -- Insert new user into auth.users
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
        new_user_id,
        'authenticated',
        'authenticated',
        'yolanda.admin@yolymaticstutorials.com',
        crypt('$Yolymatics007$', gen_salt('bf')),
        NOW(),  -- Email is confirmed immediately
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Yolanda Dube"}'
    );

    -- Insert admin profile (this will be created by trigger, but let's be explicit)
    INSERT INTO public.profiles (user_id, email, full_name, role, created_at, updated_at)
    VALUES (
        new_user_id,
        'yolanda.admin@yolymaticstutorials.com',
        'Yolanda Dube',
        'admin',
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
        full_name = 'Yolanda Dube',
        role = 'admin',
        updated_at = NOW();

    RAISE NOTICE '✅ NEW ADMIN USER CREATED SUCCESSFULLY!';
    RAISE NOTICE 'User ID: %', new_user_id;
    RAISE NOTICE '================================';
    RAISE NOTICE 'NEW LOGIN CREDENTIALS:';
    RAISE NOTICE 'Email: yolanda.admin@yolymaticstutorials.com';
    RAISE NOTICE 'Password: $Yolymatics007$';
    RAISE NOTICE 'Name: Yolanda Dube';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE '================================';
    
END $$;

-- Verify the new user was created successfully
SELECT 
    '✅ NEW USER VERIFICATION:' as status,
    u.id as user_id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.role,
    p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'yolanda.admin@yolymaticstutorials.com';
