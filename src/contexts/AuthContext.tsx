
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validatePasswordStrength, createRateLimiter } from '@/config/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, name?: string, requestedRole?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Rate limiter for login attempts
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const cleanupAuthState = () => {
    try {
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.') || 
        key.includes('sb-') ||
        key === 'pendingUserRole' ||
        key === 'userRole'
      );
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Auth state cleanup completed');
    } catch (error) {
      console.error('Error during auth state cleanup:', error);
    }
  };

  const fetchUserRole = async (userId: string): Promise<string> => {
    try {
      console.log('Fetching role for user:', userId);
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
        if (roleError.code === 'PGRST116') {
          console.log('No role found, assigning default user role');
          // Assign default user role using the correct type
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'user' as const
            });
          
          if (insertError) {
            console.error('Error assigning default role:', insertError);
          }
          return 'user';
        }
        return 'user';
      }

      const role = roleData?.role || 'user';
      console.log('User role fetched:', role);
      return role;
    } catch (error: any) {
      console.error('Error in fetchUserRole:', error);
      return 'user';
    }
  };

  const refreshUserRole = async () => {
    if (user && !loading) {
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (initialized) return;

      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (!mounted) return;

        if (initialSession?.user) {
          console.log('Initial session found:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch user role
          const role = await fetchUserRole(initialSession.user.id);
          if (mounted) {
            setUserRole(role);
          }
        } else {
          console.log('No initial session found');
          setSession(null);
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Set up auth state listener after initialization
  useEffect(() => {
    if (!initialized) return;

    console.log('Setting up auth state listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        // Update session and user immediately
        setSession(session);
        setUser(session?.user ?? null);

        // Handle role fetching
        if (session?.user) {
          // Check for pending role
          const pendingRole = localStorage.getItem('pendingUserRole');
          
          if (pendingRole && pendingRole !== 'user') {
            console.log('Processing pending role:', pendingRole);
            
            // Validate the pending role is a valid role type
            const validRoles = ['user', 'admin', 'moderator'] as const;
            const roleToAssign = validRoles.includes(pendingRole as any) ? pendingRole as typeof validRoles[number] : 'user';
            
            // Assign the pending role using the secure function
            try {
              const { error } = await supabase.rpc('assign_user_role_secure', {
                _user_id: session.user.id,
                _role: roleToAssign
              });
              
              if (!error) {
                localStorage.removeItem('pendingUserRole');
                setUserRole(roleToAssign);
              } else {
                console.error('Error assigning pending role:', error);
                const role = await fetchUserRole(session.user.id);
                setUserRole(role);
              }
            } catch (error) {
              console.error('Error processing pending role:', error);
              const role = await fetchUserRole(session.user.id);
              setUserRole(role);
            }
          } else {
            // Fetch existing role
            const role = await fetchUserRole(session.user.id);
            setUserRole(role);
          }
        } else {
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signUp = async (email: string, password: string, name?: string, requestedRole?: string) => {
    try {
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.errors.join(', ') } };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      if (requestedRole && requestedRole !== 'user') {
        console.log('Storing pending role:', requestedRole);
        localStorage.setItem('pendingUserRole', requestedRole);
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || ''
          }
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const clientIP = 'client';
      if (!loginRateLimiter(clientIP)) {
        return { error: { message: 'Too many login attempts. Please try again later.' } };
      }

      if (!email || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      console.log('Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process');
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signOut,
    refreshUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
