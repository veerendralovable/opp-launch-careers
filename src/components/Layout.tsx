
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminNavigation from '@/components/AdminNavigation';
import ModeratorNavigation from '@/components/ModeratorNavigation';

const Layout = () => {
  const { userRole } = useAuth();
  const location = useLocation();

  // Don't show navigation on auth page
  if (location.pathname === '/auth') {
    return <Outlet />;
  }

  // Show admin navigation only for admin users on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isModeratorRoute = location.pathname.startsWith('/moderator');
  
  const showAdminNav = userRole === 'admin' && isAdminRoute;
  const showModeratorNav = (userRole === 'moderator' || userRole === 'admin') && isModeratorRoute;

  return (
    <div className="min-h-screen bg-background">
      {showAdminNav && <AdminNavigation />}
      {showModeratorNav && !showAdminNav && <ModeratorNavigation />}
      <main className={showAdminNav || showModeratorNav ? '' : 'pt-0'}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
