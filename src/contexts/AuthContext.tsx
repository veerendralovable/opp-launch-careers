
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

  const assignUserRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    try {
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
      // Don't throw here to avoid blocking the auth flow
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      // Check if user is admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
        _user_id: userId
      });
      
      if (adminError) throw adminError;
      
      if (isAdminData) {
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
        setUserRole('moderator');
        return 'moderator';
      }

      // Default to user role
      setUserRole('user');
      return 'user';
    } catch (error: any) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
      return 'user';
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user role
          await fetchUserRole(session.user.id);
          
          // Handle role assignment after email confirmation
          const pendingRole = localStorage.getItem('pendingUserRole');
          if (pendingRole && pendingRole !== 'user') {
            console.log('Assigning pending role:', pendingRole);
            await assignUserRole(session.user.id, pendingRole as 'user' | 'admin' | 'moderator');
            localStorage.removeItem('pendingUserRole');
            // Refresh role after assignment
            await fetchUserRole(session.user.id);
          }
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
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
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUserRole(null);
    return { error };
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
