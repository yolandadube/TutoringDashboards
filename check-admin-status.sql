-- CHECK ADMIN STATUS - See if admin user is ready for login
-- This will show you the current state of the admin user

-- Check if the admin user exists and is confirmed
SELECT 
    '=== ADMIN USER STATUS ===' as check_type,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    u.created_at,
    'User exists and ready!' as status
FROM auth.users u
WHERE u.email = 'admin@local.test';

-- Check if profile exists
SELECT 
    '=== ADMIN PROFILE STATUS ===' as check_type,
    p.email,
    p.full_name,
    p.role,
    'Profile exists!' as status
FROM public.profiles p
WHERE p.email = 'admin@local.test';

-- Check the connection between user and profile
SELECT 
    '=== USER-PROFILE CONNECTION ===' as check_type,
    u.email as auth_email,
    p.email as profile_email,
    p.role,
    p.full_name,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL AND p.role = 'admin' THEN '✅ READY TO LOGIN!'
        WHEN u.email_confirmed_at IS NULL THEN '❌ Email not confirmed'
        WHEN p.role != 'admin' THEN '❌ Wrong role: ' || p.role
        ELSE '❌ Unknown issue'
    END as login_status
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@local.test';

-- Show login instructions if ready
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM auth.users u 
            JOIN public.profiles p ON u.id = p.user_id 
            WHERE u.email = 'admin@local.test' 
            AND u.email_confirmed_at IS NOT NULL 
            AND p.role = 'admin'
        ) THEN '🎉 LOGIN NOW!'
        ELSE '❌ Setup incomplete'
    END as final_status;

-- If ready, show login details
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM auth.users u 
            JOIN public.profiles p ON u.id = p.user_id 
            WHERE u.email = 'admin@local.test' 
            AND u.email_confirmed_at IS NOT NULL 
            AND p.role = 'admin'
        ) THEN 'Email: admin@local.test'
        ELSE 'Not ready yet'
    END as login_email;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM auth.users u 
            JOIN public.profiles p ON u.id = p.user_id 
            WHERE u.email = 'admin@local.test' 
            AND u.email_confirmed_at IS NOT NULL 
            AND p.role = 'admin'
        ) THEN 'Password: admin123'
        ELSE 'Not ready yet'
    END as login_password;
