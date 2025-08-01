-- FIX ADMIN CONNECTION - Repair the user-profile link
-- This will fix any connection issues between auth.users and profiles

-- Step 1: Let's see what we actually have
SELECT 
    '=== CURRENT STATE ===' as info,
    'AUTH USERS:' as table_name,
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as confirmed
FROM auth.users u
WHERE u.email = 'admin@local.test';

SELECT 
    '=== CURRENT STATE ===' as info,
    'PROFILES:' as table_name,
    p.user_id,
    p.email,
    p.role
FROM public.profiles p
WHERE p.email = 'admin@local.test';

-- Step 2: Delete and recreate the profile with correct user_id
DELETE FROM public.profiles WHERE email = 'admin@local.test';

-- Step 3: Create profile linked to the correct user
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
    u.email,
    'admin',
    NOW(),
    NOW()
FROM auth.users u 
WHERE u.email = 'admin@local.test';

-- Step 4: Update user to make sure email is confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'admin@local.test' 
  AND email_confirmed_at IS NULL;

-- Step 5: Final verification
SELECT 
    '=== FINAL CHECK ===' as info,
    u.email as auth_email,
    p.email as profile_email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    p.role,
    p.full_name,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL AND p.role = 'admin' AND u.id = p.user_id 
        THEN '✅ READY TO LOGIN!'
        ELSE '❌ Still has issues'
    END as status
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@local.test';

-- Success message
SELECT '🎉 ADMIN USER FIXED!' as message;
SELECT 'Email: admin@local.test' as login_email;
SELECT 'Password: admin123' as login_password;
SELECT 'URL: https://tutoring-dashboards-pkzy17wfq-yolanda-dubes-projects.vercel.app' as website;
