import React, { useState, useMemo, memo, useEffect } from 'react';
import { Download, Share, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ImageCard = ({ image, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    // Use Intersection Observer to detect when card is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const currentElement = document.getElementById(`image-card-${image._id}`);
    if (currentElement) observer.observe(currentElement);
    
    return () => {
      if (currentElement) observer.disconnect();
    };
  }, [image._id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/generate/${image._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      onDelete(image._id);
      toast.success('Image deleted successfully', {
        position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
      });
    } catch (error) {
      toast.error('Failed to delete image', {
        position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
      });
    }
  };

  const handleShare = async () => {
    try {
      // Create a file object for sharing
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `astrapix-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my AI generated image!',
          text: image.prompt,
          files: [file]
        });
        toast.success('Image shared successfully', {
          position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
        });
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(
          `Check out this AI-generated image!\n\nPrompt: ${image.prompt}\n\nLink: ${image.imageUrl}`
        );
        toast.success('Link copied to clipboard (sharing not supported in this browser)', {
          position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error sharing:', error);
      toast.error('Failed to share image', {
        position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `astrapix-${image.prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Downloading image...', {
        position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
      });
    } catch (error) {
      toast.error('Failed to download image', {
        position: window.innerWidth < 640 ? 'bottom-center' : 'top-right'
      });
    }
  };

  const thumbnailUrl = useMemo(() => 
    image.imageUrl.replace('/upload/', '/upload/w_400,f_auto,q_auto:eco/')
  , [image.imageUrl]);

  return (
    <div 
      id={`image-card-${image._id}`}
      className="relative aspect-square rounded-lg overflow-hidden bg-black/5 touch-manipulation group"
    >
      {isInView ? (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <span className="sr-only">Loading image...</span>
            </div>
          )}
          <img
            src={thumbnailUrl}
            alt={image.prompt}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gray-100"></div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 touch:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <p className="text-white text-xs sm:text-sm line-clamp-2 mb-1.5 sm:mb-2">{image.prompt}</p>
          <div className="flex justify-between items-center">
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={handleDownload}
                className="p-1 sm:p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors touch-manipulation"
                title="Download"
                aria-label="Download image"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </button>
              
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="p-1 sm:p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors touch-manipulation"
                  title="Share"
                  aria-label="Share image"
                >
                  <Share className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </button>
              )}
            </div>
            
            <button
              onClick={handleDelete}
              className="p-1 sm:p-1.5 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors touch-manipulation"
              title="Delete"
              aria-label="Delete image"
            >
              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ImageCard);
