import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Set document title
    document.title = "Completing Authentication";

    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');

        if (!token) {
          setError('No authentication token received');
          setIsProcessing(false);
          return;
        }

        await login(token);
        
        if (userParam) {
          try {
            const user = JSON.parse(decodeURIComponent(userParam));
            // You can handle the user data here if needed
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            // Continue anyway since token auth succeeded
          }
        }
        
        navigate('/dashboard');
      } catch (error) {
        setError(error.message || 'Authentication failed');
        setIsProcessing(false);
      }
    };
    
    handleCallback();
  }, [location, login, navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (error && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (error && countdown === 0) {
      navigate('/auth');
    }
  }, [error, countdown, navigate]);

  // Handle manual navigation
  const handleManualNavigation = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900/50 p-4">
      <div 
        className="text-center bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 max-w-sm w-full"
        role="status"
        aria-live="polite"
      >
        {error ? (
          <div className="space-y-3">
            <div className="text-red-400 text-sm sm:text-base" role="alert">{error}</div>
            <p className="text-white/60 text-xs sm:text-sm">
              Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            <button
              onClick={handleManualNavigation}
              className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none rounded-lg text-white text-xs sm:text-sm transition-colors"
            >
              Go to login now
            </button>
          </div>
        ) : (
          <>
            <div 
              className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-white/20 border-t-purple-500 mx-auto"
              aria-hidden="true"
            ></div>
            <p className="mt-4 text-white/80 text-sm sm:text-base">Completing authentication...</p>
            <p className="mt-2 text-white/50 text-xs sm:text-sm">Please wait, you'll be redirected shortly</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
