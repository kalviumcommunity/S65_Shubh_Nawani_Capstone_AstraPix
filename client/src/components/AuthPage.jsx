import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sun, Moon, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import BackgroundImage from '../assets/bg.jpg';
import Logo from './common/Logo';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthForm from './AuthForm';
import OTPVerificationForm from './OTPVerificationForm';

// Simplified animation variants
const pageTransition = {
  type: "tween",
  duration: 0.3
};

const floatingAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const AuthPage = () => {
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ email: '', password: '' });
    setShowOTPInput(false);
    setOtp('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (!isLogin) {
        const response = await axios.post('http://localhost:8000/api/verify/send-otp', {
          email: formData.email
        });
        setShowOTPInput(true);
        toast.success('OTP sent to your email!');
      } else {
        const response = await axios.post('http://localhost:8000/api/login', formData);
        login(response.data.token, response.data.user);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post('http://localhost:8000/api/verify/verify-otp', {
        email: formData.email,
        otp
      });

      const response = await axios.post('http://localhost:8000/api/signup', formData);
      login(response.data.token, response.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:8000/api/verify/send-otp', {
        email: formData.email
      });
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Background with simplified elements */}
      <div className="fixed inset-0 z-0">
        <img 
          src={BackgroundImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-600/50 backdrop-blur-sm" />
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? 
          <Sun className="text-white h-4 w-4 md:h-5 md:w-5" /> : 
          <Moon className="text-white h-4 w-4 md:h-5 md:w-5" />
        }
      </motion.button>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={pageTransition}
          className="w-full max-w-md md:max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLogin ? (
              <>
                {/* Welcome Panel */}
                <motion.div
                  key="welcome"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={pageTransition}
                  className="p-6 md:p-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"
                >
                  <Logo className="h-10 w-10 md:h-12 md:w-12 mb-6 md:mb-8" />
                  <div className="space-y-4 md:space-y-6">
                    <h1 className="text-2xl md:text-4xl font-bold text-white">
                      Welcome Back!
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg max-w-sm">
                      Sign in to continue your creative journey with AstraPix.
                    </p>
                    <motion.button
                      onClick={handleToggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 md:px-8 md:py-3 border-2 border-white/50 text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                      Create Account
                    </motion.button>
                  </div>
                </motion.div>

                {/* Login Form */}
                <AuthForm 
                  isLogin={true}
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isSubmitting={isSubmitting}
                  error={error}
                  handleGoogleLogin={handleGoogleLogin}
                />
              </>
            ) : (
              <>
                {/* Register Form */}
                {showOTPInput ? (
                  <OTPVerificationForm 
                    email={formData.email}
                    otp={otp}
                    setOtp={setOtp}
                    isSubmitting={isSubmitting}
                    error={error}
                    handleVerifyOTP={handleVerifyOTP}
                    resendOTP={resendOTP}
                  />
                ) : (
                  <AuthForm 
                    isLogin={false}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    isSubmitting={isSubmitting}
                    error={error}
                    handleGoogleLogin={handleGoogleLogin}
                  />
                )}

                {/* Welcome Register Panel */}
                <motion.div
                  key="welcome-register"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={pageTransition}
                  className="p-6 md:p-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"
                >
                  <Logo className="h-10 w-10 md:h-12 md:w-12 mb-6 md:mb-8" />
                  <div className="space-y-4 md:space-y-6">
                    <h1 className="text-2xl md:text-4xl font-bold text-white">
                      Start Your Journey
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg max-w-sm">
                      Already have an account? Sign in to continue your journey.
                    </p>
                    <motion.button
                      onClick={handleToggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 md:px-8 md:py-3 border-2 border-white/50 text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                      Sign In
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;