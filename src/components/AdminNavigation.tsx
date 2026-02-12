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
  Home,
  Upload,
  BookOpen,
  List
} from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/opportunities', label: 'Pending', icon: FileText },
    { href: '/admin/all-opportunities', label: 'All Opportunities', icon: List },
    { href: '/admin/bulk-import', label: 'Bulk Import', icon: Upload },
    { href: '/admin/blog', label: 'Blog', icon: BookOpen },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/email', label: 'Email', icon: Mail },
    { href: '/admin/expired', label: 'Expired', icon: Archive },
    { href: '/admin/monetization', label: 'Monetization', icon: DollarSign },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                location.pathname === item.href
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
