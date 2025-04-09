import React, { useEffect, useState } from 'react';
import { Sun, Moon, CreditCard, ChevronDown, LogOut, UserCog, Home, Image, Palette, MessageSquareMore, QrCode, X, Menu } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from './Logo';
import { getInitialAvatar } from '../../utils/avatarUtils';
import qrCode from '../../assets/AstraPix_QR.jpg'; // Add this import
import toast from 'react-hot-toast'; // Add this import
import axios from 'axios';  // Add this import at the top
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ darkMode, toggleTheme, credits, loading, user, handleLogout, openPaymentModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { letter, bgColor } = getInitialAvatar(user?.email);
  const [currentUsername, setCurrentUsername] = useState(user?.username || 'User');
  const { logout } = useAuth();

  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account",
      icon: 'warning',
      background: '#1f2937',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'px-4 py-2 rounded-md',
        cancelButton: 'px-4 py-2 rounded-md'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Successfully logged out!', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#333',
            color: '#fff',
          },
        });
        
        setTimeout(() => {
          handleLogout();
        }, 1000);
      }
    });
  };

  const fetchUpdatedUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/users/${user.email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        // Remove toast from here since we'll handle it in handleEditUsername
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Increased delay to 2000ms
      }
    } catch (error) {
      console.error('Failed to fetch updated user data:', error);
    }
  };

  const handleEditUsername = async () => {
    Swal.fire({
      title: 'Edit Username',
      input: 'text',
      inputValue: currentUsername,
      inputAttributes: {
        autocapitalize: 'off',
        maxlength: 20
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#fff',
      customClass: {
        input: 'bg-gray-700 text-white border-gray-600 rounded-md',
        popup: 'rounded-lg',
        confirmButton: 'px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-600',
        cancelButton: 'px-4 py-2 rounded-md'
      },
      inputValidator: (value) => {
        if (!value) return 'Username cannot be empty!';
        if (value.length < 3) return 'Username must be at least 3 characters long!';
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URI}/api/update-username`,
            {
              email: user.email,
              newUsername: result.value
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          if (response.data.success) {
            // Close dropdown first
            setShowDropdown(false);
            
            // Update local state
            setCurrentUsername(result.value);
            
            // Show toast before fetching updated data
            toast.success('Username updated successfully!', {
              duration: 3000,
              position: 'top-center',
              style: { background: '#333', color: '#fff' },
            });

            // Wait a bit before fetching updated data
            setTimeout(async () => {
              await fetchUpdatedUserData();
            }, 500);
          } else {
            throw new Error(response.data.message || 'Failed to update username');
          }
        } catch (error) {
          console.error('Username update error:', error);
          toast.error(
            error.response?.data?.message || 
            error.message || 
            'Failed to update username. Please try again.',
            {
              duration: 3000,
              position: 'top-center',
              style: { background: '#333', color: '#fff' },
            }
          );
        }
      }
    });
  };

  const handleContactDev = () => {
    Swal.fire({
      title: 'Contact Developer',
      html: `
        <div class="space-y-4 p-4">
          <img 
            src="${qrCode}"
            alt="Developer Contact QR"
            class="mx-auto rounded-lg shadow-lg"
            style="width: 200px; height: 200px; object-fit: contain;"
          />
          <div class="text-center space-y-2 mt-4">
            <p class="text-gray-300">Scan to connect with the developer</p>
            <p class="text-gray-300 mt-2">Email: shunaw2006@gmail.com</p>
            <p class="text-gray-300">LinkedIn: linkedin.com/in/shubhnawani</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      background: '#1f2937',
      color: '#fff',
      customClass: {
        popup: 'rounded-lg',
        htmlContainer: 'overflow-hidden'
      }
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 bg-white/10 rounded-lg">
              <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              AstraPix
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a href="/" className="text-white/80 hover:text-white flex items-center space-x-1 group">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <a href="/gallery" className="text-white/80 hover:text-white flex items-center space-x-1 group">
              <Image className="w-4 h-4" />
              <span>Gallery</span>
            </a>
            <a href="/generate" className="text-white/80 hover:text-white flex items-center space-x-1 group">
              <Palette className="w-4 h-4" />
              <span>Create</span>
            </a>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Credits Button - Mobile Optimized */}
            <button
              onClick={openPaymentModal}
              className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-white text-sm sm:text-base transition-all hover:scale-105"
            >
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Credits: {loading ? '...' : credits}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
              >
                {user?.provider === 'google' && user?.avatar ? (
                  <img 
                    src={user.avatar}
                    alt={currentUsername}
                    className="w-7 h-7 rounded-full ring-2 ring-white/20"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUsername)}&background=random`;
                    }}
                  />
                ) : (
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium ${bgColor}`}
                    title={currentUsername}
                  >
                    {letter}
                  </div>
                )}
                <span className="text-white/90 text-sm font-medium hidden sm:inline-block">
                  {currentUsername}
                </span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>

              {/* Mobile-Friendly Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-white/10">
                  <button
                    onClick={handleEditUsername}
                    className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2"
                  >
                    <UserCog className="w-4 h-4" />
                    <span>Edit Username</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2"
                  >
                    {darkMode ? 
                      <><Sun className="w-4 h-4" /><span>Light Mode</span></> : 
                      <><Moon className="w-4 h-4" /><span>Dark Mode</span></>
                    }
                  </button>
                  <div className="h-px bg-white/10 my-1"></div>
                  <button
                    onClick={handleContactDev}
                    className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2"
                  >
                    <MessageSquareMore className="w-4 h-4" />
                    <span>Contact Developer</span>
                  </button>
                  <div className="h-px bg-white/10 my-1"></div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/95">
          <div className="flex flex-col h-full pt-16 pb-6 px-4">
            <div className="flex-1 overflow-y-auto space-y-2">
              {/* Mobile Navigation Items */}
              <a href="/" className="block py-3 px-4 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
              <a href="/gallery" className="block py-3 px-4 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3">
                <Image className="w-5 h-5" />
                <span>Gallery</span>
              </a>
              <a href="/generate" className="block py-3 px-4 text-white/90 hover:bg-white/5 rounded-lg flex items-center space-x-3">
                <Palette className="w-5 h-5" />
                <span>Create</span>
              </a>
            </div>

            {/* Mobile Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={openPaymentModal}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Credits: {loading ? '...' : credits}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;