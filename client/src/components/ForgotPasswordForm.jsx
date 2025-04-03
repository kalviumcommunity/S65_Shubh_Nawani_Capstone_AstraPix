import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

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
      toast.success('OTP sent to your email! Please check your inbox.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8000/api/verify-otp', {
        email,
        otp,
        newPassword
      });
      toast.success('Password updated successfully! Redirecting to login...', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
      setTimeout(() => onBack(), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP or something went wrong. Please try again.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
        },
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
      <Toaster />
      <h2 className="text-3xl font-bold text-white mb-4">
        {step === 1 ? 'Reset Password' : 'Verify OTP'}
      </h2>
      {step === 2 && (
        <p className="text-white/70 mb-8">
          Enter the OTP sent to: <span className="text-white font-medium">{email}</span>
        </p>
      )}
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
