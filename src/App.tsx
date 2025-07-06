
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Opportunities from "./pages/Opportunities";
import Scholarships from "./pages/Scholarships";
import Submit from "./pages/Submit";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import OpportunityDetail from "./pages/OpportunityDetail";
import Blog from "./pages/Blog";
import ResumeBuilder from "./pages/ResumeBuilder";
import UserDashboard from "./pages/UserDashboard";
import Notifications from "./pages/Notifications";
import Applications from "./pages/Applications";
import AdvertiserDashboard from "./pages/AdvertiserDashboard";
import AdvertiserCreateAd from "./pages/AdvertiserCreateAd";
import AdvertiserAds from "./pages/AdvertiserAds";

// Moderator Pages
import ModeratorDashboard from "./pages/ModeratorDashboard";
import ModeratorPending from "./pages/ModeratorPending";
import ModeratorApproved from "./pages/ModeratorApproved";
import ModeratorUsers from "./pages/ModeratorUsers";

// Lazy loaded components for better performance
import { 
  LazyAdminDashboard,
  LazyAdminAnalytics,
  LazyAdminSettings
} from "./components/LazyComponents";

// Admin Pages
import UserManagement from "./pages/UserManagement";
import AdminExpired from "./pages/AdminExpired";
import AdminNotifications from "./pages/AdminNotifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent = () => {
  // Initialize Google Analytics - using import.meta.env instead of process.env
  useGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          
          {/* Protected Routes */}
          <Route 
            path="/opportunities" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Opportunities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scholarships" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Scholarships />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/opportunities/:id" 
            element={
              <ProtectedRoute requireAuth={false}>
                <OpportunityDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
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
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
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
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } 
          />

          {/* Advertiser Routes */}
          <Route 
            path="/advertiser/dashboard" 
            element={
              <ProtectedRoute requireAdvertiser>
                <AdvertiserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/advertiser/create-ad" 
            element={
              <ProtectedRoute requireAdvertiser>
                <AdvertiserCreateAd />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/advertiser/ads" 
            element={
              <ProtectedRoute requireAdvertiser>
                <AdvertiserAds />
              </ProtectedRoute>
            } 
          />

          {/* Moderator Routes */}
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
            path="/moderator/approved" 
            element={
              <ProtectedRoute requireModerator>
                <ModeratorApproved />
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

          {/* Admin Routes - Lazy Loaded */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner text="Loading Admin Dashboard..." />}>
                  <LazyAdminDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner text="Loading Admin Dashboard..." />}>
                  <LazyAdminDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
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
          <Route 
            path="/admin/notifications" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminNotifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/analytics" 
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner text="Loading Analytics..." />}>
                  <LazyAdminAnalytics />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner text="Loading Settings..." />}>
                  <LazyAdminSettings />
                </Suspense>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
