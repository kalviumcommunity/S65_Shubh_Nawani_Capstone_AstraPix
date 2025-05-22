import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const formTransition = {
  duration: 0.2,
  ease: "easeInOut",
};

const ForgotPasswordForm = ({ onBack }) => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Focus first input when component mounts
  useEffect(() => {
    if (step === 1 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (!canResend && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [canResend, countdown]);

  // Auto-focus first OTP input when moving to step 2
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]?.current) {
      setTimeout(() => otpRefs.current[0].current.focus(), 100);
    }
  }, [step]);

  // Helper for themed toast styles
  const getToastOptions = (messageType = "success") => {
    const baseOptions = {
      // position is handled by Toaster component props
    };
    if (darkMode) {
      return {
        ...baseOptions,
        style: { background: "#333", color: "#fff" }, // Original dark toast
      };
    } else {
      let borderColor = "#d1d5db"; // Tailwind gray-300
      if (messageType === "success") borderColor = "#34d399"; // green-400
      if (messageType === "error") borderColor = "#f87171"; // red-400
      return {
        ...baseOptions,
        style: {
          background: "#fff",
          color: "#1f2937", // gray-800
          border: `1px solid ${borderColor}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      };
    }
  };


  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address", getToastOptions("error"));
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/forgot-password`,
        { email },
        { timeout: 8000 },
      );
      toast.success("OTP sent! Check your email.", getToastOptions("success"));
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP",
        getToastOptions("error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = useCallback(
    (index, value) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1].current.focus();
      } else if (value && index === 5) {
        passwordInputRef.current?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1].current.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text");
      const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");
      if (digits.length) {
        const newOtp = [...otp];
        digits.forEach((digit, index) => {
          if (index < 6) newOtp[index] = digit;
        });
        setOtp(newOtp);
        if (digits.length < 6) {
          otpRefs.current[digits.length].current.focus();
        } else {
          passwordInputRef.current?.focus();
        }
      }
    },
    [otp],
  );

  const handleResendOTP = async () => {
    if (!canResend || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/forgot-password`,
        { email },
        { timeout: 8000 },
      );
      toast.success("New OTP sent!", getToastOptions("success"));
      setCanResend(false);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0].current.focus(), 100);
    } catch (error) {
      toast.error("Failed to resend OTP", getToastOptions("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", getToastOptions("error"));
      otpRefs.current[0].current.focus();
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      toast.error(
        "Password must be between 8 and 16 characters",
        getToastOptions("error"),
      );
      passwordInputRef.current.focus();
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/auth/verify-otp`,
        { email, otp: otpString, newPassword },
        { timeout: 8000 },
      );
      if (response.data && response.status === 200) {
        toast.success(
          "Password updated successfully! Redirecting to login...",
          getToastOptions("success"),
        );
        setTimeout(() => onBack(), 1500);
      } else {
        toast.error(
          "Failed to reset password. Please try again.",
          getToastOptions("error"),
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Verification failed. Please try again.",
        getToastOptions("error"),
      );
      if (error.response?.status === 400) {
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0].current.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={formTransition}
      className="p-4 sm:p-6 md:p-12 col-span-2 md:col-span-1"
    >
      <Toaster
        position={window.innerWidth < 640 ? "bottom-center" : "top-right"}
      />
      <h2
        className={`
          text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4
          text-slate-800 /* Lighter theme */
          dark:text-white /* Original Darker theme */
        `}
      >
        {step === 1 ? "Reset Password" : "Verify OTP"}
      </h2>
      {step === 2 && (
        <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 md:mb-8">
          <p
            className={`
              text-xs sm:text-sm
              text-slate-600 /* Lighter theme */
              dark:text-white/70 /* Original Darker theme */
            `}
          >
            Enter the OTP sent to:
          </p>
          <p
            className={`
              font-medium text-sm sm:text-base md:text-lg px-2 sm:px-3 py-1.5 sm:py-2 rounded
              bg-slate-100 text-slate-700 border border-slate-200 /* Lighter theme */
              dark:bg-white/10 dark:text-white /* Original Darker theme */
            `}
          >
            {email}
          </p>
        </div>
      )}
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              ref={emailInputRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base
                focus:outline-none focus:ring-2 
                bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-violet-500 focus:border-violet-500 /* Lighter */
                dark:bg-white/10 dark:border-transparent dark:text-white dark:placeholder-white/50 dark:focus:ring-purple-500 /* Original Darker */
              `}
              required
              aria-required="true"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-2 sm:py-3 rounded-lg text-white font-medium sm:font-semibold 
              hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base touch-manipulation 
              focus:outline-none focus:ring-2 focus:ring-offset-1
              bg-violet-600 hover:bg-violet-700 focus:ring-violet-500 focus:ring-offset-white /* Lighter */
              dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 dark:focus:ring-purple-500 dark:focus:ring-offset-gray-900 /* Original Darker */
            `}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2
                className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto"
                aria-hidden="true"
              />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6">
          <div
            className="flex gap-1 sm:gap-2 justify-between mb-2 sm:mb-4"
            role="group"
            aria-labelledby="otp-label"
          >
            <span id="otp-label" className="sr-only">
              One-time password, 6 digits
            </span>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs.current[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`
                  w-9 h-9 sm:w-12 sm:h-12 text-center text-base sm:text-xl font-bold 
                  rounded-lg focus:outline-none focus:ring-2 touch-manipulation
                  bg-slate-100 border border-slate-300 text-slate-900 focus:ring-violet-500 /* Lighter */
                  dark:bg-white/10 dark:border-transparent dark:text-white dark:focus:ring-purple-500 /* Original Darker */
                `}
                required
                inputMode="numeric"
                pattern="\d"
                aria-label={`OTP digit ${index + 1}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
              />
            ))}
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isSubmitting}
              className={`
                text-xs sm:text-sm touch-manipulation focus:outline-none focus:underline
                text-violet-600 hover:text-violet-500 disabled:text-slate-400 /* Lighter */
                dark:text-purple-400 dark:hover:text-purple-300 dark:disabled:text-gray-500 /* Original Darker */
              `}
              aria-live="polite"
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
            </button>
          </div>
          <div>
            <label htmlFor="newPassword" className="sr-only">
              New Password
            </label>
            <input
              id="newPassword"
              ref={passwordInputRef}
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`
                w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm
                focus:outline-none focus:ring-2
                bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-violet-500 focus:border-violet-500 /* Lighter */
                dark:bg-white/10 dark:border-transparent dark:text-white dark:placeholder-white/50 dark:focus:ring-purple-500 /* Original Darker */
              `}
              required
              minLength={8}
              maxLength={16}
              aria-required="true"
              autoComplete="new-password"
            />
            <p
              className={`
                text-xs mt-1
                text-slate-500 /* Lighter */
                dark:text-white/50 /* Original Darker */
              `}
            >
              Password must be 8-16 characters
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-2 sm:py-3 rounded-lg text-white font-medium sm:font-semibold 
              hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base touch-manipulation 
              focus:outline-none focus:ring-2 focus:ring-offset-1
              bg-violet-600 hover:bg-violet-700 focus:ring-violet-500 focus:ring-offset-white /* Lighter */
              dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 dark:focus:ring-purple-500 dark:focus:ring-offset-gray-900 /* Original Darker */
            `}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2
                className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto"
                aria-hidden="true"
              />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
      <button
        onClick={onBack}
        className={`
          mt-3 sm:mt-4 text-xs sm:text-sm transition-colors touch-manipulation 
          focus:outline-none focus:underline
          text-slate-600 hover:text-slate-800 /* Lighter */
          dark:text-white/70 dark:hover:text-white /* Original Darker */
        `}
        type="button"
      >
        Back to Login
      </button>
    </motion.div>
  );
};

export default React.memo(ForgotPasswordForm);
