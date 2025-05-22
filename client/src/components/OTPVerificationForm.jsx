import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ClipboardCheck } from "lucide-react";

const OTPVerificationForm = ({
  email,
  otp,
  setOtp,
  isSubmitting,
  error,
  handleVerifyOTP,
  resendOTP,
}) => {
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  // Handle clipboard paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);

    if (pastedData) {
      // Fill available digits
      const newOtp = otp.split("");
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newOtp[i] = pastedData[i];
      }
      setOtp(newOtp.join(""));

      // Focus the next empty input or the last input if all filled
      const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtp = otp.split("");
      newOtp[index] = value;
      setOtp(newOtp.join(""));

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResendClick = () => {
    resendOTP();
    setResendCountdown(30); // Set a 30-second cooldown
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.length === 6 && !otp.includes("") && !isSubmitting) {
      // Optional: Auto-submit after a short delay
      // const timer = setTimeout(() => handleVerifyOTP(), 500);
      // return () => clearTimeout(timer);
    }
  }, [otp, isSubmitting]);

  return (
    <motion.div
      key="otp-form"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="p-3 sm:p-4 md:p-12 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
        Verify Email
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-white/80 mb-4 sm:mb-5 md:mb-6">
        Please enter the 6-digit verification code sent to {email}
      </p>
      <form
        onSubmit={handleVerifyOTP}
        className="space-y-3 sm:space-y-4 md:space-y-6"
      >
        <div className="flex flex-col space-y-2">
          <div className="flex gap-1 sm:gap-2 md:gap-4 justify-between">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={otp[index] || ""}
                onChange={(e) => handleOTPChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 rounded-lg text-white text-center text-lg sm:text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation"
                required
                maxLength={1}
                inputMode="numeric"
                pattern="\d"
                autoComplete="one-time-code"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-white/50 text-center">
            <button
              type="button"
              onClick={() =>
                navigator.clipboard.readText().then((text) => {
                  const pastedData = text.replace(/[^0-9]/g, "");
                  if (pastedData) {
                    const e = {
                      preventDefault: () => {},
                      clipboardData: { getData: () => pastedData },
                    };
                    handlePaste(e);
                  }
                })
              }
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 focus:outline-none focus:underline"
              aria-label="Paste code from clipboard"
            >
              <ClipboardCheck className="w-3 h-3" /> Paste from clipboard
            </button>
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-xs sm:text-sm" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !otp || otp.length !== 6}
          className="w-full py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base touch-manipulation focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-purple-900 focus:outline-none"
          aria-label={isSubmitting ? "Verifying OTP" : "Verify OTP"}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2
                className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2"
                aria-hidden="true"
              />
              Verifying...
            </span>
          ) : (
            "Verify OTP"
          )}
        </button>
      </form>

      <button
        onClick={handleResendClick}
        disabled={isSubmitting || resendCountdown > 0}
        className="w-full mt-3 sm:mt-4 py-1.5 sm:py-2 text-white/70 hover:text-white transition-colors text-xs sm:text-sm touch-manipulation focus:outline-none focus:underline"
        aria-label="Resend verification code"
      >
        {resendCountdown > 0
          ? `Resend OTP (${resendCountdown}s)`
          : "Resend OTP"}
      </button>
    </motion.div>
  );
};

export default OTPVerificationForm;
