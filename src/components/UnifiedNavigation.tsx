
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NotificationSystem from '@/components/NotificationSystem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Briefcase, 
  GraduationCap, 
  User, 
  LogOut, 
  Menu,
  X,
  Shield,
  BarChart3,
  Users,
  Mail,
  Bell,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Settings
} from 'lucide-react';

const UnifiedNavigation = () => {
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/opportunities', label: 'Jobs', icon: Briefcase },
    { path: '/scholarships', label: 'Scholarships', icon: GraduationCap },
    { path: '/search', label: 'Search', icon: Search },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/email', label: 'Email', icon: Mail },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const moderatorNavItems = [
    { path: '/moderator', label: 'Dashboard', icon: Shield },
    { path: '/moderator/pending', label: 'Pending', icon: BookOpen },
    { path: '/moderator/users', label: 'Users', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-200">
                <span className="text-primary-foreground font-bold text-sm">OH</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent hidden sm:block">
                OpportunityHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4 inline mr-1" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <NotificationSystem />
                
                {/* Admin/Moderator Dropdown */}
                {(userRole === 'admin' || userRole === 'moderator') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="hidden md:flex">
                        <Shield className="h-4 w-4 mr-1" />
                        {userRole === 'admin' ? 'Admin' : 'Moderator'}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {userRole === 'admin' && adminNavItems.map((item) => (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link to={item.path} className="flex items-center">
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      {userRole === 'moderator' && moderatorNavItems.map((item) => (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link to={item.path} className="flex items-center">
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.email}</p>
                      {userRole && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {userRole}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookmarks" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/submit" className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Submit Opportunity
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help-center" className="flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 inline mr-2" />
                  {item.label}
                </Link>
              ))}
              
              {/* Admin/Moderator items in mobile */}
              {userRole === 'admin' && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4 inline mr-2" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
              
              {userRole === 'moderator' && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Moderator</div>
                    {moderatorNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4 inline mr-2" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UnifiedNavigation;
