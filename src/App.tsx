
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Submit from "./pages/Submit";
import Tailor from "./pages/Tailor";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Bookmarks from "./pages/Bookmarks";
import Scholarships from "./pages/Scholarships";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/tailor" element={<Tailor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
