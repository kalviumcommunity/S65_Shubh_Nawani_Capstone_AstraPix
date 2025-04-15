import React, { useState, useEffect, useMemo, Suspense, useContext, useCallback, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Loader, Download, Share2, Trash2, ArrowUpDown, X, Maximize2, Heart, AlertTriangle } from 'lucide-react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ImageViewer from '../common/ImageViewer';

const ITEMS_PER_PAGE = 6;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

const PaymentModal = lazy(() => import('../modals/PaymentModal'));

const Gallery = ({ showHeaderFooter = true, isMinimal = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [downloadCounts, setDownloadCounts] = useState({});
  const [shareCounts, setShareCounts] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [filterType, setFilterType] = useState('all');

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
    setImageToDelete(imageId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      // Optimistic update - remove from UI first
      setImages(prevImages => prevImages.filter(img => img._id !== imageToDelete));
      setShowDeleteModal(false);
      
      // Then delete from server
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/generate/${imageToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setImageToDelete(null);
    } catch (error) {
      console.error('Failed to delete image');
      // Only fetch images again if delete failed
      await fetchImages();
    }
  };

  const handleShare = async (image) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      
      const file = new File([blob], `astrapix-${image.prompt.slice(0, 30)
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()}.jpg`, { type: 'image/jpeg' });

      if (navigator.share) {
        await navigator.share({
          title: 'Check out my AI-generated image on AstraPix!',
          text: `Generated with prompt: ${image.prompt}`,
          files: [file]
        });
        toast.success('Shared successfully');
      } else {
        await navigator.clipboard.writeText(
          `Check out this AI-generated image on AstraPix!\n\nPrompt: ${image.prompt}\n\nLink: ${image.imageUrl}`
        );
        toast.success('Share link copied to clipboard (File sharing not supported in this browser)');
      }

      setShareCounts(prev => ({
        ...prev,
        [image._id]: (prev[image._id] || 0) + 1
      }));
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Share error:', error);
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

      setDownloadCounts(prev => ({
        ...prev,
        [image._id]: (prev[image._id] || 0) + 1
      }));
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    } finally {
      setDownloadProgress(prev => ({ ...prev, [image._id]: false }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('galleryFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCreditUpdate = async (newCredits) => {
    setCredits(newCredits);
    await refreshData();
    toast.success(`Credits updated! New balance: ${newCredits}`);
  };

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

  const sortedImages = useMemo(() => {
    if (!images?.length) return [];
    return [...images].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortNewestFirst ? timeB - timeA : timeA - timeB;
    });
  }, [images, sortNewestFirst]);

  const filteredImages = useMemo(() => {
    if (filterType === 'favorites') {
      return sortedImages.filter(img => favorites.includes(img._id));
    }
    if (!searchTerm) return sortedImages;
    return sortedImages.filter(img => 
      img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedImages, searchTerm, filterType, favorites]);

  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredImages, currentPage]);

  const toggleFavorite = useCallback((imageId) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(imageId);
      const newFavorites = isFavorite
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId];
      
      localStorage.setItem('galleryFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const optimizedImages = useMemo(() => 
    paginatedImages.map(img => ({
      ...img,
      imageUrl: img.imageUrl.replace('/upload/', '/upload/w_400,f_auto,q_auto:low/')
    }))
  , [paginatedImages]);

  const FullscreenViewer = ({ image }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}

      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4 sm:p-6"

      onClick={() => setFullscreenImage(null)}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}

        className="relative w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setFullscreenImage(null)}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-50"

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


        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
          />
        </div>

        <div className="w-full max-w-3xl mx-auto p-4 bg-gray-900/95 backdrop-blur-md rounded-lg mt-4">
          <p className="text-white/90 text-sm mb-3">{image.prompt}</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(image);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <Download className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleShare(image);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <Share2 className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image._id);
                setFullscreenImage(null);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
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

  const DeleteConfirmationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-900 border border-purple-500/20 rounded-lg p-6 max-w-sm w-full shadow-xl backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
        </div>
        <p className="text-white/70 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
          >
            Delete
          </button>
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
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
          <Navbar 
            user={user}
            credits={credits}
            loading={loading}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
            openPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        </div>
      )}
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-16 bg-gradient-to-b from-gray-800/50 via-gray-900/30 to-purple-900/20 backdrop-blur-lg"> 
        <div className="max-w-6xl mx-auto relative z-10">
          {!isMinimal && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gray-800/30 backdrop-blur-xl p-4 rounded-lg border border-purple-500/10 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-grow">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Gallery</h2>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full sm:w-64 px-3 py-1.5 bg-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                    />
                    <button
                      onClick={() => setSortNewestFirst(!sortNewestFirst)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      <span>{sortNewestFirst ? "Newest" : "Oldest"}</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFilterType(filterType === 'all' ? 'favorites' : 'all')}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition-colors ${
                      filterType === 'favorites'
                        ? 'bg-purple-500/30 text-purple-300'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${filterType === 'favorites' ? 'fill-purple-300' : ''}`} />
                    <span className="ml-2">Favorites</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create New</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5 shadow-lg min-h-[200px] flex items-center"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={`${image.imageUrl}`}
                        data-src={image.imageUrl}
                        alt={image.prompt}
                        className="w-auto h-auto max-w-full max-h-[400px] object-contain rounded-lg"
                        loading="lazy"
                        ref={imageRef}
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => toggleFavorite(image._id)}
                            className={`p-2 rounded-full ${
                              favorites.includes(image._id) 
                                ? 'bg-purple-500/30' 
                                : 'bg-white/20'
                            }`}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                favorites.includes(image._id) 
                                  ? 'text-purple-400 fill-purple-400' 
                                  : 'text-white'
                              }`} 
                            />
                          </button>
                          {downloadCounts[image._id] > 0 && (
                            <span className="text-xs text-white/60">
                              {downloadCounts[image._id]} downloads
                            </span>
                          )}
                          {shareCounts[image._id] > 0 && (
                            <span className="text-xs text-white/60">
                              {shareCounts[image._id]} shares
                            </span>
                          )}
                        </div>
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

          <AnimatePresence>
            {showDeleteModal && <DeleteConfirmationModal />}
          </AnimatePresence>

          {!isMinimal && filteredImages.length > ITEMS_PER_PAGE && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(filteredImages.length / ITEMS_PER_PAGE) })
                  .map((_, idx) => {
                    if (
                      idx === 0 || 
                      idx === Math.ceil(filteredImages.length / ITEMS_PER_PAGE) - 1 ||
                      (idx >= currentPage - 2 && idx <= currentPage)
                    ) {
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`min-w-[32px] px-3 py-1 rounded ${
                            currentPage === idx + 1 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-white/10 text-white/60 hover:bg-white/20'
                          }`}
                        >
                          {idx + 1}
                        </motion.button>
                      );
                    } else if (
                      idx === currentPage - 3 || 
                      idx === currentPage + 1
                    ) {
                      return <span key={idx} className="text-white/40">...</span>;
                    }
                    return null;
                  }).filter(Boolean)}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredImages.length / ITEMS_PER_PAGE), prev + 1))}
                disabled={currentPage === Math.ceil(filteredImages.length / ITEMS_PER_PAGE)}
                className="px-3 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10"
              >
                Next
              </button>
            </motion.div>
          )}

          {!isMinimal && images.length > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/60 mt-4 mb-6"
            >
              Showing {paginatedImages.length} of {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
            </motion.p>
          )}
        </div>
      </div>

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