
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

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <AdminNavigation />
    {children}
  </>
);

const ModeratorLayout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <ModeratorNavigation />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductionDataLoader />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route 
                path="/submit" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Submit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tailor" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Tailor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookmarks" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Bookmarks />
                  </ProtectedRoute>
                } 
              />
              
              {/* Moderator Routes */}
              <Route 
                path="/moderator" 
                element={
                  <ProtectedRoute requireAuth={true} requireModerator={true}>
                    <ModeratorLayout>
                      <ModeratorDashboard />
                    </ModeratorLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderator/opportunities" 
                element={
                  <ProtectedRoute requireAuth={true} requireModerator={true}>
                    <ModeratorLayout>
                      <Admin />
                    </ModeratorLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderator/approved" 
                element={
                  <ProtectedRoute requireAuth={true} requireModerator={true}>
                    <ModeratorLayout>
                      <Opportunities />
                    </ModeratorLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderator/users" 
                element={
                  <ProtectedRoute requireAuth={true} requireModerator={true}>
                    <ModeratorLayout>
                      <UserManagement />
                    </ModeratorLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderator/notifications" 
                element={
                  <ProtectedRoute requireAuth={true} requireModerator={true}>
                    <ModeratorLayout>
                      <AdminNotifications />
                    </ModeratorLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/opportunities" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <Admin />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <UserManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminAnalytics />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/notifications" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminNotifications />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/email-campaigns" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminEmailCampaigns />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/expired" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminExpired />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/monetization" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminMonetization />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
