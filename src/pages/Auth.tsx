
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, User, Crown } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateAccessCode = (code: string) => {
    return code === 'rani';
  };

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
      throw error;
    }
  };

  const requiresAccessCode = (role: string) => {
    return role === 'admin' || role === 'moderator';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate access code if admin or moderator role is selected
        if (requiresAccessCode(selectedRole) && !validateAccessCode(accessCode)) {
          throw new Error('Invalid access code. Access denied.');
        }

        console.log('Starting signup process...');
        const { error: signUpError } = await signUp(email, password, name);
        if (signUpError) throw signUpError;

        // For signup, we don't immediately assign roles because the user needs to confirm their email first
        // The role assignment will happen after email confirmation
        // For now, we'll store the intended role in localStorage to assign it later
        if (selectedRole !== 'user') {
          localStorage.setItem('pendingUserRole', selectedRole);
        }

        const roleMessages = {
          user: "Please check your email to verify your account.",
          admin: "Admin account created successfully. Please check your email to verify your account.",
          moderator: "Moderator account created successfully. Please check your email to verify your account."
        };
        
        toast({
          title: "Account created!",
          description: roleMessages[selectedRole as keyof typeof roleMessages],
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'moderator':
        return <Crown className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access and management capabilities';
      case 'moderator':
        return 'Content moderation and user management';
      default:
        return 'Standard user access to opportunities and features';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h2 className="text-3xl font-bold text-gray-900">OpportunityHub</h2>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Create an account to start saving opportunities and tailoring resumes'
                : 'Welcome back! Sign in to access your saved opportunities'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            {getRoleIcon('user')}
                            <div>
                              <div className="font-medium">User</div>
                              <div className="text-xs text-gray-500">Standard access</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="moderator">
                          <div className="flex items-center gap-2">
                            {getRoleIcon('moderator')}
                            <div>
                              <div className="font-medium">Moderator</div>
                              <div className="text-xs text-gray-500">Content moderation</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            {getRoleIcon('admin')}
                            <div>
                              <div className="font-medium">Admin</div>
                              <div className="text-xs text-gray-500">Full system access</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRoleDescription(selectedRole)}
                    </p>
                  </div>

                  {requiresAccessCode(selectedRole) && (
                    <div>
                      <Label htmlFor="accessCode">
                        {selectedRole === 'admin' ? 'Admin' : 'Moderator'} Access Code
                      </Label>
                      <Input
                        id="accessCode"
                        type="password"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        required
                        placeholder={`Enter ${selectedRole} access code`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Special code required for {selectedRole} account creation
                      </p>
                    </div>
                  )}
                </>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
