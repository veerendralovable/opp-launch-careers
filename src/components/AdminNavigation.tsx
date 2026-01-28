
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  FileText, 
  DollarSign,
  Mail,
  Archive,
  Home
} from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/opportunities', label: 'Opportunities', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/email', label: 'Email Campaigns', icon: Mail },
    { href: '/admin/expired', label: 'Expired', icon: Archive },
    { href: '/admin/monetization', label: 'Monetization', icon: DollarSign },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap',
                location.pathname === item.href
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
