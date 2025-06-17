
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('pendingUserRole');
  };

  const assignUserRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    try {
      console.log('Assigning role:', role, 'to user:', userId);
      
      // First, delete any existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });
      
      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }
      
      console.log(`Successfully assigned ${role} role to user ${userId}`);
    } catch (error: any) {
      console.error('Error in assignUserRole:', error);
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Check if user is admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
        _user_id: userId
      });
      
      if (adminError) throw adminError;
      
      if (isAdminData) {
        console.log('User is admin');
        setUserRole('admin');
        return 'admin';
      }

      // Check if user is moderator
      const { data: isModeratorData, error: moderatorError } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'moderator'
      });
      
      if (moderatorError) throw moderatorError;
      
      if (isModeratorData) {
        console.log('User is moderator');
        setUserRole('moderator');
        return 'moderator';
      }

      console.log('User is regular user');
      setUserRole('user');
      return 'user';
    } catch (error: any) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
      return 'user';
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const role = await fetchUserRole(session.user.id);
              console.log('Fetched user role:', role);
              
              const pendingRole = localStorage.getItem('pendingUserRole');
              if (pendingRole && pendingRole !== 'user') {
                console.log('Assigning pending role:', pendingRole);
                await assignUserRole(session.user.id, pendingRole as 'user' | 'admin' | 'moderator');
                localStorage.removeItem('pendingUserRole');
                // Fetch the role again after assignment
                await fetchUserRole(session.user.id);
              }
            } catch (error) {
              console.error('Error in auth state change handler:', error);
            }
          }, 100);
        } else {
          setUserRole(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('Initial session:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id).finally(() => {
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

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
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
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('Sign in successful for user:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      setUserRole(null);
      
      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      return { error };
    } catch (error) {
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
