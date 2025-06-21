
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validatePasswordStrength, createRateLimiter } from '@/config/security';
import { useToast } from '@/hooks/use-toast';

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
  const [isInitialized, setIsInitialized] = useState(false);

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

  const assignUserRoleSecure = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    try {
      console.log('Assigning role:', role, 'to user:', userId);
      
      const { data, error } = await supabase.rpc('assign_user_role_secure', {
        _user_id: userId,
        _role: role
      });
      
      if (error) {
        console.error('Error in role assignment:', error);
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
          console.log('No role found, assigning default user role');
          const success = await assignUserRoleSecure(userId, 'user');
          if (success) {
            setUserRole('user');
            return 'user';
          }
        }
        setUserRole('user');
        return 'user';
      }

      const role = roleData?.role || 'user';
      console.log('User role fetched:', role);
      setUserRole(role);
      return role;
    } catch (error: any) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
      return 'user';
    }
  };

  const refreshUserRole = async () => {
    if (user) {
      await fetchUserRole(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authProcessing = false;

    const initializeAuth = async () => {
      if (authProcessing || isInitialized) return;
      authProcessing = true;

      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchUserRole(initialSession.user.id);
        } else {
          setSession(null);
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
          authProcessing = false;
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        if (!mounted || authProcessing) return;
        authProcessing = true;

        try {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            // Handle pending role assignment
            const pendingRole = localStorage.getItem('pendingUserRole');
            
            if (pendingRole && pendingRole !== 'user') {
              console.log('Processing pending role:', pendingRole);
              
              const success = await assignUserRoleSecure(
                session.user.id, 
                pendingRole as 'user' | 'admin' | 'moderator'
              );
              
              if (success) {
                localStorage.removeItem('pendingUserRole');
                setUserRole(pendingRole);
              } else {
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
        } finally {
          authProcessing = false;
          if (mounted && !loading) {
            setLoading(false);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
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
      cleanupAuthState();
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      setUserRole(null);
      
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
