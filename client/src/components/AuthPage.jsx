import React, { useState, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Loader2, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import BackgroundImage from "../assets/bg.jpg";
import Logo from "./common/Logo";
import axios from "axios";
import { toast } from "react-hot-toast";
import AuthForm from "./AuthForm";
import OTPVerificationForm from "./OTPVerificationForm";
import ForgotPasswordForm from "./ForgotPasswordForm.jsx";

// Simplified animation variants
const pageTransition = {
    type: "tween",
    duration: 0.15, // Reduced from 0.2
};

const AuthPage = () => {
    const { login } = useAuth();
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();

    // Add a ref to track submission to prevent duplicate requests
    const isSubmittingRef = useRef(false);

    // Optimize form reset with proper dependency
    const handleToggle = useCallback(() => {
        setIsLogin(!isLogin);
        setError(null);
        setFormData({ email: "", password: "" });
        setShowOTPInput(false);
        setOtp("");
    }, [isLogin]);

    // Memoize form change handler
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    }, []);

    const handleGoogleLogin = useCallback(() => {
        window.location.href = `${import.meta.env.VITE_BASE_URI}/auth/google`;
    }, []);

    // Add request timeout and improved error handling
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (isSubmitting || isSubmittingRef.current) return;

            setIsSubmitting(true);
            isSubmittingRef.current = true;
            setError(null);

            try {
                const response = await axios({
                    method: "post",
                    url: `${import.meta.env.VITE_BASE_URI}/api/${isLogin ? "login" : "send-otp"}`,
                    data: isLogin ? formData : { email: formData.email },
                    timeout: 8000,
                });

                if (!isLogin) {
                    setShowOTPInput(true);
                    toast.success("OTP sent to your email!", {
                        duration: 5000,
                        position: "top-center",
                        style: {
                            background: "#333",
                            color: "#fff",
                        },
                    });
                } else {
                    login(response.data.token, response.data.user);
                    toast.success("Welcome back!", {
                        duration: 5000,
                        position: "top-center",
                        style: {
                            background: "#333",
                            color: "#fff",
                        },
                    });
                    navigate("/dashboard");
                }
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    (err.code === "ECONNABORTED"
                        ? "Request timed out"
                        : "Something went wrong");
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
                isSubmittingRef.current = false;
            }
        },
        [isLogin, formData, login, navigate],
    );

    const handleVerifyOTP = useCallback(
        async (e) => {
            e.preventDefault();
            if (isSubmitting || isSubmittingRef.current) return;

            setIsSubmitting(true);
            isSubmittingRef.current = true;
            setError(null);

            try {
                await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/api/verify-otp`,
                    {
                        email: formData.email,
                        otp,
                    },
                );

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/api/signup`,
                    formData,
                );
                login(response.data.token, response.data.user);
                toast.success("Account created successfully!");
                navigate("/dashboard");
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    (err.code === "ECONNABORTED"
                        ? "Request timed out"
                        : "Something went wrong");
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
                isSubmittingRef.current = false;
            }
        },
        [formData, otp, login, navigate],
    );

    const resendOTP = useCallback(async () => {
        if (isSubmitting || isSubmittingRef.current) return;

        setIsSubmitting(true);
        isSubmittingRef.current = true;

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URI}/api/send-otp`, {
                email: formData.email,
            });
            toast.success("New OTP sent!");
        } catch (err) {
            toast.error("Failed to send OTP");
        } finally {
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    }, [formData.email, isSubmitting]);

    const handleForgotPassword = useCallback(() => {
        setShowForgotPassword(true);
    }, []);

    const handleBackToLogin = useCallback(() => {
        setShowForgotPassword(false);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden overscroll-none">
            {/* Back to Landing button with improved visibility */}
            <button
                onClick={() => navigate("/")}
                className="fixed top-4 left-4 z-50 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 transition-all text-white flex items-center gap-2 touch-manipulation font-semibold shadow-lg"
            >
                <span className="text-lg">←</span>
                <span>Return to Landing</span>
            </button>

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${BackgroundImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-600/50" />
            </div>

            {/* Theme Toggle - Better touch target */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors touch-manipulation"
                aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
            >
                {darkMode ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
            </button>

            {/* Main Container */}
            <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-sm sm:max-w-xl md:max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl"
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
                                            className="p-4 sm:p-6 md:p-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"
                                        >
                                            <Logo className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-4 sm:mb-6 md:mb-8" />
                                            <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                                                    Welcome Back!
                                                </h1>
                                                <p className="text-white/80 text-xs sm:text-sm md:text-lg max-w-sm">
                                                    Sign in to continue your
                                                    creative journey with
                                                    AstraPix.
                                                </p>
                                                <motion.button
                                                    onClick={handleToggle}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 sm:px-6 py-1.5 sm:py-2 md:px-8 md:py-3 border-2 border-white/50 text-white rounded-lg hover:bg-white/10 transition-all touch-manipulation"
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
                                            handleGoogleLogin={
                                                handleGoogleLogin
                                            }
                                            onForgotPassword={
                                                handleForgotPassword
                                            }
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
                                                handleVerifyOTP={
                                                    handleVerifyOTP
                                                }
                                                resendOTP={resendOTP}
                                            />
                                        ) : (
                                            <AuthForm
                                                isLogin={false}
                                                formData={formData}
                                                handleChange={handleChange}
                                                handleSubmit={handleSubmit}
                                                showPassword={showPassword}
                                                setShowPassword={
                                                    setShowPassword
                                                }
                                                isSubmitting={isSubmitting}
                                                error={error}
                                                handleGoogleLogin={
                                                    handleGoogleLogin
                                                }
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
                                                    Already have an account?
                                                    Sign in to continue your
                                                    journey.
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
                            <ForgotPasswordForm onBack={handleBackToLogin} />
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default React.memo(AuthPage);
