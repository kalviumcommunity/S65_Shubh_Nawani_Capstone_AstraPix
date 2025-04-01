import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const OTPVerificationForm = ({
  email,
  otp,
  setOtp,
  isSubmitting,
  error,
  handleVerifyOTP,
  resendOTP
}) => {
  return (
    <motion.div
      key="otp-form"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-white mb-4">Verify Email</h2>
      <p className="text-white/80 mb-8">
        Please enter the verification code sent to {email}
      </p>
      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-base text-sm"
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 sm:text-base text-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>
      <button
        onClick={resendOTP}
        disabled={isSubmitting}
        className="w-full mt-4 py-2 text-white/70 hover:text-white transition-colors"
      >
        Resend OTP
      </button>
    </motion.div>
  );
};

export default OTPVerificationForm;