
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false,
  requireModerator = false
}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user?.email, 'userRole:', userRole, 'loading:', loading);
  console.log('ProtectedRoute - requireAuth:', requireAuth, 'requireAdmin:', requireAdmin, 'requireModerator:', requireModerator);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    console.log('Redirecting to auth - no user');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && userRole !== 'admin') {
    console.log('Access denied - admin required, user role:', userRole);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this area. Admin privileges are required.
            </p>
            <p className="text-sm text-gray-500">
              Current role: {userRole || 'None'} • Required: Admin
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check moderator requirement
  if (requireModerator && !['moderator', 'admin'].includes(userRole || '')) {
    console.log('Access denied - moderator required, user role:', userRole);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this area. Moderator or Admin privileges are required.
            </p>
            <p className="text-sm text-gray-500">
              Current role: {userRole || 'None'} • Required: Moderator or Admin
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('Access granted - rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
