import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Image, Check, Star, Crown, Rocket } from 'lucide-react';
import Logo from './common/Logo';
import Footer from './common/Footer';
import landingVideo from '../assets/Landing.mp4';

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const videoRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const throttleRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const throttledScrollHandler = useCallback(() => {
    if (!throttleRef.current) {
      throttleRef.current = true;
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollPosition / windowHeight, 1);
        setScrollProgress(progress);
        throttleRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [throttledScrollHandler]);

  useEffect(() => {
    const initVideo = async () => {
      if (videoRef.current && !isMobile) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
          // Retry with user interaction
          document.addEventListener('click', () => {
            videoRef.current?.play();
          }, { once: true });
        }
      }
    };

    initVideo();
    
    // Keep trying to play if video stops
    const handleVisibilityChange = () => {
      if (!document.hidden && videoRef.current?.paused && !isMobile) {
        videoRef.current?.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMobile]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        // Direct DOM manipulation for smoother cursor movement
        cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Prevent cursor from changing on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        target.style.cursor = 'none';
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered Generation",
      description: "Create stunning images using state-of-the-art AI models"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: "Secure Platform",
      description: "Your creations are protected with enterprise-grade security"
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: "Lightning Fast",
      description: "Generate images in seconds with our optimized infrastructure"
    },
    {
      icon: <Image className="w-6 h-6 text-purple-400" />,
      title: "High Quality Output",
      description: "Get professional-grade images ready for any use case"
    }
  ];

  const workflowSteps = [
    {
      title: "1. Enter Your Prompt",
      description: "Describe your vision in natural language",
      icon: <Star className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "2. Choose Your Style",
      description: "Select from various artistic styles and preferences",
      icon: <Image className="w-8 h-8 text-blue-400" />
    },
    {
      title: "3. Generate & Customize",
      description: "Fine-tune your results with our advanced tools",
      icon: <Zap className="w-8 h-8 text-purple-400" />
    },
    {
      title: "4. Download & Share",
      description: "Export in high resolution and share with the world",
      icon: <Rocket className="w-8 h-8 text-pink-400" />
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      features: ["20 generations/month", "Basic styles", "720p resolution", "Community support"],
      icon: <Star className="w-6 h-6" />,
      popular: false
    },
    {
      name: "Pro",
      price: "$19/mo",
      features: ["200 generations/month", "All styles", "4K resolution", "Priority support", "Custom styles"],
      icon: <Crown className="w-6 h-6" />,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited generations", "API access", "8K resolution", "Dedicated support", "Custom training"],
      icon: <Rocket className="w-6 h-6" />,
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Artist",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      content: "AstraPix has revolutionized my creative workflow. The AI-generated images are stunning!"
    },
    {
      name: "Mark Chen",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      content: "The speed and quality of images generated are unmatched. A game-changer for our campaigns."
    },
    {
      name: "Emily Rodriguez",
      role: "UI Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      content: "Perfect for quick mockups and creative inspiration. Couldn't work without it now!"
    }
  ];

  // Update scroll indicator visibility
  const showScrollIndicator = useCallback(() => {
    return !isMobile && window.scrollY < window.innerHeight;
  }, [isMobile]);

  // Update scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!throttleRef.current) {
        throttleRef.current = true;
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const progress = Math.min(scrollPosition / windowHeight, 1);
          setScrollProgress(progress);
          throttleRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden ${!isMobile ? 'cursor-none' : ''}`}>
      {/* Custom cursor - Only show on non-mobile */}
      {!isMobile && (
        <div
          ref={cursorRef}
          className="fixed pointer-events-none z-50"
          style={{
            width: '40px', // Increased from 32px
            height: '40px', // Increased from 32px
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-purple-500/80 animate-[spin_4s_linear_infinite] blur-[1px]" />
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full border-2 border-pink-400/90 animate-[spin_3s_linear_infinite_reverse]" />
          {/* Inner dot */}
          <div className="absolute inset-[16px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      )}
      
      {/* Remove Enhanced Radial Highlight div completely */}

      {/* Video Background - Show gradient background on mobile */}
      <div className="fixed inset-0 -z-10">
        {isMobile ? (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/50 to-black" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover brightness-110 contrast-110 sm:object-center object-right-center transform-gpu" // Added transform-gpu
              style={{ 
                willChange: 'transform, opacity',
                height: '100vh',
                width: '100vw',
                objectPosition: window.innerWidth < 640 ? '70%' : 'center', // Better mobile framing
                opacity: Math.max(0, 1 - scrollProgress * 1.5), // Fade out video
                transform: `scale(${1 + scrollProgress * 0.1}) translateZ(0)`, // Combined transform and added translateZ
                filter: scrollProgress > 0.1 ? `blur(${scrollProgress * 8}px)` : 'none', // Only apply blur after some scroll
              }}
              controlsList="nodownload nofullscreen noremoteplayback"
            >
              <source 
                src={landingVideo} 
                type="video/mp4" 
                onError={(e) => console.error("Video source error:", e)} 
              />
              Your browser does not support the video tag.
            </video>
          </>
        )}
        {/* Add an overlay that becomes more visible as user scrolls */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black to-purple-900/30 z-20"
          style={{
            opacity: scrollProgress * 0.8,
            transition: 'opacity 0.3s ease-out'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation - Add hover glow effect */}
        <nav className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md border-b border-white/10 z-50 cursor-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">  {/* Reduced from py-4 */}
            <div className="flex justify-between items-center">
              <motion.div 
                className="flex items-center cursor-none"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center space-x-3">
                  <Logo className="w-10 h-10" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      AstraPix
                    </span>
                    <span className="text-xs font-medium text-purple-400/80">
                      Generate. Create. Elevate.
                    </span>
                  </div>
                </div>
              </motion.div>
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 text-white/90 hover:text-white transition-all relative group cursor-none"
                  whileHover={{ scale: 1.05, cursor: 'none' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Sign In</span>
                  <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg relative group overflow-hidden cursor-none"
                  whileHover={{ scale: 1.05, cursor: 'none' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 translate-x-full group-hover:translate-x-0 transition-transform" />
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

        {/* Scroll Indicator - Only show when needed */}
        {showScrollIndicator() && (
          <motion.div 
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-none hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
              <motion.div 
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}

        {/* Add section transitions */}
        <div className="pt-16 cursor-none"> {/* Reduced from pt-20 */}
          {/* Hero Content */}
          <div className="min-h-[100vh] flex items-center justify-center relative">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                {/* Main Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="space-y-4"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold">
                    <span className="block text-white mb-2 sm:mb-4 [text-shadow:_0_4px_12px_rgba(0,0,0,0.5)] hover:text-purple-300 transition-colors duration-300">
                      Unleash Your
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-all duration-300 [text-shadow:_2px_2px_20px_rgba(168,85,247,0.4)]">
                      Creative Vision
                    </span>
                  </h1>
                </motion.div>

                {/* Enhanced description with better contrast and animation */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-200 leading-relaxed mb-8 px-4 [text-shadow:_0_2px_8px_rgba(0,0,0,0.5)]"
                >
                  Transform your ideas into stunning visuals with our 
                  <span className="text-purple-400 font-medium"> AI-powered platform</span>. 
                  Create unique, professional-grade artwork that captivates.
                </motion.p>

                {/* Enhanced CTA buttons with better hover effects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4"
                >
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 group transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  >
                    <span className="text-lg">Start Creating</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/gallery')}
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transform hover:scale-105 transition-all duration-300 border border-white/20 hover:border-purple-500/50"
                  >
                    <span className="text-lg">View Gallery</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Improved Workflow Section */}
          <div className="pt-24 sm:pt-32"> {/* Added padding to push content down */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  How It Works
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Create stunning visuals in just a few simple steps
                </p>
              </motion.div>

              {/* Step Cards with improved layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-black/50 transition-all cursor-none group"
                  >
                    <motion.div 
                      className="mb-4 transform-gpu group-hover:scale-110 transition-transform duration-300"
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] group-hover:text-gray-300 transition-colors">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Updated grid layouts for better mobile display */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-black/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6 
                    }
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 hover:border-purple-500/50 transition-all group transform-gpu"
                >
                  <motion.div 
                    className="mb-4 relative transform-gpu"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div 
                      className="absolute inset-0 bg-purple-500/20 rounded-full"
                      style={{ 
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                      }} 
                    />
                    <div className="relative z-10 transform-gpu">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Section with better mobile layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Select the perfect plan for your creative needs
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-4 lg:gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8 border ${
                    plan.popular ? 'border-purple-500' : 'border-white/20'
                  } relative hover:bg-black/50 transition-all cursor-none`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center justify-center mb-6">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{plan.name}</h3>
                  <p className="text-3xl font-bold text-purple-400 text-center mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{plan.price}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        <Check className="w-5 h-5 text-purple-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/auth')}
                    className={`w-full py-3 rounded-lg font-medium ${
                      plan.popular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    } transition-colors`}
                  >
                    Get Started
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Updated testimonials for mobile */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-black/20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white text-center mb-16 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            >
              What Our Users Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(168,85,247,0.2)",
                  }}
                  className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all group cursor-pointer cursor-none"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <motion.img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{testimonial.name}</h3>
                      <p className="text-purple-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] group-hover:text-white transition-colors">
                    {testimonial.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { number: "1M+", label: "Images Generated" },
                { number: "50K+", label: "Active Users" },
                { number: "4.9/5", label: "User Rating" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 cursor-none"
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 mb-0 cursor-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Start Creating?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using AstraPix to bring their ideas to life.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium cursor-none"
              >
                Get Started For Free
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer className="cursor-none border-t border-white/10" />
    </div>
  );
};

export default LandingPage;