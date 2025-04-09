import React, { useState, useEffect, useMemo, Suspense, useContext, useCallback, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Loader, Download, Share2, Trash2, ArrowUpDown, X, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ImageViewer from '../common/ImageViewer';

const ITEMS_PER_PAGE = 6;

// Simplify animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }  // Removed staggerChildren for better performance
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.2 }  // Reduced animation duration
  }
};

const PaymentModal = lazy(() => import('../modals/PaymentModal'));

const Gallery = ({ showHeaderFooter = true, isMinimal = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Add logout from AuthContext
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/check/credits/${user.email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCredits(response.data.credit);
    } catch (error) {
      console.error('Failed to fetch user credits');
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/generate/gallery`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setImages(response.data.images || []);
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchImages(), fetchUserData()]);
    setLoading(false);
  }, []);

  const handleDelete = async (imageId) => {
    if (deleteConfirm !== imageId) {
      setDeleteConfirm(imageId);
      // First click - show warning toast
      toast((t) => (
        <div className="flex items-center gap-2">
          <span>⚠️ Click again to delete</span>
        </div>
      ), { duration: 3000 });
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    // Optimistic update
    setImages(prevImages => prevImages.filter(img => img._id !== imageId));
    setDeleteConfirm(null);
    
    // Show immediate success feedback
    toast.success('Image deleted successfully', {
      icon: '🗑️',
      style: {
        background: '#10B981',
        color: '#ffffff',
        borderRadius: '8px',
      },
    });

    // Backend sync
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/generate/${imageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/generate/gallery`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setImages(response.data.images || []);
    } catch (error) {
      // Revert on failure
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/generate/gallery`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setImages(response.data.images || []);
      
      toast.error('Failed to delete image', {
        icon: '❌',
        style: {
          background: '#EF4444',
          color: '#ffffff',
          borderRadius: '8px',
        },
      });
    }
  };

  const handleShare = async (image) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my AI-generated image on AstraPix!',
          text: `Generated with prompt: ${image.prompt}`,
          url: image.imageUrl
        });
        toast.success('Shared successfully');
      } else {
        await navigator.clipboard.writeText(
          `Check out this AI-generated image on AstraPix!\n\nPrompt: ${image.prompt}\n\nLink: ${image.imageUrl}`
        );
        toast.success('Share link copied to clipboard');
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      toast.error('Failed to share image');
    }
  };

  const handleDownload = async (image) => {
    try {
      setDownloadProgress(prev => ({ ...prev, [image._id]: true }));
      
      const response = await fetch(image.imageUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const filename = `astrapix-${image.prompt.slice(0, 30)
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()}.jpg`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    } finally {
      setDownloadProgress(prev => ({ ...prev, [image._id]: false }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []); // Run once when component mounts

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCreditUpdate = async (newCredits) => {
    setCredits(newCredits);
    await refreshData(); // Refresh data after credit update
    toast.success(`Credits updated! New balance: ${newCredits}`);
  };

  // Optimize image loading with IntersectionObserver
  const imageRef = useCallback(node => {
    if (!node) return;
    
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Optimize sorted images calculation
  const sortedImages = useMemo(() => {
    if (!images?.length) return [];
    return [...images].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortNewestFirst ? timeB - timeA : timeA - timeB;
    });
  }, [images, sortNewestFirst]);

  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedImages, currentPage]);

  // Optimize image loading
  const optimizedImages = useMemo(() => 
    paginatedImages.map(img => ({
      ...img,
      imageUrl: img.imageUrl.replace('/upload/', '/upload/w_400,f_auto,q_auto:low/') // Lower quality for better performance
    }))
  , [paginatedImages]);

  const FullscreenViewer = ({ image }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4 sm:p-6"
      onClick={() => setFullscreenImage(null)}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-xl w-full mx-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setFullscreenImage(null)}
          className="absolute -top-8 right-0 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white"
        >
          <X className="w-4 h-4" />
        </motion.button>

        <div className="bg-gray-900/90 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="max-h-[70vh] overflow-hidden">
            <img
              src={image.imageUrl}
              alt={image.prompt}
              className="w-full h-auto object-contain"
            />
          </div>
          
          <div className="p-3 border-t border-white/10">
            <p className="text-white/90 text-xs mb-2 line-clamp-2">{image.prompt}</p>
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleDownload(image)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <Download className="w-3.5 h-3.5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleShare(image)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  handleDelete(image._id);
                  setFullscreenImage(null);
                }}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <>
        {showHeaderFooter && (
          <Navbar 
            user={user}
            credits={credits}
            loading={loading}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
            openPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[400px]"
        >
          <Loader className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="mt-4 text-white/60">Loading your gallery...</p>
        </motion.div>
        {showHeaderFooter && <Footer />}
      </>
    );
  }

  return (
    <>
      {showHeaderFooter && (
        <Navbar 
          user={user}
          credits={credits}
          loading={loading}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          openPaymentModal={() => setIsPaymentModalOpen(true)}
        />
      )}
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto"> {/* Increased max width */}
          {!isMinimal && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Gallery</h2>
                <button
                  onClick={() => setSortNewestFirst(!sortNewestFirst)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{sortNewestFirst ? "Newest" : "Oldest"}</span>
                </button>
              </div>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create New</span>
              </button>
            </motion.div>
          )}

          {/* Main gallery grid */}
          <AnimatePresence mode="wait">
            {!images.length ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full text-center py-16 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm"
              >
                <p className="text-white/80 mb-4">No images generated yet. Start creating!</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  Create Your First Image
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {paginatedImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group relative rounded-xl overflow-hidden bg-black/5"
                    style={{ minHeight: '300px', aspectRatio: '1/1' }}
                  >
                    <img
                      src={`${image.imageUrl.replace('/upload/', '/upload/w_800,f_auto,q_auto/')}`}
                      data-src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                      ref={imageRef}
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <p className="text-white text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                          {image.prompt}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <ActionButton icon={<Download />} onClick={() => handleDownload(image)} />
                            {navigator.share && (
                              <ActionButton icon={<Share2 />} onClick={() => handleShare(image)} />
                            )}
                            <ActionButton 
                              icon={<Maximize2 />} 
                              onClick={() => setFullscreenImage(image)} 
                            />
                          </div>
                          <ActionButton 
                            icon={<Trash2 />} 
                            onClick={() => handleDelete(image._id)} 
                            danger 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          <ImageViewer
            image={selectedImage}
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
          />

          <AnimatePresence>
            {fullscreenImage && (
              <FullscreenViewer image={fullscreenImage} />
            )}
          </AnimatePresence>

          {!isMinimal && images.length > ITEMS_PER_PAGE && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex justify-center gap-2"
            >
              {Array.from({ length: Math.ceil(images.length / ITEMS_PER_PAGE) })
                .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, Math.ceil(images.length / ITEMS_PER_PAGE)))
                .map((_, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === idx + 1 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {idx + 1}
                  </motion.button>
                ))}
            </motion.div>
          )}

          {!isMinimal && images.length > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/60 mt-8"
            >
              Showing {paginatedImages.length} of {images.length} image{images.length !== 1 ? 's' : ''}
            </motion.p>
          )}
        </div>
      </div>

      {/* Add PaymentModal */}
      {isPaymentModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50" />}>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={handleCreditUpdate}
          />
        </Suspense>
      )}
      
      {showHeaderFooter && <Footer />}
    </>
  );
};

// Helper component for action buttons
const ActionButton = ({ icon, onClick, danger = false }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-2 rounded-full transition-colors touch-manipulation ${
      danger ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-white/20 hover:bg-white/30'
    }`}
  >
    {React.cloneElement(icon, { 
      className: `w-4 h-4 ${danger ? 'text-red-400' : 'text-white'}`
    })}
  </motion.button>
);

export default React.memo(Gallery);