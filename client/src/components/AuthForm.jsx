import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import GoogleIcon from '../assets/google.png';

// Optimize motion animations
const pageTransition = {
  duration: 0.2,
  ease: "easeInOut"
};

const AuthForm = ({
  isLogin,
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  isSubmitting,
  error,
  handleGoogleLogin,
  onForgotPassword  // Add this prop
}) => {
  return (
    <motion.div
      key="auth-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={pageTransition}
      className="p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-base text-sm"
            required
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 sm:text-base text-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>
      <div className="mt-6">
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(AuthForm);