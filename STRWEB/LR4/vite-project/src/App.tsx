import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AuthCallback from "./components/AuthCallback";
import PublicView from "./components/PublicView";
import Navigation from "./components/Navigation";
import Catalog from "./components/Catalog";
import ItemDetail from "./components/ItemDetail";
import VeterinaryClinic from "./components/VeterinaryClinic";
import Home from "./components/Home";
import EmergencyAlert from "./components/EmergencyAlert";
import PetHealthAnalyzer from "./components/PetHealthAnalyzer";
import VaccineTracker from "./components/VaccineTracker";
import { AuthProvider } from "./components/AuthProvider";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Navigation />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/veterinary"
            element={
              <>
                <Navigation />
                <VeterinaryClinic />
              </>
            }
          />
          <Route
            path="/catalog"
            element={
              <>
                <Navigation />
                <Catalog />
              </>
            }
          />
          <Route
            path="/catalog/:id"
            element={
              <>
                <Navigation />
                <ItemDetail />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Navigation />
                <Home />
              </>
            }
          />
          <Route
            path="/emergency"
            element={
              <>
                <Navigation />
                <EmergencyAlert />
              </>
            }
          />
          <Route
            path="/pet-health"
            element={
              <>
                <Navigation />
                <PetHealthAnalyzer />
              </>
            }
          />
          <Route
            path="/vaccine-tracker"
            element={
              <>
                <Navigation />
                <VaccineTracker />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
