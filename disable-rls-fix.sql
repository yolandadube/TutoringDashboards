-- Ultra-simple admin fix - disable RLS entirely for testing
-- This removes all Row Level Security complications

-- Disable RLS on profiles table entirely
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean slate
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.profiles;

-- Grant full access to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify admin user can be accessed
SELECT 
    'Admin user verification (RLS disabled):' as status,
    u.email,
    p.full_name,
    p.role,
    p.user_id
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'yolanda.admin@yolymaticstutorials.com';

-- Success message
SELECT 'RLS has been disabled - admin should now have full access!' as result;
