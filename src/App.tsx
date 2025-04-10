
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Teams from "./pages/Teams";
import Leaderboards from "./pages/Leaderboards";
import Auth from "./pages/Auth";
import Profile from "./components/Profile";
import NotFound from "./pages/NotFound";

// Import uuid dependency
import { v4 as uuidv4 } from "uuid";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/community" element={<Community />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
