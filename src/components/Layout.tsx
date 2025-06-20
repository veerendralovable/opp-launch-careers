
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  // Don't show any extra navigation for auth page - this is handled at route level
  if (location.pathname === '/auth') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
