import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Update document title during loading
  useEffect(() => {
    if (loading) {
      const originalTitle = document.title;
      document.title = 'Verifying Authentication...';
      return () => {
        document.title = originalTitle;
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4"
        role="status"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 border-purple-500/30 border-t-purple-500" aria-hidden="true"></div>
        <p className="mt-4 text-white/80 text-sm sm:text-base">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the intended destination in redirect
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
