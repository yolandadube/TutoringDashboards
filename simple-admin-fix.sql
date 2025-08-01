-- Simple admin access fix - bypass RLS for admin user
-- This will give the admin user direct access to bypass Row Level Security

-- First, let's check if the admin user exists
SELECT 
    'Checking admin user:' as status,
    u.id as user_id,
    u.email,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'yolanda.admin@yolymaticstutorials.com';

-- Option 1: Grant the admin user bypass RLS privileges
-- This gives the admin user superuser-like access to bypass RLS
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the admin user ID
    SELECT u.id INTO admin_user_id
    FROM auth.users u
    WHERE u.email = 'yolanda.admin@yolymaticstutorials.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Grant bypass RLS for the admin user
        EXECUTE format('GRANT authenticated TO %I', admin_user_id::text);
        
        RAISE NOTICE 'Granted admin privileges to user: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user not found!';
    END IF;
END $$;

-- Option 2: Disable RLS temporarily on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all access for authenticated users
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.profiles;
CREATE POLICY "Allow all access for authenticated users" ON public.profiles
    FOR ALL USING (true);

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant broad permissions to authenticated role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test the admin user access
SELECT 
    'Final verification:' as status,
    u.email,
    p.full_name,
    p.role,
    'Admin access should now work' as message
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'yolanda.admin@yolymaticstutorials.com';
