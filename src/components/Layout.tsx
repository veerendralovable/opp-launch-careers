
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { loading } = useAuth();

  // Don't show navigation for auth page or home page (home has its own navigation)
  const hideNavigation = location.pathname === '/auth' || location.pathname === '/';

  // Show loading spinner while auth is initializing
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

  return (
    <div className="min-h-screen bg-background">
      {!hideNavigation && <Navigation />}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
