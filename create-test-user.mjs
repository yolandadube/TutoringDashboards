import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ygctsplkylhyzdycslzn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY3RzcGxreWxoeXpkeWNzbHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDI3NDksImV4cCI6MjA2NzExODc0OX0.k1hXaelF4QNr6-vM-NifcYwfFGuGwx5JfojNaeNwgSo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createUserWithoutEmailConfirmation() {
  const testEmail = 'admin@example.com';  // Changed to a more standard domain
  const testPassword = 'Admin123!';
  const testName = 'Yolymatics Admin';

  console.log('Attempting to create user without email confirmation...');
  
  try {
    // Try to sign up with autoConfirm if available
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testName,
        },
        // This might help skip email confirmation in development
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      console.error('Sign-up error:', error);
      return;
    }

    console.log('User created:', data.user?.id);
    console.log('Session created:', data.session ? 'Yes' : 'No');
    console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');

    if (data.user && data.session) {
      console.log('✅ User signed up successfully without email confirmation!');
      
      // Try to create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          email: testEmail,
          full_name: testName,
          role: 'admin', // Making this user an admin for testing
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('✅ Admin profile created successfully!');
        console.log('You can now log in with:');
        console.log('Email:', testEmail);
        console.log('Password:', testPassword);
      }
    } else {
      console.log('❌ Email confirmation still required');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUserWithoutEmailConfirmation();
