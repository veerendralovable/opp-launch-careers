
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
  requireAdvertiser?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  requireModerator = false,
  requireAdvertiser = false
}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this area. Admin privileges are required.
            </p>
            <p className="text-sm text-muted-foreground">
              Current role: {userRole || 'None'} • Required: Admin
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireModerator && !['moderator', 'admin'].includes(userRole || '')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this area. Moderator or Admin privileges are required.
            </p>
            <p className="text-sm text-muted-foreground">
              Current role: {userRole || 'None'} • Required: Moderator or Admin
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireAdvertiser && userRole !== 'advertiser') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this area. Advertiser privileges are required.
            </p>
            <p className="text-sm text-muted-foreground">
              Current role: {userRole || 'None'} • Required: Advertiser
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
