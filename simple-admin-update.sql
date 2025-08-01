-- Simple update script for existing admin user
-- This will just update the password and role for the existing user

-- First, let's see what we have
SELECT 
    'Current user details:' as info,
    u.id as user_id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@yolymaticstutorials.com';

-- Update the password for existing user
UPDATE auth.users 
SET 
    encrypted_password = crypt('$Yolymatics007$', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
WHERE email = 'admin@yolymaticstutorials.com';

-- Update the profile to admin role
UPDATE public.profiles 
SET 
    full_name = 'Yolanda Dube',
    role = 'admin',
    updated_at = NOW()
WHERE email = 'admin@yolymaticstutorials.com';

-- Verify the updates
SELECT 
    'Updated user details:' as info,
    u.id as user_id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@yolymaticstutorials.com';
