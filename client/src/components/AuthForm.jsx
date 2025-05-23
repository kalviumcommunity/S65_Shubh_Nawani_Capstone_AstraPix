import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import GoogleIcon from "../assets/google.png";
import { useTheme } from "../context/ThemeContext";

const pageTransition = {
  duration: 0.2,
  ease: "easeInOut",
};

const AuthForm = ({
  isLogin,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  error,
  handleGoogleLogin,
  onForgotPassword,
}) => {
  const { darkMode } = useTheme();
  const [passwordError, setPasswordError] = useState("");

  // Callbacks and memos remain the same as your original
  const passwordValidation = useMemo(() => {
    return { minLength: 8, maxLength: 16 };
  }, []);

  const handlePasswordChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (
        !isLogin &&
        (value.length < passwordValidation.minLength ||
          value.length > passwordValidation.maxLength)
      ) {
        setPasswordError(
          `Password must be between ${passwordValidation.minLength} and ${passwordValidation.maxLength} characters`,
        );
      } else {
        setPasswordError("");
      }
      handleChange(e);
    },
    [isLogin, handleChange, passwordValidation],
  );

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (
        !isLogin &&
        (formData.password.length < passwordValidation.minLength ||
          formData.password.length > passwordValidation.maxLength)
      ) {
        setPasswordError(
          `Password must be between ${passwordValidation.minLength} and ${passwordValidation.maxLength} characters`,
        );
        return;
      }
      handleSubmit(e);
    },
    [isLogin, formData.password, handleSubmit, passwordValidation],
  );

  const buttonText = useMemo(() => {
    if (isSubmitting) return null;
    return isLogin ? "Sign In" : "Create Account";
  }, [isLogin, isSubmitting]);

  const passwordHintText = useMemo(() => {
    return (
      passwordError ||
      `Password must be between ${passwordValidation.minLength} and ${passwordValidation.maxLength} characters`
    );
  }, [passwordError, passwordValidation]);


  return (
    <motion.div
      key="auth-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={pageTransition}
      className="p-3 sm:p-4 md:p-12 w-full max-w-md mx-auto" // Parent in AuthPage handles bg
    >
      <h2
        className={`
          text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8
          text-slate-800 /* Lighter theme text */
          dark:text-white /* Original Darker theme text */
        `}
      >
        {isLogin ? "Sign In" : "Create Account"}
      </h2>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-3 sm:space-y-4 md:space-y-6"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Email Input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`
              w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg 
              text-sm sm:text-base focus:outline-none focus:ring-2 
              bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 /* Lighter theme */
              dark:bg-white/10 dark:border-transparent dark:text-white dark:placeholder-white/50 dark:focus:ring-purple-500 /* Original Darker theme */
            `}
            required
            autoComplete="email"
            aria-label="Email"
            autoCapitalize="off"
          />
          {/* Password Input */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className={`
                  w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg 
                  text-sm sm:text-base focus:outline-none focus:ring-2
                  bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 /* Lighter theme */
                  dark:bg-white/10 dark:border-transparent dark:text-white dark:placeholder-white/50 dark:focus:ring-purple-500 /* Original Darker theme */
                `}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-label="Password"
                aria-invalid={!!passwordError}
                aria-describedby={!isLogin ? "password-requirements" : undefined}
              />
            </div>
            {/* Password Hint */}
            {!isLogin && (
              <p
                id="password-requirements"
                className={`
                  text-xs 
                  ${passwordError ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-white/50"}
                `}
              >
                {passwordHintText}
              </p>
            )}
          </div>
        </div>

        {/* Forgot Password Button */}
        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className={`
                text-xs sm:text-sm transition-colors touch-manipulation
                text-purple-600 hover:text-purple-700 font-medium /* Lighter theme */
                dark:text-white/70 dark:hover:text-white /* Original Darker theme */
              `}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p
            className={`
              text-xs sm:text-sm
              text-red-600 /* Lighter theme */
              dark:text-red-400 /* Original Darker theme */
            `}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold 
            transition-all text-sm sm:text-base touch-manipulation
            bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-400 /* Lighter theme */
            dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 dark:text-white dark:hover:opacity-90 dark:disabled:opacity-50 /* Original Darker theme */
          `}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2
              className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto"
              aria-hidden="true"
            />
          ) : (
            buttonText
          )}
        </button>
      </form>
      
      {/* Google Login Button */}
      <div className="mt-4 sm:mt-6">
        <button
          onClick={handleGoogleLogin}
          className={`
            w-full py-2 sm:py-2.5 md:py-3 rounded-lg font-medium sm:font-semibold 
            transition-all flex items-center justify-center gap-1.5 sm:gap-2 touch-manipulation
            bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm /* Lighter theme */
            dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-transparent /* Original Darker theme */
          `}
          type="button"
          aria-label="Continue with Google"
        >
          <img
            src={GoogleIcon}
            alt=""
            className="w-4 h-4 sm:w-5 sm:h-5"
            aria-hidden="true"
          />
          <span className="text-sm sm:text-base">Continue with Google</span>
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(AuthForm);
