import React from 'react';
import { motion } from 'framer-motion';
import { Coins, ImageIcon } from 'lucide-react';

const StatsGrid = ({ loading, credits, generatedImages, openPaymentModal }) => {
  const imageCount = generatedImages?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-8">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-black/20 p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Credits Available</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{loading ? '-' : credits}</h3>
          </div>
          <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
        </div>
        <button
          onClick={openPaymentModal}
          className="mt-3 sm:mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors text-sm sm:text-base"
        >
          Buy Credits
        </button>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-black/20 p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Images Generated</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{loading ? '-' : imageCount}</h3>
          </div>
          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
        </div>
        <p className="mt-3 sm:mt-4 text-white/60">
          {loading ? 'Loading...' : `${imageCount} image${imageCount !== 1 ? 's' : ''} created with AI`}
        </p>
      </motion.div>
    </div>
  );
};

export default StatsGrid;