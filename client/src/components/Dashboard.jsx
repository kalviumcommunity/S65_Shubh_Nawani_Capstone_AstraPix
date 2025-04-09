import React, { useState, useEffect, useCallback, useMemo, useContext, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';

// Components
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import ImageGenerationForm from './dashboard/ImageGenerationForm';

// Lazy load components
const PaymentModal = lazy(() => import('./modals/PaymentModal'));
const Gallery = lazy(() => import('./dashboard/Gallery'));
const StatsGrid = lazy(() => import('./dashboard/StatsGrid'));

// Assets
import BackgroundImage from '../assets/bg.jpg';

const Dashboard = () => {
  // Auth and Theme Context
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // State Management
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [recentImages, setRecentImages] = useState([]);

  // Memoized API headers
  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  // Optimized data fetching with debounce
  const fetchUserData = useCallback(async () => {
    try {
      if (!user?.email) return;
      
      const controller = new AbortController();
      const { signal } = controller;

      Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URI}/check/credits/${user.email}`, { ...authHeaders, signal }),
        axios.get(`${import.meta.env.VITE_BASE_URI}/generate/gallery`, { ...authHeaders, signal })
      ]).then(([creditResponse, imagesResponse]) => {
        setCredits(creditResponse.data.credit);
        setUserImages(imagesResponse.data.images);
        setLoading(false);
        setLoadingImages(false);
      }).catch(err => {
        if (!signal.aborted) {
          setError('Failed to fetch data');
          setLoading(false);
          setLoadingImages(false);
        }
      });

      return () => controller.abort();
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      setLoadingImages(false);
    }
  }, [user?.email, authHeaders]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Initial setup effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRecentImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/generate/gallery`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRecentImages((response.data.images || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch recent images');
      }
    };

    fetchRecentImages();
  }, []);

  // Handlers
  const handleCreditUpdate = (newCredits) => {
    setCredits(newCredits);
    toast.success(`Credits updated! New balance: ${newCredits}`);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    toast.success('Successfully logged out!', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#333',
        color: '#fff',
      },
    });

    // Delete token and delay navigation
    setTimeout(() => {
      window.location.href = '/auth';  // Using window.location instead of navigate
    }, 1000);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URI}/generate/${imageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setUserImages(images => images.filter(img => img._id !== imageId));
        toast.success('Image deleted successfully', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
          icon: '🗑️'
        });
      }
    } catch (error) {
      toast.error('Failed to delete image', {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

  // Optimized image generation
  const handleGenerateImage = useCallback(async (e) => {
    e.preventDefault();
    if (!prompt.trim() || credits <= 0 || generating) return;
    
    setGenerating(true);
    setGenerationError(null);
    setGeneratedImage(null);

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URI}/generate/generate`, 
            { prompt: prompt.trim(), userId: user._id },
            authHeaders
        );

        if (response.data.success) {
            const newImage = {
                _id: response.data.imageId,
                imageUrl: response.data.cloudinaryUrl,
                prompt: prompt,
                generatedAt: response.data.generatedAt,
                createdAt: response.data.createdAt
            };

            setGeneratedImage(response.data.cloudinaryUrl);
            setUserImages(prev => [newImage, ...prev]);
            setCredits(prev => prev - 1);
            toast.success('Image generated successfully!');
        }
    } catch (err) {
        toast.error('Failed to generate image');
        setGenerationError('Failed to generate image. Please try again.');
        // Revert credits if needed
        fetchUserData();
    } finally {
        setGenerating(false);
    }
}, [prompt, credits, generating, user?._id, authHeaders, fetchUserData]);

  // Memoized components
  const memoizedNav = useMemo(() => (
    <Navbar 
      user={user}
      credits={credits}
      loading={loading}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
      handleLogout={handleLogout}
      openPaymentModal={() => setIsPaymentModalOpen(true)}
    />
  ), [user, credits, loading, darkMode]);

  const memoizedImageForm = useMemo(() => (
    <ImageGenerationForm 
      prompt={prompt}
      setPrompt={setPrompt}
      credits={credits}
      generating={generating}
      generatedImage={generatedImage}
      generationError={generationError}
      handleGenerateImage={handleGenerateImage}
    />
  ), [prompt, credits, generating, generatedImage, generationError, handleGenerateImage]);

  // Memoize the gallery component
  const MemoizedGallery = useMemo(() => (
    <Gallery 
      images={userImages}
      loading={loadingImages}
      onDelete={handleDeleteImage}
    />
  ), [userImages, loadingImages]);

  // Get only recent images with reduced quality
  const recentImagesMemo = useMemo(() => 
    userImages.slice(0, 3).map(img => ({
        ...img,
        imageUrl: img.imageUrl.replace('/upload/', '/upload/w_400,q_auto:low/'),
        generatedAt: img.generatedAt 
            ? new Date(img.generatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'Not available',
        createdAt: img.createdAt
            ? new Date(img.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'Not available'
    }))
  , [userImages]);

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/80 text-sm">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-900 to-purple-900">
      <Toaster position="top-right" />
      
      {/* Remove background image and use simpler gradient */}
      <div className="fixed inset-0 z-0 opacity-50" />

      {memoizedNav}

      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Simplified card backgrounds */}
            <div className="bg-black/10 border border-white/10 p-6 sm:p-8 rounded-xl">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Image Generation
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-200 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              {memoizedImageForm}

              {/* Lazy load StatsGrid */}
              <Suspense fallback={<div className="h-24 animate-pulse bg-white/5 rounded-lg" />}>
                <StatsGrid 
                  loading={loading}
                  credits={credits}
                  generatedImages={userImages} // Pass full userImages array instead of just recent ones
                  openPaymentModal={() => setIsPaymentModalOpen(true)}
                />
              </Suspense>
            </div>

            <div className="bg-black/10 border border-white/10 p-6 sm:p-8 rounded-xl">
              {/* Gallery section with recent images */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Recent Creations</h2>
                <button
                  onClick={() => navigate('/gallery')}
                  className="text-purple-400 hover:text-purple-300"
                >
                  View All →
                </button>
              </div>
              <Suspense fallback={<div className="h-96 animate-pulse bg-white/5 rounded-lg" />}>
                <Gallery 
                  images={recentImagesMemo.slice(0, 3)}
                  loading={loadingImages}
                  onDelete={handleDeleteImage}
                  showHeaderFooter={false}
                  isMinimal={true}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lazy load PaymentModal only when needed */}
      {isPaymentModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50" />}>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={handleCreditUpdate}
          />
        </Suspense>
      )}
    </div>
  );
};

export default React.memo(Dashboard);