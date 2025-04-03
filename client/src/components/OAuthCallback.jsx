import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');

        if (!token) {
          setError('No authentication token received');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        await login(token);
        if (userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          // You can handle the user data here if needed
        }
        navigate('/dashboard');
      } catch (error) {
        setError(error.message || 'Authentication failed');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };
    handleCallback();
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;