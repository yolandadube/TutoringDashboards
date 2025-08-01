import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ygctsplkylhyzdycslzn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY3RzcGxreWxoeXpkeWNzbHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDI3NDksImV4cCI6MjA2NzExODc0OX0.k1hXaelF4QNr6-vM-NifcYwfFGuGwx5JfojNaeNwgSo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database query error:', error);
    } else {
      console.log('✅ Database connection successful!');
      console.log('Profiles table accessible, rows found:', data.length);
    }
  } catch (error) {
    console.error('Connection error:', error);
  }

  try {
    // Test auth configuration
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth error:', authError);
    } else {
      console.log('✅ Auth system accessible!');
      console.log('Current session:', authData.session ? 'Active' : 'None');
    }
  } catch (error) {
    console.error('Auth connection error:', error);
  }
}

testConnection();
