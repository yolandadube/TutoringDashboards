-- DEBUG SCRIPT - See exactly what users exist and their login status
-- Run this first to understand what's in your database

SELECT 
    '=== AUTH USERS ===' as section,
    u.id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    u.created_at,
    length(u.encrypted_password) as has_password
FROM auth.users u
WHERE u.email LIKE '%admin%' 
   OR u.email LIKE '%yolanda%' 
   OR u.email LIKE '%yolymatic%'
ORDER BY u.created_at DESC;

SELECT 
    '=== PROFILES ===' as section,
    p.user_id,
    p.email,
    p.full_name,
    p.role,
    p.created_at
FROM public.profiles p
WHERE p.email LIKE '%admin%' 
   OR p.email LIKE '%yolanda%' 
   OR p.email LIKE '%yolymatic%'
ORDER BY p.created_at DESC;

SELECT 
    '=== JOINED DATA ===' as section,
    u.email as auth_email,
    p.email as profile_email,
    p.role,
    u.email_confirmed_at IS NOT NULL as confirmed,
    CASE 
        WHEN u.id IS NULL THEN 'NO AUTH USER'
        WHEN p.user_id IS NULL THEN 'NO PROFILE'
        WHEN u.email_confirmed_at IS NULL THEN 'EMAIL NOT CONFIRMED'
        WHEN p.role != 'admin' THEN 'WRONG ROLE: ' || p.role
        ELSE 'SHOULD WORK'
    END as status
FROM auth.users u
FULL OUTER JOIN public.profiles p ON u.id = p.user_id
WHERE u.email LIKE '%admin%' 
   OR u.email LIKE '%yolanda%' 
   OR u.email LIKE '%yolymatic%'
   OR p.email LIKE '%admin%' 
   OR p.email LIKE '%yolanda%' 
   OR p.email LIKE '%yolymatic%'
ORDER BY u.created_at DESC NULLS LAST;
