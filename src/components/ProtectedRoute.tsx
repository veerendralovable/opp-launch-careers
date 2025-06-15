
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useModeratorAccess } from '@/hooks/useModeratorAccess';
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
  const { user, loading: authLoading, userRole } = useAuth();
  const { hasModeratorAccess, loading: moderatorLoading } = useModeratorAccess();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || ((requireAdmin || requireModerator) && moderatorLoading)) {
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
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && userRole !== 'admin') {
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
              If you believe this is an error, please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check moderator requirement (moderators and admins can access moderator areas)
  if (requireModerator && !hasModeratorAccess) {
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
              If you believe this is an error, please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
