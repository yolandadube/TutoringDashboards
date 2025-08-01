-- Create admin user for Yolanda Dube
-- Email: admin@yolymaticstutorials.com
-- Password: $Yolymatics007$
-- Name: Yolanda Dube

DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
BEGIN
    -- Insert user into auth.users
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
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'admin@yolymaticstutorials.com',
        crypt('$Yolymatics007$', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Yolanda Dube"}',
        false,
        '',
        '',
        '',
        ''
    );

    -- Create profile for the admin user
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
        new_user_id,
        'admin@yolymaticstutorials.com',
        'Yolanda Dube',
        'admin'
    );

    RAISE NOTICE 'Admin user created successfully!';
    RAISE NOTICE 'Email: admin@yolymaticstutorials.com';
    RAISE NOTICE 'Password: $Yolymatics007$';
    RAISE NOTICE 'Name: Yolanda Dube';
    RAISE NOTICE 'Role: admin';
    
END $$;
