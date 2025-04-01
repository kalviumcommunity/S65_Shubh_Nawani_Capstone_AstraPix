import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import OAuthCallback from './components/OAuthCallback';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { colors } from './utils/colors';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className={`min-h-screen ${colors.light.background} dark:${colors.dark.background} transition-colors duration-200`}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthPage />} />
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
              
              {/* Default Route - Redirect to Auth if not authenticated */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;