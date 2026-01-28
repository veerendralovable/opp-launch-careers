
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Opportunities = lazy(() => import('@/pages/Opportunities'));
const OpportunityDetail = lazy(() => import('@/pages/OpportunityDetail'));
const Scholarships = lazy(() => import('@/pages/Scholarships'));
const AdvancedSearch = lazy(() => import('@/pages/AdvancedSearch'));
const Bookmarks = lazy(() => import('@/pages/Bookmarks'));
const Profile = lazy(() => import('@/pages/Profile'));
const Submit = lazy(() => import('@/pages/Submit'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const HelpCenter = lazy(() => import('@/pages/HelpCenter'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminOpportunities = lazy(() => import('@/pages/Admin'));
const AdminBulkEmail = lazy(() => import('@/pages/AdminBulkEmail'));
const AdminUsers = lazy(() => import('@/pages/UserManagement'));
const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'));
const AdminNotifications = lazy(() => import('@/pages/AdminNotifications'));
const AdminSettings = lazy(() => import('@/pages/AdminSettings'));
const AdminMonetization = lazy(() => import('@/pages/AdminMonetization'));
const AdminExpired = lazy(() => import('@/pages/AdminExpired'));
const ModeratorDashboard = lazy(() => import('@/pages/ModeratorDashboard'));
const ModeratorPending = lazy(() => import('@/pages/ModeratorPending'));
const ModeratorUsers = lazy(() => import('@/pages/ModeratorUsers'));
const ModeratorApprovedContent = lazy(() => import('@/pages/ModeratorApprovedContent'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <UnifiedNavigation />
                <main className="flex-1">
                  <Suspense fallback={<LoadingSpinner fullScreen size="lg" message="Loading..." />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/opportunities" element={<Opportunities />} />
                      <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                      <Route path="/scholarships" element={<Scholarships />} />
                      <Route path="/advanced-search" element={<AdvancedSearch />} />
                      <Route path="/search" element={<AdvancedSearch />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/help-center" element={<HelpCenter />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/cookies" element={<Cookies />} />
                      
                      {/* Protected Routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/bookmarks"
                        element={
                          <ProtectedRoute>
                            <Bookmarks />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/submit"
                        element={
                          <ProtectedRoute>
                            <Submit />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/opportunities"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminOpportunities />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/bulk-email"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminBulkEmail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/email"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminBulkEmail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminUsers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminAnalytics />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/notifications"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminNotifications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/settings"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminSettings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/monetization"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminMonetization />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/expired"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminExpired />
                          </ProtectedRoute>
                        }
                      />

                      {/* Moderator Routes */}
                      <Route
                        path="/moderator"
                        element={
                          <ProtectedRoute requireModerator>
                            <ModeratorDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/dashboard"
                        element={
                          <ProtectedRoute requireModerator>
                            <ModeratorDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/pending"
                        element={
                          <ProtectedRoute requireModerator>
                            <ModeratorPending />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/users"
                        element={
                          <ProtectedRoute requireModerator>
                            <ModeratorUsers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/moderator/approved"
                        element={
                          <ProtectedRoute requireModerator>
                            <ModeratorApprovedContent />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
