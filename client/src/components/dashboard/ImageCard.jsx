import React, { useState, useMemo } from 'react';
import { Download, Share, Trash2 } from 'lucide-react';
import axios from 'axios'; // Add this import
import { toast } from 'react-hot-toast'; // Add this import

const ImageCard = React.memo(({ image, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/generate/${image._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      onDelete(image._id); // Pass the image ID to the parent component
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Check out my AI generated image!',
        text: image.prompt,
        url: image.imageUrl
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Generate optimized image URL for thumbnails
  const thumbnailUrl = useMemo(() => {
    const baseUrl = image.imageUrl;
    return baseUrl.replace('/upload/', '/upload/w_400,c_scale,q_auto:eco/');
  }, [image.imageUrl]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-black/5">
      <img
        src={thumbnailUrl}
        alt=""
        className="w-full aspect-square object-cover"
        loading="lazy"
        decoding="async"
        width="400"
        height="400"
      />
      
      {/* Simplified overlay without transitions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 opacity-0 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm line-clamp-2 mb-3">{image.prompt}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => window.open(image.imageUrl, '_blank')}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
              
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Share"
                >
                  <Share className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            
            <button
              onClick={handleDelete} // Changed from onDelete to handleDelete
              className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => prevProps.image._id === nextProps.image._id);

export default ImageCard;