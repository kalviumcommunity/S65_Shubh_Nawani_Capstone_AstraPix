import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import Gallery from './components/dashboard/Gallery';
import OAuthCallback from './components/OAuthCallback';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Add future flags configuration
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router {...router}>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white overflow-x-hidden">
            <div className="fixed inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10">
              <AppRoutes />
            </div>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;