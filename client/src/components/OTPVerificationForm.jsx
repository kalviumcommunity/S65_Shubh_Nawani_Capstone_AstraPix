import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, ClipboardCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-hot-toast";

const OTPVerificationForm = ({
  email,
  otp,
  setOtp,
  isSubmitting,
  error,
  handleVerifyOTP,
  resendOTP,
}) => {
  const { darkMode } = useTheme();
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([...Array(6)].map(() => React.createRef()));

  const getToastOptions = (messageType = "success") => {
    const baseOptions = {
    };
    if (darkMode) {
      return {
        ...baseOptions,
        style: { background: "#333", color: "#fff" },
      };
    } else {
      let borderColor = "#d1d5db";
      if (messageType === "success") borderColor = "#34d399";
      if (messageType === "error") borderColor = "#f87171";
      return {
        ...baseOptions,
        style: {
          background: "#fff",
          color: "#1f2937",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      };
    }
  };


  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);

    if (pastedData) {
      setOtp(pastedData.padEnd(6, " ").slice(0,6));
      // Focus logic:
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  }, [setOtp]);


  const handleOTPChange = useCallback((e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtpArray = otp.split('');
      newOtpArray[index] = value;
      setOtp(newOtpArray.join(''));

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, [otp, setOtp]);


  const handleKeyDown = useCallback((e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);


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
    if (typeof resendOTP === 'function') {
        resendOTP();
    }
    setResendCountdown(30);
  };

  // Auto-focus first input on mount if OTP is empty
  useEffect(() => {
    if (inputRefs.current[0] && (!otp || otp.length === 0 || otp.split('').every(char => char === ''))) {
        inputRefs.current[0].current?.focus();
    }
  }, []); // Run once on mount


  return (
    <motion.div
      key="otp-form"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="p-3 sm:p-4 md:p-12 w-full max-w-md mx-auto"
    >
      <h2
        className={`
          text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4
          text-slate-800 /* Lighter */
          dark:text-white /* Original Darker */
        `}
      >
        Verify Email
      </h2>
      <p
        className={`
          text-xs sm:text-sm md:text-base mb-4 sm:mb-5 md:mb-6
          text-slate-600 /* Lighter */
          dark:text-white/80 /* Original Darker */
        `}
      >
        Please enter the 6-digit verification code sent to {email}
      </p>
      <form onSubmit={handleVerifyOTP} className="space-y-3 sm:space-y-4 md:space-y-6">
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
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
                  text-center text-lg sm:text-xl md:text-2xl font-bold 
                  rounded-lg focus:outline-none focus:ring-2 touch-manipulation
                  bg-slate-100 border border-slate-300 text-slate-900 focus:ring-violet-500 /* Lighter */
                  dark:bg-white/10 dark:border-transparent dark:text-white dark:focus:ring-purple-500 /* Original Darker */
                `}
                required
                maxLength={1}
                inputMode="numeric"
                pattern="\d"
                autoComplete="one-time-code"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          <p
            className={`
              text-xs text-center
              text-slate-500 /* Lighter */
              dark:text-white/50 /* Original Darker */
            `}
          >
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
              className={`
                inline-flex items-center gap-1 focus:outline-none focus:underline
                text-violet-600 hover:text-violet-500 /* Lighter */
                dark:text-purple-400 dark:hover:text-purple-300 /* Original Darker */
              `}
              aria-label="Paste code from clipboard"
            >
              <ClipboardCheck className="w-3 h-3" /> Paste from clipboard
            </button>
          </p>
        </div>

        {error && (
          <p
            className={`
              text-xs sm:text-sm role="alert"
              text-red-600 /* Lighter */
              dark:text-red-400 /* Original Darker */
            `}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !otp || otp.length !== 6 || otp.includes(' ')} // Check for full OTP
          className={`
            w-full py-2 sm:py-2.5 md:py-3 rounded-lg text-white font-semibold 
            hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base touch-manipulation 
            focus:outline-none focus:ring-2 focus:ring-offset-1
            bg-violet-600 hover:bg-violet-700 focus:ring-violet-500 focus:ring-offset-white /* Lighter */
            dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 dark:focus:ring-purple-400 dark:focus:ring-offset-purple-900 /* Original Darker */
          `}
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
        className={`
          w-full mt-3 sm:mt-4 py-1.5 sm:py-2 transition-colors 
          text-xs sm:text-sm touch-manipulation focus:outline-none focus:underline
          text-slate-600 hover:text-slate-800 disabled:text-slate-400 /* Lighter */
          dark:text-white/70 dark:hover:text-white dark:disabled:text-gray-500 /* Original Darker */
        `}
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
