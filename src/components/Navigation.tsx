
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPresence } from '@/hooks/useUserPresence';
import NotificationBell from '@/components/NotificationBell';
import NavItem from '@/components/navigation/NavItem';
import MobileMenu from '@/components/navigation/MobileMenu';
import { 
  Home, 
  Search, 
  FileText, 
  User, 
  Settings, 
  LogOut,
  Menu,
  Users,
  MessageCircle,
  Briefcase,
  BookOpen,
  Zap
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut, userRole } = useAuth();
  const { onlineUsers } = useUserPresence();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/advanced-search', label: 'Advanced Search', icon: Search },
    { href: '/scholarships', label: 'Scholarships', icon: BookOpen },
    { href: '/resume-builder-pro', label: 'Resume Builder Pro', icon: FileText },
  ];

  const userNavigationItems = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/bookmarks', label: 'Bookmarks', icon: BookOpen },
    { href: '/applications', label: 'Applications', icon: FileText },
  ] : [];

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OpportunityHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <NavItem key={item.href} href={item.href} icon={item.icon}>
                  {item.label}
                </NavItem>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Online Users Indicator */}
              {onlineUsers.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-700">
                    {onlineUsers.length} online
                  </span>
                </div>
              )}

              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Navigation Items */}
                  <div className="hidden lg:flex items-center space-x-1">
                    {userNavigationItems.map((item) => (
                      <NavItem key={item.href} href={item.href} icon={item.icon}>
                        {item.label}
                      </NavItem>
                    ))}
                  </div>

                  {/* Admin/Moderator Links */}
                  {(userRole === 'admin' || userRole === 'moderator') && (
                    <div className="hidden lg:flex items-center space-x-1">
                      <NavItem 
                        href={userRole === 'admin' ? '/admin/dashboard' : '/moderator/dashboard'} 
                        icon={Settings}
                      >
                        {userRole === 'admin' ? 'Admin' : 'Moderator'}
                      </NavItem>
                    </div>
                  )}

                  {/* Notifications */}
                  <NotificationBell />

                  {/* User Menu */}
                  <div className="relative group">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigationItems={navigationItems}
        userNavigationItems={userNavigationItems}
        user={user}
        userRole={userRole}
        onSignOut={handleSignOut}
      />
    </>
  );
};

export default Navigation;
