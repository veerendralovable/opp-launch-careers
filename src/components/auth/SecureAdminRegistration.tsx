
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { validatePasswordStrength, validateInput } from '@/config/security';
import { sanitizeText } from '@/utils/sanitization';

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
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { signUp } = useAuth();

  const validateForm = () => {
    const errors: string[] = [];
    
    // Validate name
    if (!formData.name.trim()) {
      errors.push('Name is required');
    } else if (!validateInput.noScripts(formData.name)) {
      errors.push('Name contains invalid characters');
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!validateInput.email(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Validate password
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    // Validate access code
    if (!formData.accessCode.trim()) {
      errors.push('Admin access code is required');
    }
    
    return errors;
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    const validation = validatePasswordStrength(password);
    setPasswordErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setLoading(true);

    try {
      // Validate access code using secure edge function
      const { data: validationData, error: validationError } = await supabase.functions.invoke(
        'validate-admin-code',
        {
          body: {
            accessCode: formData.accessCode,
            role: 'admin'
          }
        }
      );

      if (validationError) throw validationError;
      
      if (!validationData?.success) {
        setError(validationData?.error || 'Invalid access code');
        await supabase.rpc('log_security_event', {
          _event_type: 'admin_registration_failed',
          _details: { 
            email: sanitizeText(formData.email), 
            reason: 'invalid_access_code',
            timestamp: new Date().toISOString()
          },
          _severity: 'warning'
        });
        return;
      }

      // Proceed with user registration
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        sanitizeText(formData.name),
        'admin'
      );

      if (signUpError) {
        setError(signUpError.message);
        await supabase.rpc('log_security_event', {
          _event_type: 'admin_registration_failed',
          _details: { 
            email: sanitizeText(formData.email), 
            reason: 'signup_error',
            error: signUpError.message,
            timestamp: new Date().toISOString()
          },
          _severity: 'error'
        });
      } else {
        // Log successful admin registration
        await supabase.rpc('log_security_event', {
          _event_type: 'admin_registration_success',
          _details: { 
            email: sanitizeText(formData.email),
            timestamp: new Date().toISOString()
          },
          _severity: 'info'
        });
      }
    } catch (err: any) {
      console.error('Admin registration error:', err);
      setError('Registration failed. Please try again.');
      await supabase.rpc('log_security_event', {
        _event_type: 'admin_registration_error',
        _details: { 
          email: sanitizeText(formData.email),
          error: err.message,
          timestamp: new Date().toISOString()
        },
        _severity: 'error'
      });
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
          Secure admin account creation with enhanced validation
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
              maxLength={100}
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
              maxLength={255}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter a strong password"
                required
                disabled={loading}
                maxLength={128}
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
            {passwordErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                {passwordErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            )}
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
              maxLength={128}
            />
          </div>

          <div>
            <Label htmlFor="accessCode">Admin Access Code</Label>
            <Input
              id="accessCode"
              type="password"
              value={formData.accessCode}
              onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
              placeholder="Enter secure admin access code"
              required
              disabled={loading}
              maxLength={64}
            />
            <p className="text-xs text-gray-500 mt-1">
              Contact system administrator for the secure access code
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || passwordErrors.length > 0}>
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
