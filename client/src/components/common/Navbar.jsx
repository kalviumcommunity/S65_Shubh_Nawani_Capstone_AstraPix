import React, { useEffect, useState } from 'react';
import { Sun, Moon, CreditCard, ChevronDown, LogOut, UserCog, Home, Image, Palette, MessageSquareMore, QrCode } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from './Logo';
import { getInitialAvatar } from '../../utils/avatarUtils';
import qrCode from '../../assets/AstraPix_QR.jpg'; // Add this import
import toast from 'react-hot-toast'; // Add this import
import axios from 'axios';  // Add this import at the top

const Navbar = ({ darkMode, toggleTheme, credits, loading, user, handleLogout, openPaymentModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const { letter, bgColor } = getInitialAvatar(user?.email);
  const [currentUsername, setCurrentUsername] = useState(user?.username || 'User');

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
      allowOutsideClick: false,  // Add this line
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'px-4 py-2 rounded-md',
        cancelButton: 'px-4 py-2 rounded-md'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();  // Remove the toast and setTimeout here
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
        window.location.reload(); // Force reload to update all components
      }
    } catch (error) {
      console.error('Failed to fetch updated user data:', error);
    }
  };

  const handleEditUsername = () => {
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
          const response = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/update-username`, {
            email: user.email,
            newUsername: result.value
          });

          if (response.data.success) {
            // Update local state immediately
            setCurrentUsername(result.value);
            
            // Update localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            userData.username = result.value;
            localStorage.setItem('userData', JSON.stringify(userData));

            toast.success('Username updated successfully!', {
              duration: 2000,
              position: 'top-center',
              style: { background: '#333', color: '#fff' },
            });

            // Close dropdown
            setShowDropdown(false);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to update username', {
            duration: 2000,
            position: 'top-center',
            style: { background: '#333', color: '#fff' },
          });
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
    <nav className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 transition-all duration-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-1 bg-white/10 rounded-lg">
              <Logo className="w-6 h-6 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              AstraPix
            </h1>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200 hover:scale-105"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>

          {/* Right Side Navigation Items */}
          <div className={`flex-col sm:flex-row sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-6 ${isMenuOpen ? 'flex' : 'hidden'} sm:flex`}>
            {/* Credits Button */}
            <button
              onClick={openPaymentModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base hover:scale-105"
              title="Purchase Credits"
            >
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Credits: {loading ? '...' : credits}</span>
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

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-white/10">
                  <button
                    onClick={handleEditUsername}
                    className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 flex items-center space-x-2"
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

          {/* Mobile Menu Items */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-x-0 top-16 bg-gray-800/95 backdrop-blur-md p-4 space-y-3">
              <a href="/" className="block text-white/80 hover:text-white py-2 flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>
              <a href="/gallery" className="block text-white/80 hover:text-white py-2 flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>Gallery</span>
              </a>
              <a href="/generate" className="block text-white/80 hover:text-white py-2 flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Create</span>
              </a>
            </div>
          )}
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;