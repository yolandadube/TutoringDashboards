import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const SUPABASE_URL = "https://ygctsplkylhyzdycslzn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY3RzcGxreWxoeXpkeWNzbHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDI3NDksImV4cCI6MjA2NzExODc0OX0.k1hXaelF4QNr6-vM-NifcYwfFGuGwx5JfojNaeNwgSo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminUser() {
  const adminEmail = 'admin@yolymatics.com';
  const adminPassword = 'Admin123!';
  const adminName = 'Yolymatics Admin';

  try {
    console.log('Creating admin user...');
    
    // Sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: adminName,
        },
      },
    });

    if (signUpError) {
      console.error('Error creating admin user:', signUpError.message);
      return;
    }

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', signUpData.user?.id);

    // If the user was created and confirmed, create their profile
    if (signUpData.user && signUpData.session) {
      console.log('Creating admin profile...');
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: signUpData.user.id,
          email: adminEmail,
          full_name: adminName,
          role: 'admin',
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating admin profile:', profileError.message);
      } else {
        console.log('Admin profile created successfully!');
        console.log('Profile:', profileData);
      }
    } else {
      console.log('Please check your email to confirm the admin account.');
      console.log('After confirmation, the profile will be created automatically when you first log in.');
    }

  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the script
createAdminUser().then(() => {
  console.log('\nAdmin user creation completed.');
  console.log('You can now log in with:');
  console.log('Email: admin@yolymatics.com');
  console.log('Password: Admin123!');
});
