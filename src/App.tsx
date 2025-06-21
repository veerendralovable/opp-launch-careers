
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminNavigation from "./components/AdminNavigation";
import ModeratorNavigation from "./components/ModeratorNavigation";
import ProductionDataLoader from "./components/ProductionDataLoader";
import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Submit from "./pages/Submit";
import Tailor from "./pages/Tailor";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminNotifications from "./pages/AdminNotifications";
import AdminExpired from "./pages/AdminExpired";
import AdminMonetization from "./pages/AdminMonetization";
import AdminEmailCampaigns from "./pages/AdminEmailCampaigns";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import UserManagement from "./pages/UserManagement";
import Bookmarks from "./pages/Bookmarks";
import Scholarships from "./pages/Scholarships";
import Auth from "./pages/Auth";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-background">
    <AdminNavigation />
    <main>
      {children}
    </main>
  </div>
);

const ModeratorLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-background">
    <ModeratorNavigation />
    <main>
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductionDataLoader />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="opportunities/:id" element={<OpportunityDetail />} />
              <Route path="help" element={<HelpCenter />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="careers" element={<Careers />} />
              <Route path="scholarships" element={<Scholarships />} />
            </Route>

            {/* Auth route without Layout */}
            <Route path="/auth" element={<Layout />}>
              <Route index element={<Auth />} />
            </Route>
            
            {/* Protected routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route 
                path="submit" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Submit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="tailor" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Tailor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="bookmarks" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Bookmarks />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Moderator Routes with custom layout */}
            <Route 
              path="/moderator" 
              element={
                <ProtectedRoute requireAuth={true} requireModerator={true}>
                  <ModeratorLayoutWrapper>
                    <ModeratorDashboard />
                  </ModeratorLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/moderator/opportunities" 
              element={
                <ProtectedRoute requireAuth={true} requireModerator={true}>
                  <ModeratorLayoutWrapper>
                    <Admin />
                  </ModeratorLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/moderator/approved" 
              element={
                <ProtectedRoute requireAuth={true} requireModerator={true}>
                  <ModeratorLayoutWrapper>
                    <Opportunities />
                  </ModeratorLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/moderator/users" 
              element={
                <ProtectedRoute requireAuth={true} requireModerator={true}>
                  <ModeratorLayoutWrapper>
                    <UserManagement />
                  </ModeratorLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/moderator/notifications" 
              element={
                <ProtectedRoute requireAuth={true} requireModerator={true}>
                  <ModeratorLayoutWrapper>
                    <AdminNotifications />
                  </ModeratorLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes with custom layout */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminDashboard />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/opportunities" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <Admin />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <UserManagement />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminAnalytics />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/notifications" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminNotifications />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/email-campaigns" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminEmailCampaigns />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/expired" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminExpired />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/monetization" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminMonetization />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayoutWrapper>
                    <AdminSettings />
                  </AdminLayoutWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
