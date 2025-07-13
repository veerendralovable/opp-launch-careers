
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import ChatWidget from "@/components/chat/ChatWidget";
import ProductionDataLoader from "@/components/ProductionDataLoader";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";

const Index = lazy(() => import("@/pages/Index"));
const OpportunitiesPage = lazy(() => import("@/pages/Opportunities"));
const ScholarshipPage = lazy(() => import("@/pages/Scholarships"));
const AuthenticationPage = lazy(() => import("@/pages/Auth"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const BookmarksPage = lazy(() => import("@/pages/Bookmarks"));
const ApplicationsPage = lazy(() => import("@/pages/Applications"));
const SubmitPage = lazy(() => import("@/pages/Submit"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboard"));
const AdminAnalyticsPage = lazy(() => import("@/pages/AdminAnalytics"));
const ModeratorDashboardPage = lazy(() => import("@/pages/ModeratorDashboard"));
const PendingOpportunitiesPage = lazy(() => import("@/pages/ModeratorPending"));
const ApprovedOpportunitiesPage = lazy(() => import("@/pages/ModeratorApproved"));
const UsersPage = lazy(() => import("@/pages/ModeratorUsers"));
const AdminPage = lazy(() => import("@/pages/Admin"));

const EnhancedResumeBuilder = lazy(() => import("@/components/enhanced/ResumeBuilder"));
const AdvancedSearch = lazy(() => import("@/components/enhanced/AdvancedSearch"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50">
                <ResponsiveNavigation />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/opportunities" element={<OpportunitiesPage />} />
                    <Route path="/scholarships" element={<ScholarshipPage />} />
                    <Route path="/auth" element={<AuthenticationPage />} />
                    <Route path="/submit" element={<SubmitPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                    <Route path="/moderator/dashboard" element={<ModeratorDashboardPage />} />
                    <Route path="/moderator/pending" element={<PendingOpportunitiesPage />} />
                    <Route path="/moderator/approved" element={<ApprovedOpportunitiesPage />} />
                    <Route path="/moderator/users" element={<UsersPage />} />
                    
                    <Route path="/resume-builder-pro" element={<EnhancedResumeBuilder />} />
                    <Route path="/advanced-search" element={<AdvancedSearch />} />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
                
                <ChatWidget roomId="global" title="Community Chat" />
                <ProductionDataLoader />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
