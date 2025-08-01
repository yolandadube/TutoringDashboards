-- EMERGENCY ADMIN ACCESS - Super Simple Approach
-- This will make ANY user that signs up become an admin automatically

-- Step 1: Disable RLS completely
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant all permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 3: Update the signup trigger to make ALL new users admins temporarily
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Admin User'), 
    'admin'  -- Make everyone admin for now
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Show current users
SELECT 
    'CURRENT USERS:' as info,
    u.email,
    p.role,
    u.email_confirmed_at IS NOT NULL as confirmed
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- Instructions
SELECT '🚨 EMERGENCY ADMIN SETUP COMPLETE! 🚨' as message;
SELECT 'NOW: Go to your website and sign up with ANY email' as step1;
SELECT 'The user will automatically become an admin!' as step2;
SELECT 'URL: https://tutoring-dashboards-pkzy17wfq-yolanda-dubes-projects.vercel.app' as step3;
SELECT 'Use the Sign Up tab, not Sign In' as step4;
SELECT 'After signup, you will be routed to Admin Dashboard' as step5;
