
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Opportunities = lazy(() => import('@/pages/Opportunities'));
const OpportunityDetail = lazy(() => import('@/pages/OpportunityDetail'));
const Scholarships = lazy(() => import('@/pages/Scholarships'));
const Applications = lazy(() => import('@/pages/Applications'));
const Bookmarks = lazy(() => import('@/pages/Bookmarks'));
const Profile = lazy(() => import('@/pages/Profile'));
const Submit = lazy(() => import('@/pages/Submit'));
const Notifications = lazy(() => import('@/pages/Notifications'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const AdminNotifications = lazy(() => import('@/pages/AdminNotifications'));
const AdminBulkEmail = lazy(() => import('@/pages/AdminBulkEmail'));
const AdminExpired = lazy(() => import('@/pages/AdminExpired'));
const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'));
const AdminSettings = lazy(() => import('@/pages/AdminSettings'));

// Moderator pages
const ModeratorDashboard = lazy(() => import('@/pages/ModeratorDashboard'));
const ModeratorPending = lazy(() => import('@/pages/ModeratorPending'));
const ModeratorApprovedContent = lazy(() => import('@/pages/ModeratorApprovedContent'));
const ModeratorUsers = lazy(() => import('@/pages/ModeratorUsers'));
const ModeratorNotifications = lazy(() => import('@/pages/ModeratorNotifications'));

const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                <UnifiedNavigation />
                
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                    <Route path="/scholarships" element={<Scholarships />} />

                    {/* Protected user routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute requireAuth={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/applications" element={
                      <ProtectedRoute requireAuth={true}>
                        <Applications />
                      </ProtectedRoute>
                    } />
                    <Route path="/bookmarks" element={
                      <ProtectedRoute requireAuth={true}>
                        <Bookmarks />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute requireAuth={true}>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/submit" element={
                      <ProtectedRoute requireAuth={true}>
                        <Submit />
                      </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedRoute requireAuth={true}>
                        <Notifications />
                      </ProtectedRoute>
                    } />

                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/opportunities" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <ModeratorPending />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/notifications" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <AdminNotifications />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/email-campaigns" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <AdminBulkEmail />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/expired" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <AdminExpired />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <AdminAnalytics />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedRoute requireAuth={true} requireAdmin={true}>
                        <AdminSettings />
                      </ProtectedRoute>
                    } />

                    {/* Moderator routes */}
                    <Route path="/moderator/dashboard" element={
                      <ProtectedRoute requireAuth={true} requireModerator={true}>
                        <ModeratorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/moderator/pending" element={
                      <ProtectedRoute requireAuth={true} requireModerator={true}>
                        <ModeratorPending />
                      </ProtectedRoute>
                    } />
                    <Route path="/moderator/approved" element={
                      <ProtectedRoute requireAuth={true} requireModerator={true}>
                        <ModeratorApprovedContent />
                      </ProtectedRoute>
                    } />
                    <Route path="/moderator/users" element={
                      <ProtectedRoute requireAuth={true} requireModerator={true}>
                        <ModeratorUsers />
                      </ProtectedRoute>
                    } />
                    <Route path="/moderator/notifications" element={
                      <ProtectedRoute requireAuth={true} requireModerator={true}>
                        <ModeratorNotifications />
                      </ProtectedRoute>
                    } />

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
