
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavItem[];
  userNavigationItems: NavItem[];
  user: any;
  userRole: string;
  onSignOut: () => Promise<void>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  navigationItems,
  userNavigationItems,
  user,
  userRole,
  onSignOut
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Navigation</h3>
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={onClose}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user && userNavigationItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</h3>
              {userNavigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={onClose}
                    style={{ animationDelay: `${(navigationItems.length + index) * 50}ms` }}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {user && (userRole === 'admin' || userRole === 'moderator') && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Management</h3>
              <Link
                to={userRole === 'admin' ? '/admin/dashboard' : '/moderator/dashboard'}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                onClick={onClose}
              >
                <Settings className="h-5 w-5" />
                {userRole === 'admin' ? 'Admin Panel' : 'Moderator Panel'}
              </Link>
            </div>
          )}

          {user && (
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user.email?.split('@')[0]}
              </div>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-105"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
