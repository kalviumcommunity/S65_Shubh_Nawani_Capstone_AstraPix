import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const SimpleHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-3 sm:mr-4 p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors touch-manipulation"
          title="Go to Dashboard"
          aria-label="Go to Dashboard"
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-white/10 rounded-lg">
            <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            AstraPix
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleHeader;
