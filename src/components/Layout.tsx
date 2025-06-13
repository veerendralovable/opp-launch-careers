
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileText, 
  User, 
  Menu, 
  X,
  Bookmark,
  GraduationCap,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth
  const location = useLocation();

  const navLinks = [
    { to: "/opportunities", label: "Opportunities", icon: Search },
    { to: "/tailor", label: "Tailor Resume", icon: FileText },
    { to: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { to: "/submit", label: "Submit", icon: Plus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">Opportune</span>
              <span className="text-xl">🚀</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(to)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <Link to="/bookmarks">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarks
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium",
                    isActive(to)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/bookmarks"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bookmark className="h-5 w-5" />
                      <span>Bookmarks</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around py-2">
          {navLinks.slice(0, 4).map(({ to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive(to)
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
