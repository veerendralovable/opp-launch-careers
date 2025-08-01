
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AdminRegistrationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const SecureAdminRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accessCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!formData.accessCode) {
      setError('Admin access code is required');
      setLoading(false);
      return;
    }

    try {
      // First validate the access code with our secure function
      const { data: validationResult, error: validationError } = await supabase.rpc(
        'register_admin_with_code',
        {
          _email: formData.email,
          _password: formData.password,
          _name: formData.name,
          _access_code: formData.accessCode
        }
      );

      if (validationError) throw validationError;
      
      // Type cast the response safely: first to unknown, then to our expected interface
      const response = validationResult as unknown as AdminRegistrationResponse;
      
      if (!response.success) {
        setError(response.error || 'Invalid access code');
        setLoading(false);
        return;
      }

      // If access code is valid, proceed with user registration
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        'admin' // This will be properly assigned by our secure function
      );

      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Log security event
        await supabase.rpc('log_security_event', {
          _event_type: 'admin_registration_attempt',
          _details: { email: formData.email, name: formData.name },
          _severity: 'info'
        });
      }
    } catch (err: any) {
      console.error('Admin registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
        <p className="text-sm text-gray-600">
          Secure admin account creation with access code validation
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter a strong password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="accessCode">Admin Access Code</Label>
            <Input
              id="accessCode"
              type="password"
              value={formData.accessCode}
              onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
              placeholder="Enter admin access code"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Contact system administrator for the access code
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Admin Account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecureAdminRegistration;
