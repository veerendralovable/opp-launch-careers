
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createRateLimiter, validatePasswordStrength, validateInput } from '@/config/security';
import { sanitizeText, sanitizeEmail } from '@/utils/sanitization';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Use the secure database function to get role
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: userId
      });

      if (error) {
        console.error('Error fetching user role via RPC:', error);
        // Fallback to direct query
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setUserRole('user');
          return;
        }
        
        const role = roleData?.role || 'user';
        console.log('User role fetched (fallback):', role);
        setUserRole(role);
        return;
      }

      const role = data || 'user';
      console.log('User role fetched:', role);
      setUserRole(role);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
    }
  };

  const assignUserRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    try {
      console.log('Assigning role:', role, 'to user:', userId);
      
      const { error } = await supabase.rpc('assign_role_secure', {
        _target_user_id: userId,
        _role: role
      });

      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }

      console.log('Role assigned successfully:', role);
      return true;
    } catch (error) {
      console.error('Failed to assign role:', error);
      return false;
    }
  };

  // Enhanced auth state cleanup
  const cleanupAuthState = () => {
    console.log('Cleaning up auth state');
    
    try {
      localStorage.removeItem('supabase.auth.token');
      
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      if (typeof sessionStorage !== 'undefined') {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Error during auth cleanup:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user && mounted) {
          setUser(session.user);
          setTimeout(() => {
            if (mounted) fetchUserRole(session.user.id);
          }, 100);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        setTimeout(() => {
          if (mounted) fetchUserRole(session.user.id);
        }, 100);
      } else {
        setUser(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string = 'user') => {
    try {
      setLoading(true);
      console.log('Starting signup process for role:', role);

      // Enhanced validation
      if (!validateInput.email(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validateInput.noScripts(name)) {
        throw new Error('Name contains invalid characters');
      }

      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email: sanitizeEmail(email),
        password,
        options: {
          data: {
            name: sanitizeText(name),
            role: role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('User created:', data.user.id, 'with requested role:', role);
        
        // The handle_new_user trigger will automatically:
        // 1. Create a profile entry
        // 2. Assign the 'user' role
        // So we don't need to manually assign roles here for regular users
        
        if (role === 'admin') {
          console.log('Admin role assignment must be handled via database directly');
        }

        // Don't try to log security event here as user may not be fully authenticated yet
        // The trigger function will handle profile creation

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before signing in.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = error.message;
      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message?.includes('Password')) {
        errorMessage = error.message;
      }
      
      return { error: { ...error, message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Enhanced validation
      if (!validateInput.email(email)) {
        throw new Error('Please enter a valid email address');
      }

      const sanitizedEmail = sanitizeEmail(email);
      
      // Check rate limiting
      const rateLimitResult = loginRateLimiter(sanitizedEmail);
      if (!rateLimitResult.allowed) {
        throw new Error('Too many login attempts. Please try again later.');
      }
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed, continuing with signin');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) throw error;

      // Log successful login
      if (data.user) {
        await supabase.rpc('log_security_event', {
          _event_type: 'user_login',
          _details: { 
            email: sanitizedEmail, 
            login_time: new Date().toISOString(),
            remaining_attempts: rateLimitResult.remainingAttempts
          },
          _severity: 'info'
        });
      }

      return { error: null };
    } catch (error: any) {
      // Log failed login attempt
      await supabase.rpc('log_security_event', {
        _event_type: 'login_failed',
        _details: { 
          email: sanitizeEmail(email), 
          error: error.message,
          timestamp: new Date().toISOString()
        },
        _severity: 'warning'
      });
      
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Log security event before logout
      await supabase.rpc('log_security_event', {
        _event_type: 'user_logout',
        _details: { logout_time: new Date().toISOString() },
        _severity: 'info'
      });
      
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      setUser(null);
      setUserRole(null);
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
      
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
