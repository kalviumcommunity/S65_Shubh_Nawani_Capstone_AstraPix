import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Loader } from 'lucide-react';
import ImageCard from './ImageCard';

const ITEMS_PER_PAGE = 6;

const Gallery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/generate/gallery', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setImages(response.data.images || []);
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      setImages(prevImages => prevImages.filter(img => img._id !== imageId));
    } catch (error) {
      toast.error('Failed to update gallery');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return images.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [images, currentPage]);

  // Optimize images for gallery view
  const optimizedImages = useMemo(() => 
    paginatedImages.map(img => ({
      ...img,
      imageUrl: img.imageUrl.replace('/upload/', '/upload/w_400,f_auto,q_auto:eco/')
    }))
  , [paginatedImages]);

  const renderImage = (image) => (
    <div 
      key={image._id}
      className="relative"
    >
      <ImageCard 
        image={image}
        onDelete={handleDelete}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="mt-4 text-white/60">Loading your gallery...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Your Gallery</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New</span>
        </button>
      </div>

      {!images.length ? (
        <div className="text-center py-16 bg-black/10 rounded-xl border border-white/10">
          <p className="text-white/80 mb-4">No images generated yet. Start creating!</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
          >
            Create Your First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start transform-gpu">
          {optimizedImages.map(image => (
            <div key={image._id} className="relative transform-gpu">
              <ImageCard image={image} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {/* Simplified pagination */}
      {images.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(images.length / ITEMS_PER_PAGE) })
            .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, Math.ceil(images.length / ITEMS_PER_PAGE)))
            .map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {idx + 1}
              </button>
            ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-center text-white/60 mt-8">
          Showing {images.length} image{images.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default React.memo(Gallery);