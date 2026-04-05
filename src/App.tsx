import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Plans from "./pages/Plans";
import Today from "./pages/Today";
import Journey from "./pages/Journey";
import Progress from "./pages/Progress";
import Practices from "./pages/Practices";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Diagnosis from "./pages/Diagnosis";
import Checkout from "./pages/Checkout";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Learn from "./pages/Learn";
import History from "./pages/History";
import HistoryRecipes from "./pages/HistoryRecipes";
import HistoryExercises from "./pages/HistoryExercises";
import HistoryKnowledge from "./pages/HistoryKnowledge";
import Dashboard from "./pages/admin/Dashboard";
import Clients from "./pages/admin/Clients";
import Exercises from "./pages/admin/Exercises";
import Recipes from "./pages/admin/Recipes";
import Habits from "./pages/admin/Habits";
import Notifications from "./pages/admin/Notifications";
import Financial from "./pages/admin/Financial";
import AdminUsers from "./pages/admin/AdminUsers";
import LearnModules from "./pages/admin/LearnModules";
import UpdateGuia from "./pages/admin/UpdateGuia";

import Day1Journey from "./pages/Day1Journey";
import Celebration from "./pages/Celebration";
import Diary from "./pages/Diary";
import Guia from "./pages/Guia";
import GuiaSection from "./pages/GuiaSection";
import SOSProtocol from "./pages/SOSProtocol";

import NotFound from "./pages/NotFound";

// build v6 – review mode + SW fix
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/day1-journey" element={<Day1Journey />} />
            <Route path="/today" element={<ProtectedRoute><Today /></ProtectedRoute>} />
            <Route path="/celebration" element={<ProtectedRoute><Celebration /></ProtectedRoute>} />
            <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/guia" element={<ProtectedRoute><Guia /></ProtectedRoute>} />
            <Route path="/guia/:chapterId/:sectionId" element={<ProtectedRoute><GuiaSection /></ProtectedRoute>} />
            <Route path="/practices" element={<ProtectedRoute><Practices /></ProtectedRoute>} />
            <Route path="/practices/sos/:situation" element={<ProtectedRoute><SOSProtocol /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/history/recipes" element={<ProtectedRoute><HistoryRecipes /></ProtectedRoute>} />
            <Route path="/history/exercises" element={<ProtectedRoute><HistoryExercises /></ProtectedRoute>} />
            <Route path="/history/knowledge" element={<ProtectedRoute><HistoryKnowledge /></ProtectedRoute>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requireAdmin><Clients /></ProtectedRoute>} />
            <Route path="/admin/exercises" element={<ProtectedRoute requireAdmin><Exercises /></ProtectedRoute>} />
            <Route path="/admin/recipes" element={<ProtectedRoute requireAdmin><Recipes /></ProtectedRoute>} />
            <Route path="/admin/habits" element={<ProtectedRoute requireAdmin><Habits /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute requireAdmin><Notifications /></ProtectedRoute>} />
            <Route path="/admin/financial" element={<ProtectedRoute requireAdmin><Financial /></ProtectedRoute>} />
            <Route path="/admin/learn-modules" element={<ProtectedRoute requireAdmin><LearnModules /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
            
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
