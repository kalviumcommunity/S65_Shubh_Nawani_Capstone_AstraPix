import React from "react";
import { motion } from "framer-motion";
import { Coins, ImageIcon } from "lucide-react";

const StatsGrid = ({ loading, credits, generatedImages, openPaymentModal }) => {
  const imageCount = generatedImages?.length || 0;

  // Respect user's reduced motion preference
  const motionConfig = {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-6">
      <motion.div
        {...motionConfig}
        className="bg-black/20 p-3 sm:p-6 rounded-xl border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs sm:text-sm">
              Credits Available
            </p>
            <h3 className="text-xl sm:text-3xl font-bold text-white mt-1">
              {loading ? (
                <span
                  className="inline-block w-8 h-8 bg-white/10 rounded animate-pulse"
                  aria-hidden="true"
                ></span>
              ) : (
                credits
              )}
            </h3>
          </div>
          <Coins
            className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400"
            aria-hidden="true"
          />
        </div>
        <button
          onClick={openPaymentModal}
          className="mt-2 sm:mt-4 w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none rounded-lg text-white transition-colors text-xs sm:text-base touch-manipulation"
          disabled={loading}
          aria-label="Buy more image generation credits"
        >
          Buy Credits
        </button>
      </motion.div>

      <motion.div
        {...motionConfig}
        className="bg-black/20 p-3 sm:p-6 rounded-xl border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs sm:text-sm">Images Generated</p>
            <h3 className="text-xl sm:text-3xl font-bold text-white mt-1">
              {loading ? (
                <span
                  className="inline-block w-8 h-8 bg-white/10 rounded animate-pulse"
                  aria-hidden="true"
                ></span>
              ) : (
                imageCount
              )}
            </h3>
          </div>
          <ImageIcon
            className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400"
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 sm:mt-4 text-white/60 text-xs sm:text-sm">
          {loading ? (
            <span
              className="inline-block w-full h-4 bg-white/10 rounded animate-pulse"
              aria-hidden="true"
            ></span>
          ) : (
            `${imageCount} image${imageCount !== 1 ? "s" : ""} created with AI`
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default StatsGrid;
