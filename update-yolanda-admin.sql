-- Update existing user to be admin
-- This will find the existing user with admin@yolymaticstutorials.com
-- and update their profile to be an admin with the correct details

DO $$
DECLARE
    existing_user_id uuid;
BEGIN
    -- Find the existing user ID
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'admin@yolymaticstutorials.com';
    
    IF existing_user_id IS NULL THEN
        RAISE NOTICE 'No user found with email admin@yolymaticstutorials.com';
        RETURN;
    END IF;
    
    -- Update the user's password
    UPDATE auth.users 
    SET 
        encrypted_password = crypt('$Yolymatics007$', gen_salt('bf')),
        email_confirmed_at = NOW(),
        raw_user_meta_data = '{"full_name": "Yolanda Dube"}',
        updated_at = NOW()
    WHERE email = 'admin@yolymaticstutorials.com';
    
    -- Update or insert the profile
    INSERT INTO public.profiles (user_id, email, full_name, role, updated_at)
    VALUES (existing_user_id, 'admin@yolymaticstutorials.com', 'Yolanda Dube', 'admin', NOW())
    ON CONFLICT (email) 
    DO UPDATE SET 
        full_name = 'Yolanda Dube',
        role = 'admin',
        updated_at = NOW();
    
    RAISE NOTICE 'Admin user updated successfully!';
    RAISE NOTICE 'Email: admin@yolymaticstutorials.com';
    RAISE NOTICE 'Password: $Yolymatics007$';
    RAISE NOTICE 'Name: Yolanda Dube';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE 'User ID: %', existing_user_id;
    
END $$;
