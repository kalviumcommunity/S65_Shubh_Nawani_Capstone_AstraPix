import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:8000/api/forgot-password', { email });
      toast.success('Reset code sent to your email', {
        duration: 4000,
        icon: '📧'
      });
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code', {
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/verify-otp', {
        email,
        otp,
        newPassword
      });
      
      toast.success('Password updated successfully!', {
        duration: 4000,
        icon: '✅'
      });
      
      setTimeout(() => {
        toast.success('You can now login with your new password', {
          duration: 3000
        });
        onBack();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify code', {
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="p-8 md:p-12 col-span-2 md:col-span-1"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Reset Password</h2>
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}
      <button
        onClick={onBack}
        className="mt-4 text-white/70 hover:text-white text-sm transition-colors"
      >
        Back to Login
      </button>
    </motion.div>
  );
};

export default ForgotPasswordForm;
