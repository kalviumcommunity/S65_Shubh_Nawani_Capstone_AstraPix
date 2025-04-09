import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ImageViewer = ({ image, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-hidden touch-none"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative z-50 min-h-screen flex items-center justify-center p-3 sm:p-4"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors touch-manipulation"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          <motion.img
            src={image?.imageUrl}
            alt={image?.prompt}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            style={{ willChange: 'transform' }}
            layoutId={`image-${image?._id}`}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageViewer;
