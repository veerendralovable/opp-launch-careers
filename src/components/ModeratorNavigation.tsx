
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  Settings,
  BarChart3,
  Shield,
  Bell
} from 'lucide-react';

const ModeratorNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/moderator/dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      path: '/moderator/pending',
      label: 'Pending Review',
      icon: Clock
    },
    {
      path: '/moderator/approved',
      label: 'Approved Content',
      icon: CheckCircle
    },
    {
      path: '/moderator/users',
      label: 'User Management',
      icon: Users
    },
    {
      path: '/moderator/notifications',
      label: 'Notifications',
      icon: Bell
    }
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 py-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModeratorNavigation;
