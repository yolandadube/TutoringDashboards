import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (user: User, fullName: string, role: string = 'student') => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: fullName,
          role: role,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile data after setting user
          setTimeout(async () => {
            let profileData = await fetchProfile(session.user.id);
            
            // If no profile exists, create one with default role
            if (!profileData && event === 'SIGNED_IN') {
              const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
              profileData = await createProfile(session.user, fullName);
            }
            
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(async (profileData) => {
          // If no profile exists, create one
          if (!profileData) {
            const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
            profileData = await createProfile(session.user, fullName);
          }
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // If user is created and session exists, create profile
      if (data.user && data.session) {
        await createProfile(data.user, fullName);
      }

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "Please check your email to confirm your account before signing in.",
        });
      } else if (data.user && data.session) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // TEMPORARY ADMIN BYPASS - Remove this after getting access
      if (email === 'admin@bypass.local' && password === 'bypass123') {
        // Create a mock admin user and profile
        const mockUser = {
          id: 'admin-bypass-id',
          email: 'admin@bypass.local',
          user_metadata: { full_name: 'Admin User' }
        } as any;
        
        const mockProfile = {
          id: 'admin-profile-id',
          user_id: 'admin-bypass-id',
          email: 'admin@bypass.local',
          full_name: 'Admin User',
          role: 'admin'
        };

        // Set the mock data
        setUser(mockUser);
        setProfile(mockProfile);
        setLoading(false);
        
        toast({
          title: "Admin Bypass",
          description: "Logged in as admin via bypass mode",
        });
        
        return { data: { user: mockUser, session: { user: mockUser } }, error: null };
      }
      // END TEMPORARY BYPASS

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}