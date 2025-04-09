import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <motion.div 
        className="text-center max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Canvas and Elements */}
        <div className="relative h-48 sm:h-72 w-48 sm:w-72 mx-auto mb-6 sm:mb-8">
          {/* Background Shape */}
          <motion.div
            className="absolute inset-0 bg-purple-200/30 dark:bg-purple-700/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Main Canvas */}
          <motion.div
            className="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Animated Gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-purple-500/30"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-bold"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              404
            </span>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Oops! Page Lost in the Creative Void
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Looks like this page took a journey into the artistic unknown! 
            Let's get you back to where the magic happens ✨
          </p>

          {/* Action Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isAuthenticated ? '/dashboard' : '/auth'}
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium shadow-lg transition-all duration-200"
            >
              Return to {isAuthenticated ? 'AstraPix Studio' : 'Login'} 🎨
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;