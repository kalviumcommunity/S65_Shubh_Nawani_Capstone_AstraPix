import React, { useState, useContext, useCallback } from 'react';
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
import ForgotPasswordForm from './ForgotPasswordForm.jsx';

// Simplified animation variants
const pageTransition = {
  type: "tween",
  duration: 0.15 // Reduced from 0.2
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Optimize form reset
  const handleToggle = useCallback(() => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ email: '', password: '' });
    setShowOTPInput(false);
    setOtp('');
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URI}/auth/google`;
  };

  // Add request timeout
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASE_URI}/api/${isLogin ? 'login' : 'send-otp'}`,
        data: isLogin ? formData : { email: formData.email },
        timeout: 8000
      });

      if (!isLogin) {
        setShowOTPInput(true);
        toast.success('OTP sent to your email!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        login(response.data.token, response.data.user);
        toast.success('Welcome back!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#333',
            color: '#fff',
          },
        });
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
      await axios.post(`${import.meta.env.VITE_BASE_URI}/api/verify-otp`, {
        email: formData.email,
        otp
      });

      const response = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/signup`, formData);
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
      await axios.post(`${import.meta.env.VITE_BASE_URI}/api/send-otp`, {
        email: formData.email
      });
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with optimized loading */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-600/50" />
      </div>

      {/* Theme Toggle - Better touch target */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors touch-manipulation"
      >
        {darkMode ? 
          <Sun className="w-5 h-5 text-white" /> : 
          <Moon className="w-5 h-5 text-white" />
        }
      </button>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md sm:max-w-xl md:max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            {!showForgotPassword ? (
              <>
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
                      onForgotPassword={handleForgotPassword}  // Add this prop
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
              </>
            ) : (
              <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(AuthPage);