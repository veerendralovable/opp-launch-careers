
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Bell,
  Calendar,
  Shield,
  Mail,
  DollarSign
} from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();

  const adminRoutes = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/opportunities', label: 'Opportunities', icon: FileText },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    { path: '/admin/expired', label: 'Expired Content', icon: Calendar },
    { path: '/admin/monetization', label: 'Monetization', icon: DollarSign },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {adminRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive(route.path)
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
