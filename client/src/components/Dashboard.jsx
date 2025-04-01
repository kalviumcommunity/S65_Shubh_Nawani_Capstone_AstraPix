import React, { useState, useEffect, useContext } from 'react';
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
import StatsGrid from './dashboard/StatsGrid';
import PaymentModal from './modals/PaymentModal';

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
  const [generatedImages, setGeneratedImages] = useState([]);

  // Fetch credits on component mount or when user changes
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        if (user?.email) {
          const response = await axios.get(`http://localhost:8000/check/credits/${user.email}`);
          setCredits(response.data.credit);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch credits');
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user?.email]);

  // Handlers
  const handleCreditUpdate = (newCredits) => {
    setCredits(newCredits);
    toast.success(`Credits updated! New balance: ${newCredits}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setGenerationError('Please enter a prompt');
      return;
    }
    
    if (credits <= 0) {
      setGenerationError('Insufficient credits. Please purchase more credits to generate images.');
      return;
    }
    
    setGenerating(true);
    setGenerationError(null);
    setGeneratedImage(null);

    try {
      const response = await axios.post('http://localhost:8000/generate/generate', 
        {
          prompt: prompt.trim(),
          userId: user._id
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.cloudinaryUrl) {
        setGeneratedImage(response.data.cloudinaryUrl);
        setGeneratedImages(prev => [...prev, {
          url: response.data.cloudinaryUrl,
          prompt: prompt,
          timestamp: new Date().toISOString()
        }]);
        const creditResponse = await axios.get(`http://localhost:8000/check/credits/${user.email}`);
        setCredits(creditResponse.data.credit);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (err) {
      console.error('Generation error:', err);
      toast.error(err.response?.data?.message || 'Failed to generate image');
      setGenerationError(
        err.response?.data?.message || 
        'Failed to generate image. Please try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <Toaster position="top-right" />
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={BackgroundImage} 
          alt="Background" 
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-600/30 backdrop-blur-sm" />
      </div>

      {/* Navigation */}
      <Navbar 
        user={user}
        credits={credits}
        loading={loading}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        openPaymentModal={() => setIsPaymentModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 border border-white/10 dark:border-gray-700/10 p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              Dashboard
            </h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-md text-red-200 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            <ImageGenerationForm 
              prompt={prompt}
              setPrompt={setPrompt}
              credits={credits}
              generating={generating}
              generatedImage={generatedImage}
              generationError={generationError}
              handleGenerateImage={handleGenerateImage}
            />

            <StatsGrid 
              loading={loading}
              credits={credits}
              generatedImages={generatedImages}
              openPaymentModal={() => setIsPaymentModalOpen(true)}
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handleCreditUpdate}
      />
    </div>
  );
};

export default Dashboard;