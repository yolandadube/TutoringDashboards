-- Create users authentication system with proper RLS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'tutor', 'student', 'parent')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password management table
CREATE TABLE public.user_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
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

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS policies for credentials
CREATE POLICY "Users can view own credentials" ON public.user_credentials
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own credentials" ON public.user_credentials
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage credentials" ON public.user_credentials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create new user (for admin use)
CREATE OR REPLACE FUNCTION public.create_user(
  p_email TEXT,
  p_full_name TEXT,
  p_role TEXT,
  p_password TEXT,
  p_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generate new user ID
  new_user_id := gen_random_uuid();
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, full_name, role, phone)
  VALUES (new_user_id, p_email, p_full_name, p_role, p_phone);
  
  -- Insert credentials
  INSERT INTO public.user_credentials (user_id, password_hash)
  VALUES (new_user_id, public.hash_password(p_password));
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to change password
CREATE OR REPLACE FUNCTION public.change_password(
  p_user_id UUID,
  p_old_password TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_hash TEXT;
BEGIN
  -- Get current password hash
  SELECT password_hash INTO current_hash 
  FROM public.user_credentials 
  WHERE user_id = p_user_id;
  
  -- Verify old password
  IF NOT public.verify_password(p_old_password, current_hash) THEN
    RETURN FALSE;
  END IF;
  
  -- Update with new password
  UPDATE public.user_credentials 
  SET password_hash = public.hash_password(p_new_password),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset password (admin only)
CREATE OR REPLACE FUNCTION public.reset_user_password(
  p_user_id UUID,
  p_new_password TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can reset passwords';
  END IF;
  
  -- Update password
  UPDATE public.user_credentials 
  SET password_hash = public.hash_password(p_new_password),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at
  BEFORE UPDATE ON public.user_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample admin user
SELECT public.create_user(
  'admin@yolymatics.com',
  'Yolanda Dube',
  'admin',
  'admin123',
  '+1234567890'
);

-- Insert sample tutor
SELECT public.create_user(
  'maria@yolymatics.com',
  'Dr. Maria Garcia',
  'tutor',
  'tutor123',
  '+1234567891'
);

-- Insert sample student
SELECT public.create_user(
  'alex@student.com',
  'Alex Johnson',
  'student',
  'student123',
  '+1234567892'
);

-- Insert sample parent
SELECT public.create_user(
  'parent@johnson.com',
  'Robert Johnson',
  'parent',
  'parent123',
  '+1234567893'
);