
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    localStorage.removeItem('userRole');
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
