-- Fix admin login for Yolanda Dube
-- This script will ensure you can log in with admin@yolymaticstutorials.com

DO $$
DECLARE
    user_exists boolean := false;
    user_uuid uuid;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@yolymaticstutorials.com') INTO user_exists;
    
    IF user_exists THEN
        -- Get the user ID
        SELECT id INTO user_uuid FROM auth.users WHERE email = 'admin@yolymaticstutorials.com';
        
        -- Update existing user with new password and confirm email
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('$Yolymatics007$', gen_salt('bf')),
            email_confirmed_at = NOW(),
            raw_user_meta_data = '{"full_name": "Yolanda Dube"}',
            updated_at = NOW()
        WHERE email = 'admin@yolymaticstutorials.com';
        
        -- Update profile to admin role
        UPDATE public.profiles 
        SET 
            full_name = 'Yolanda Dube',
            role = 'admin',
            updated_at = NOW()
        WHERE user_id = user_uuid;
        
        RAISE NOTICE 'UPDATED existing user to admin';
        RAISE NOTICE 'User ID: %', user_uuid;
    ELSE
        -- Create new user if doesn't exist
        user_uuid := gen_random_uuid();
        
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
            user_uuid,
            'authenticated',
            'authenticated',
            'admin@yolymaticstutorials.com',
            crypt('$Yolymatics007$', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Yolanda Dube"}'
        );
        
        -- Create admin profile
        INSERT INTO public.profiles (user_id, email, full_name, role)
        VALUES (user_uuid, 'admin@yolymaticstutorials.com', 'Yolanda Dube', 'admin');
        
        RAISE NOTICE 'CREATED new admin user';
        RAISE NOTICE 'User ID: %', user_uuid;
    END IF;
    
    -- Verify the setup
    RAISE NOTICE '=== LOGIN CREDENTIALS ===';
    RAISE NOTICE 'Email: admin@yolymaticstutorials.com';
    RAISE NOTICE 'Password: $Yolymatics007$';
    RAISE NOTICE 'Name: Yolanda Dube';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE '========================';
    
END $$;

-- Also verify the user exists and show their details
SELECT 
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.role,
    p.user_id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@yolymaticstutorials.com';
