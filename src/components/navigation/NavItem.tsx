
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, icon: Icon, className }) => {
  const location = useLocation();
  const isActive = location.pathname === href || 
                  (href !== '/' && location.pathname.startsWith(href));

  return (
    <Link
      to={href}
      className={cn(
        "inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-all duration-300 hover:scale-105",
        isActive
          ? 'border-blue-500 text-gray-900 bg-blue-50/50'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50',
        className
      )}
    >
      <Icon className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
      {children}
    </Link>
  );
};

export default NavItem;
