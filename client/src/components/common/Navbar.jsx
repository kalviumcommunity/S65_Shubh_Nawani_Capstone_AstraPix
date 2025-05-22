import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Sun,
    Moon,
    CreditCard,
    ChevronDown,
    LogOut,
    UserCog,
    Home,
    Image,
    Palette,
    MessageSquareMore,
    QrCode,
    X,
    Menu,
} from "lucide-react";
import Swal from "sweetalert2";
import Logo from "./Logo";
import { getInitialAvatar } from "../../utils/avatarUtils";
import qrCode from "../../assets/AstraPix_QR.svg";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const Navbar = ({
    darkMode,
    toggleTheme,
    credits,
    loading,
    user,
    handleLogout,
    openPaymentModal,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentUsername, setCurrentUsername] = useState(() => {
        if (user?.username) return user.username;
        if (!localStorage.getItem("userData")) {
            return user?.email ? user.email.split("@")[0] : "Guest";
        }
        const userData = JSON.parse(localStorage.getItem("userData"));
        return userData?.username || user?.email?.split("@")[0] || "Guest";
    });
    const [avatarInfo, setAvatarInfo] = useState(() =>
        getInitialAvatar(currentUsername),
    );
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Refs to track mounted state and manage event listeners
    const dropdownRef = useRef(null);

    // Update avatar when username changes
    useEffect(() => {
        setAvatarInfo(getInitialAvatar(currentUsername));
    }, [currentUsername]);

    // Handle clicks outside dropdown
    useEffect(() => {
        if (!showDropdown) return;

        const handleOutsideClick = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [showDropdown]);

    // Cleanup for logout confirmation
    useEffect(() => {
        return () => {
            if (showLogoutConfirm) {
                setShowLogoutConfirm(false);
                setIsLoggingOut(false);
            }
        };
    }, [showLogoutConfirm]);

    const handleLogoutClick = useCallback((e) => {
        e.stopPropagation(); // Prevent dropdown from closing
        setShowLogoutConfirm(true);
    }, []);

    const confirmLogout = useCallback(async () => {
        setIsLoggingOut(true);

        try {
            // Step 1: Initial delay with loading message
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Step 2: Show signing out message
            setShowLogoutConfirm(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Step 3: Clear local data with delay
            localStorage.removeItem("token");
            await new Promise((resolve) => setTimeout(resolve, 700));

            // Step 4: Final logout
            await handleLogout();
        } catch (error) {
            setIsLoggingOut(false);
            setShowLogoutConfirm(false);
            toast.error("Failed to sign out. Please try again.");
        }
    }, [handleLogout]);

    const updateUsername = async (newUsername) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URI}/api/update-username`,
                {
                    email: user.email,
                    newUsername,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.data.success) {
                // Update local state
                setCurrentUsername(newUsername);
                setAvatarInfo(getInitialAvatar(newUsername));

                // Update user data in localStorage
                try {
                    const token = localStorage.getItem("token");
                    const currentUser = { ...user, username: newUsername };
                    localStorage.setItem(
                        "userData",
                        JSON.stringify(currentUser),
                    );
                } catch (err) {
                    console.error("Failed to update local storage:", err);
                }

                toast.success("Username updated successfully!");
                setShowDropdown(false);
                return true;
            } else {
                throw new Error(
                    response.data.message || "Failed to update username",
                );
            }
        } catch (error) {
            console.error("Username update error:", error);
            toast.error(
                error.response?.data?.message || "Failed to update username",
            );
            return false;
        }
    };

    const handleEditUsername = useCallback(() => {
        Swal.fire({
            title: "Edit Username",
            input: "text",
            inputValue: currentUsername,
            inputAttributes: {
                autocapitalize: "off",
                maxlength: 20,
            },
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            background: "#1f2937",
            color: "#fff",
            customClass: {
                input: "bg-gray-700 text-white border-gray-600 rounded-md",
                popup: "rounded-lg",
                confirmButton:
                    "px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-600",
                cancelButton: "px-4 py-2 rounded-md",
            },
            inputValidator: (value) => {
                if (!value) return "Username cannot be empty!";
                if (value.length < 3)
                    return "Username must be at least 3 characters long!";
            },
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                await updateUsername(result.value);
            }
        });
    }, [currentUsername]);

    const handleContactDev = useCallback(() => {
        Swal.fire({
            title: "Connect with Developer",
            html: `
        <div class="flex flex-col items-center justify-center space-y-6 p-4">
          <div class="flex justify-center items-center bg-white rounded-lg p-4 mx-auto">
            <img 
              src="${qrCode}"
              alt="Developer Contact QR"
              class="w-48 h-48 object-contain"
            />
          </div>
          
          <div class="text-center space-y-4">
            <h3 class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Shubh Nawani
            </h3>
            <p class="text-gray-300 font-medium">Full Stack Developer & AI Enthusiast</p>
            
            <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <a href="mailto:shunaw2006@gmail.com" 
                 class="group flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
                <span class="text-white group-hover:scale-105 transition-transform flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  Email
                </span>
              </a>
              <a href="https://github.com/shubhnw" 
                 target="_blank"
                 class="group flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg hover:from-gray-700/70 hover:to-gray-600/70 transition-all duration-300">
                <span class="text-white group-hover:scale-105 transition-transform flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </span>
              </a>
              <a href="https://linkedin.com/in/shubhnawani" 
                 target="_blank"
                 class="group flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg hover:from-blue-600/30 hover:to-blue-500/30 transition-all duration-300">
                <span class="text-white group-hover:scale-105 transition-transform flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </span>
              </a>
              <a href="https://twitter.com/shubhnw" 
                 target="_blank"
                 class="group flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-blue-300/20 rounded-lg hover:from-blue-400/30 hover:to-blue-300/30 transition-all duration-300">
                <span class="text-white group-hover:scale-105 transition-transform flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                  </svg>
                  Twitter
                </span>
              </a>
            </div>
            
            <p class="text-xs text-gray-400 mt-4">Available for freelance opportunities</p>
          </div>
        </div>
      `,
            showCloseButton: true,
            showConfirmButton: false,
            background: "#1f2937",
            color: "#fff",
            width: "auto",
            customClass: {
                popup: "rounded-xl max-w-md mx-auto",
                closeButton:
                    "focus:outline-none hover:text-purple-400 transition-colors",
                htmlContainer: "overflow-hidden",
                container: "flex items-center min-h-screen",
            },
            didOpen: () => {
                // Force center alignment
                document.querySelector(".swal2-popup").style.margin = "auto";
            },
        });
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-2 sm:px-6">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo and Brand */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                    >
                        <div className="p-1 bg-white/10 rounded-lg">
                            <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            AstraPix
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
                        <Link
                            to="/"
                            className="text-white/80 hover:text-white flex items-center space-x-1 group cursor-pointer"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/gallery"
                            className="text-white/80 hover:text-white flex items-center space-x-1 group cursor-pointer"
                        >
                            <Image className="w-4 h-4" />
                            <span>Gallery</span>
                        </Link>
                        <Link
                            to="/generate"
                            className="text-white/80 hover:text-white flex items-center space-x-1 group cursor-pointer"
                        >
                            <Palette className="w-4 h-4" />
                            <span>Create</span>
                        </Link>
                    </div>

                    {/* Right Side Items */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Credits Button - Mobile Optimized */}
                        <button
                            onClick={openPaymentModal}
                            className="hidden sm:flex items-center space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-white text-xs sm:text-base transition-all hover:scale-105 touch-manipulation"
                        >
                            <CreditCard className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            <span>Credits: {loading ? "..." : credits}</span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="flex items-center space-x-2">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                    className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 touch-manipulation"
                                    aria-expanded={showDropdown}
                                    aria-haspopup="true"
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape")
                                            setShowDropdown(false);
                                    }}
                                >
                                    {user?.provider === "google" &&
                                    user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={currentUsername}
                                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-white/20"
                                        />
                                    ) : (
                                        <div
                                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium ${avatarInfo.bgColor}`}
                                            title={currentUsername}
                                        >
                                            {avatarInfo.letter}
                                        </div>
                                    )}
                                    <span className="text-white/90 text-xs sm:text-sm font-medium hidden sm:inline-block">
                                        {currentUsername}
                                    </span>
                                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div
                                        className="absolute right-0 mt-2 w-44 sm:w-56 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl py-2 z-50 border border-white/10"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <button
                                            onClick={handleEditUsername}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2 touch-manipulation"
                                            role="menuitem"
                                        >
                                            <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm">
                                                Edit Username
                                            </span>
                                        </button>
                                        <button
                                            onClick={toggleTheme}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2 touch-manipulation"
                                            role="menuitem"
                                        >
                                            {darkMode ? (
                                                <>
                                                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="text-xs sm:text-sm">
                                                        Light Mode
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="text-xs sm:text-sm">
                                                        Dark Mode
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                        <div className="h-px bg-white/10 my-1"></div>
                                        <button
                                            onClick={handleContactDev}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2 touch-manipulation"
                                            role="menuitem"
                                        >
                                            <MessageSquareMore className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm">
                                                Contact Developer
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Elegant Logout Button */}
                            <div className="relative">
                                <button
                                    onClick={handleLogoutClick}
                                    disabled={isLoggingOut}
                                    className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-all duration-200 disabled:opacity-50 touch-manipulation"
                                    title="Sign out"
                                    aria-label="Sign out"
                                >
                                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>

                                {/* Enhanced Logout Confirmation */}
                                {showLogoutConfirm && (
                                    <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 p-3 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-lg border border-red-500/20 shadow-xl transform transition-all duration-300 ease-out">
                                        <p className="text-white/90 text-xs sm:text-sm mb-3">
                                            {isLoggingOut ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse" />
                                                    Securely signing you out...
                                                </span>
                                            ) : (
                                                "Are you sure you want to sign out?"
                                            )}
                                        </p>
                                        <div className="flex items-center justify-end space-x-2">
                                            {!isLoggingOut && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowLogoutConfirm(
                                                            false,
                                                        );
                                                    }}
                                                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-white/70 hover:text-white transition-colors touch-manipulation"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={confirmLogout}
                                                disabled={isLoggingOut}
                                                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md flex items-center space-x-1 sm:space-x-2 transition-all duration-200 disabled:opacity-50 min-w-[70px] sm:min-w-[80px] justify-center touch-manipulation"
                                            >
                                                {isLoggingOut ? (
                                                    <>
                                                        <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        <span className="text-xs">
                                                            Please wait...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogOut className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        <span className="text-xs">
                                                            Confirm
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors touch-manipulation"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? (
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900 border-b border-white/10">
                    <div className="px-4 py-3">
                        {/* Mobile Navigation Items */}
                        <div className="space-y-1">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2.5 px-3 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3"
                            >
                                <Home className="w-5 h-5" />
                                <span>Home</span>
                            </Link>
                            <Link
                                to="/gallery"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2.5 px-3 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3"
                            >
                                <Image className="w-5 h-5" />
                                <span>Gallery</span>
                            </Link>
                            <Link
                                to="/generate"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2.5 px-3 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3"
                            >
                                <Palette className="w-5 h-5" />
                                <span>Create</span>
                            </Link>
                        </div>

                        <div className="h-px bg-white/10 my-3" />

                        {/* Mobile Actions */}
                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    toggleTheme();
                                }}
                                className="w-full py-2.5 px-3 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3"
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                                <span>
                                    {darkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleContactDev();
                                }}
                                className="w-full py-2.5 px-3 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3"
                            >
                                <MessageSquareMore className="w-5 h-5" />
                                <span>Contact Developer</span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    openPaymentModal();
                                }}
                                className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-lg flex items-center justify-center space-x-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>
                                    Credits: {loading ? "..." : credits}
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogoutClick();
                                }}
                                className="w-full mt-2 py-2.5 px-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg flex items-center justify-center space-x-2"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default React.memo(Navbar);
