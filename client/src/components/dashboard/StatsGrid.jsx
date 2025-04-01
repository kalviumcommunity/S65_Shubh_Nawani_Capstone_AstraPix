import React from 'react';
import { Image, CreditCard, History } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsGrid = ({ loading, credits, generatedImages, openPaymentModal }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 border border-white/10 dark:border-gray-700/10 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Image className="h-6 w-6 text-white/80" />
          <h3 className="text-xl font-semibold text-white">
            Your Stats
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-white/80">
            Available Credits: {loading ? 'Loading...' : credits}
          </p>
          <p className="text-white/80">
            Images Generated: {generatedImages.length}
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 border border-white/10 dark:border-gray-700/10 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-4">
          <CreditCard className="h-6 w-6 text-white/80" />
          <h3 className="text-xl font-semibold text-white">
            Buy Credits
          </h3>
        </div>
        <p className="text-white/80 mb-4">
          Purchase more credits to generate images
        </p>
        <button
          onClick={openPaymentModal}
          className="w-full bg-purple-600/90 hover:bg-purple-700/90 text-white px-4 py-2 rounded-md transition-all duration-200"
        >
          Purchase Credits
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 border border-white/10 dark:border-gray-700/10 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-4">
          <History className="h-6 w-6 text-white/80" />
          <h3 className="text-xl font-semibold text-white">
            Recent Activity
          </h3>
        </div>
        <div className="space-y-2">
          {generatedImages.slice(-3).map((img, index) => (
            <p key={index} className="text-sm text-white/80">
              Generated: {new Date(img.timestamp).toLocaleDateString()}
            </p>
          ))}
          {generatedImages.length === 0 && (
            <p className="text-white/80">
              No recent activity
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsGrid;