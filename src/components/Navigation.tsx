
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './NotificationBell';
import MobileMenu from './navigation/MobileMenu';
import NavItem from './navigation/NavItem';
import { 
  Menu, 
  User, 
  LogOut, 
  BookmarkIcon, 
  FileText,
  GraduationCap,
  Upload,
  Shield,
  Crown,
  BarChart3,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Opportunities', href: '/opportunities', icon: FileText },
    { name: 'Scholarships', href: '/scholarships', icon: GraduationCap },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Resume Builder', href: '/resume-builder', icon: FileText },
  ];

  const userNavItems = user ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Submit', href: '/submit', icon: Upload },
    { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
  ] : [];

  const roleBasedItems = [
    ...(userRole === 'advertiser' ? [{ name: 'Advertiser', href: '/advertiser/dashboard', icon: TrendingUp }] : []),
    ...(userRole === 'moderator' || userRole === 'admin' ? [{ name: 'Moderator', href: '/moderator/dashboard', icon: Crown }] : []),
    ...(userRole === 'admin' ? [{ name: 'Admin', href: '/admin/dashboard', icon: Shield }] : []),
  ];

  const allNavItems = [...navItems, ...userNavItems, ...roleBasedItems];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <Sparkles className="h-6 w-6 text-blue-600 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OpportunityHub
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-2">
              {allNavItems.map((item) => (
                <NavItem key={item.name} href={item.href} icon={item.icon}>
                  {item.name}
                </NavItem>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:scale-105 transition-transform">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline-block">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{userRole} Account</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center hover:bg-blue-50 transition-colors">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookmarks" className="flex items-center hover:bg-blue-50 transition-colors">
                        <BookmarkIcon className="h-4 w-4 mr-2" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    {(userRole === 'moderator' || userRole === 'admin') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/moderator/dashboard" className="flex items-center hover:bg-blue-50 transition-colors">
                            <Crown className="h-4 w-4 mr-2" />
                            Moderator Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {userRole === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="flex items-center hover:bg-blue-50 transition-colors">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button className="hover:scale-105 transition-transform">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="hover:scale-105 transition-transform"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={allNavItems}
      />
    </nav>
  );
};

export default Navigation;
