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
import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import Scholarships from "./pages/Scholarships";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import Applications from "./pages/Applications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import PendingOpportunities from "./pages/PendingOpportunities";
import ApprovedOpportunities from "./pages/ApprovedOpportunities";
import UsersPage from "./pages/UsersPage";

// Lazy loading components
const OpportunitiesPage = lazy(() => import("@/pages/Opportunities"));
const ScholarshipPage = lazy(() => import("@/pages/Scholarships"));
const AuthenticationPage = lazy(() => import("@/pages/Authentication"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const BookmarksPage = lazy(() => import("@/pages/Bookmarks"));
const ApplicationsPage = lazy(() => import("@/pages/Applications"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboard"));
const AdminAnalyticsPage = lazy(() => import("@/pages/AdminAnalytics"));
const ModeratorDashboardPage = lazy(() => import("@/pages/ModeratorDashboard"));
const PendingOpportunitiesPage = lazy(() => import("@/pages/PendingOpportunities"));
const ApprovedOpportunitiesPage = lazy(() => import("@/pages/ApprovedOpportunities"));
const Users = lazy(() => import("@/pages/UsersPage"));

// New enhanced components
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
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/scholarships" element={<Scholarships />} />
                  <Route path="/auth" element={<Authentication />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
                  <Route path="/moderator/pending" element={<PendingOpportunities />} />
                  <Route path="/moderator/approved" element={<ApprovedOpportunities />} />
                  <Route path="/moderator/users" element={<UsersPage />} />
                  
                  {/* Enhanced Routes */}
                  <Route path="/resume-builder-pro" element={<EnhancedResumeBuilder />} />
                  <Route path="/advanced-search" element={<AdvancedSearch />} />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Global Components */}
                <ChatWidget roomId="global" title="Community Chat" />
                <ProductionDataLoader />
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
