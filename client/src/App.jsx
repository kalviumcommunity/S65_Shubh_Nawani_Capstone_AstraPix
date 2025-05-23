import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import OAuthCallback from './components/OAuthCallback';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const Gallery = lazy(() => import('./components/dashboard/Gallery'));
const NotFound = lazy(() => import('./components/NotFound'));
const Privacy = lazy(() => import('./components/pages/Privacy'));
const Terms = lazy(() => import('./components/pages/Terms'));
const Sitemap = lazy(() => import('./components/pages/Sitemap'));
const HelpCenter = lazy(() => import('./components/pages/HelpCenter'));
const Documentation = lazy(() => import('./components/pages/Documentation'));
const Contact = lazy(() => import('./components/pages/Contact'));
const Pricing = lazy(() => import('./components/pages/Pricing'));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500/30 border-t-purple-500" aria-hidden="true"></div>
    <span className="sr-only">Loading page...</span>
  </div>
);

// Add future flags configuration
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router {...routerOptions}>
      <AuthProvider>
        <ThemeProvider>
          {/* Fixed background elements */}
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-purple-900" aria-hidden="true" />
          <div className="fixed inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
          
          {/* Main content container */}
          <div className="min-h-screen text-white overflow-x-hidden relative">
            <div className="relative z-10 transition-all duration-300 ease-in-out">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={<ConditionalRedirect to="/dashboard" fallback={<LandingPage />} />} 
                  />
                  <Route 
                    path="/auth" 
                    element={<ConditionalRedirect to="/dashboard" fallback={<AuthPage />} />} 
                  />
                  <Route path="/oauth-callback" element={<OAuthCallback />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/gallery" element={
                    <ProtectedRoute>
                      <Gallery />
                    </ProtectedRoute>
                  } />

                  {/* Public Info Pages */}
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </div>
          
          {/* Toast notifications container */}
          <Toaster position="top-right" toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem'
            },
            success: {
              iconTheme: {
                primary: '#8B5CF6',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
            },
          }} />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

// Helper component to conditionally redirect based on auth state
function ConditionalRedirect({ to, fallback }) {
  const { user } = useAuth();
  return user ? <Navigate to={to} replace /> : fallback;
}

// This comes last to avoid circular dependency issues
import { useAuth } from './context/AuthContext';

export default App;
