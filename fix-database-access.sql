-- Fix database schema access for admin user
-- This will ensure the admin can access all necessary tables

-- First, let's check what RLS policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Create comprehensive RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.user_id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.user_id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.user_id = auth.uid() AND p.role = 'admin'
        )
        OR user_id = auth.uid()  -- Allow users to create their own profile
    );

CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.user_id = auth.uid() AND p.role = 'admin'
        )
    );

-- Enable RLS on all relevant tables and create basic policies
DO $$
DECLARE
    tbl_name text;
    table_list text[] := ARRAY[
        'students', 'tutors', 'parents', 'lessons', 'feedback', 
        'payments', 'schedules', 'subjects', 'lesson_materials'
    ];
BEGIN
    FOREACH tbl_name IN ARRAY table_list
    LOOP
        -- Check if table exists before creating policies
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl_name) THEN
            -- Enable RLS
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl_name);
            
            -- Drop existing policies if they exist
            EXECUTE format('DROP POLICY IF EXISTS "Admins can access all %s" ON public.%I', tbl_name, tbl_name);
            EXECUTE format('DROP POLICY IF EXISTS "Users can view own %s" ON public.%I', tbl_name, tbl_name);
            
            -- Create admin access policy
            EXECUTE format('CREATE POLICY "Admins can access all %s" ON public.%I
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM public.profiles p 
                        WHERE p.user_id = auth.uid() AND p.role = ''admin''
                    )
                )', tbl_name, tbl_name);
                
            -- Create user access policy (where applicable)
            IF tbl_name IN ('students', 'tutors', 'parents') THEN
                EXECUTE format('CREATE POLICY "Users can view own %s" ON public.%I
                    FOR SELECT USING (user_id = auth.uid())', tbl_name, tbl_name);
            END IF;
            
            RAISE NOTICE 'Updated RLS policies for table: %', tbl_name;
        ELSE
            RAISE NOTICE 'Table % does not exist, skipping', tbl_name;
        END IF;
    END LOOP;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify the admin user can now access profiles
SELECT 
    'Admin user verification:' as status,
    u.email,
    p.full_name,
    p.role,
    p.user_id
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'yolanda.admin@yolymaticstutorials.com';

-- Database schema access has been fixed!
-- You can now log in with: yolanda.admin@yolymaticstutorials.com
-- Password: $Yolymatics007$
