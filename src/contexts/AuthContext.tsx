
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
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cleanupAuthState = () => {
    try {
      // Clean up all auth-related localStorage items
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

  const assignUserRoleSecure = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    try {
      console.log('Using secure role assignment for:', role, 'to user:', userId);
      
      const { data, error } = await supabase.rpc('assign_user_role_secure', {
        _user_id: userId,
        _role: role
      });
      
      if (error) {
        console.error('Error in secure role assignment:', error);
        return false;
      }
      
      console.log(`Successfully assigned ${role} role to user ${userId}`);
      return true;
    } catch (error: any) {
      console.error('Error in assignUserRoleSecure:', error);
      return false;
    }
  };

  const fetchUserRole = async (userId: string) => {
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
          console.log('No role found for user, setting to user role');
          setUserRole('user');
          return 'user';
        }
        setUserRole('user');
        return 'user';
      }

      const role = roleData?.role || 'user';
      console.log('User role fetched successfully:', role);
      setUserRole(role);
      return role;
    } catch (error: any) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
      return 'user';
    }
  };

  useEffect(() => {
    let mounted = true;
    let processingAuth = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted || processingAuth) {
          console.log('Skipping auth state change - not mounted or already processing');
          return;
        }

        processingAuth = true;

        try {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            const pendingRole = localStorage.getItem('pendingUserRole');
            
            if (pendingRole && pendingRole !== 'user') {
              console.log('Processing pending role assignment:', pendingRole);
              
              const success = await assignUserRoleSecure(session.user.id, pendingRole as 'user' | 'admin' | 'moderator');
              
              if (success) {
                localStorage.removeItem('pendingUserRole');
                setUserRole(pendingRole);
                console.log('Pending role assignment successful:', pendingRole);
              } else {
                console.error('Failed to assign pending role, fetching existing role');
                await fetchUserRole(session.user.id);
              }
            } else {
              await fetchUserRole(session.user.id);
            }
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          setUserRole('user');
        } finally {
          processingAuth = false;
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && !processingAuth) {
        console.log('Initial session:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          processingAuth = true;
          fetchUserRole(session.user.id).finally(() => {
            processingAuth = false;
            if (mounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string, requestedRole?: string) => {
    try {
      // Validate input
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.errors.join(', ') } };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      if (requestedRole && requestedRole !== 'user') {
        console.log('Storing pending role for post-verification assignment:', requestedRole);
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
      // Rate limiting check
      const clientIP = 'client'; // In production, you'd get the real IP
      if (!loginRateLimiter(clientIP)) {
        return { error: { message: 'Too many login attempts. Please try again later.' } };
      }

      // Validate input
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful for user:', data.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      setUserRole(null);
      
      // Use replace instead of href to prevent navigation issues
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
