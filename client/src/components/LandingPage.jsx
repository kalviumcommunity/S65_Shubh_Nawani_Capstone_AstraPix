import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Image,
  Check,
  Star,
  Crown,
  Rocket,
} from "lucide-react";
import Logo from "./common/Logo";
import Footer from "./common/Footer";
import LoadingAnimation from "./common/LoadingAnimation";
import landingVideo from "../assets/Landing.mp4";
import ChatBot from "./common/ChatBot";

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const videoRef = useRef(null);
  const throttleRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Simulate minimum loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Reduced from 3000 to 2000ms

    return () => clearTimeout(timer);
  }, []);

  // Optimized scroll handler with reduced calculations
  const throttledScrollHandler = useCallback(() => {
    if (!throttleRef.current) {
      throttleRef.current = true;
      // Use rAF to limit calculations to frame rate
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
    // Apply passive option to all scroll listeners
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler]);

  useEffect(() => {
    const initVideo = async () => {
      if (videoRef.current && !isMobile) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
          // Add one-time click listener to play video
          document.addEventListener(
            "click",
            () => {
              videoRef.current?.play();
            },
            { once: true, passive: true }
          );
        }
      }
    };

    initVideo();

    // Handle visibility changes to pause/play video
    const handleVisibilityChange = () => {
      if (!document.hidden && videoRef.current?.paused && !isMobile) {
        videoRef.current?.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isMobile]);

  // Add event listener for scroll to disable animations when scrolling
  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      if (shouldAnimate) {
        setShouldAnimate(false);
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setShouldAnimate(true);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [shouldAnimate]);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered Generation",
      description:
        "Create stunning images using state-of-the-art AI models with DALL-E 3 and Stable Diffusion XL integration. Achieve photorealistic quality and artistic excellence.",
      details: ["Next-gen AI models", "Custom style transfer", "Real-time preview"],
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: "Enterprise Security",
      description:
        "Your creations are protected with bank-grade encryption, secure cloud storage, and automated backups. GDPR compliant with full IP rights protection.",
      details: ["End-to-end encryption", "GDPR compliance", "IP protection"],
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: "Lightning Fast",
      description:
        "Generate images in seconds with our distributed cloud infrastructure. Optimized for both speed and quality, with smart caching and parallel processing.",
      details: ["< 5s generation time", "Global CDN", "Smart optimization"],
    },
    {
      icon: <Image className="w-6 h-6 text-purple-400" />,
      title: "Professional Quality",
      description:
        "Export in ultra-high resolution formats up to 8K. Advanced upscaling technology ensures crystal-clear details perfect for commercial use.",
      details: ["8K resolution", "RAW export", "Lossless quality"],
    },
  ];

  const workflowSteps = [
    {
      title: "1. Enter Your Prompt",
      description:
        "Unleash your imagination with natural language prompts. Whether you're thinking of a serene landscape, a futuristic cityscape, or an abstract concept, our AI understands context and artistic nuances to bring your vision to life.",
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      subpoints: [
        "Natural language understanding",
        "Context-aware processing",
        "Multi-style support",
      ],
      demoImages: [
        {
          src: "https://images.unsplash.com/photo-1543966888-7c1dc482a810?w=800&q=80",
          caption: "Write Your Vision",
        },
        {
          src: "https://images.unsplash.com/photo-1551651653-c5186a1fbba2?w=800&q=80",
          caption: "Let AI Create",
        },
      ],
    },
    {
      title: "2. Choose Your Style",
      description:
        "Explore a diverse palette of artistic styles. From Renaissance to Contemporary, Photorealistic to Abstract, customize every aspect of your creation with our extensive style library and fine-tuning options.",
      icon: <Image className="w-12 h-12 text-blue-400" />,
      subpoints: [
        "100+ artistic styles",
        "Custom style mixing",
        "Real-time preview",
      ],
      demoImages: [
        {
          src: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&q=80",
          caption: "Browse Styles",
        },
        {
          src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
          caption: "Apply Effects",
        },
      ],
    },
    {
      title: "3. Generate & Customize",
      description:
        "Watch as AI transforms your vision into reality. Fine-tune every detail with intuitive controls, adjust compositions, and explore variations until your artwork is perfect. Our advanced tools give you complete creative control.",
      icon: <Zap className="w-12 h-12 text-purple-400" />,
      subpoints: [
        "Real-time generation",
        "Advanced editing tools",
        "Unlimited variations",
      ],
      demoImages: [
        {
          src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
          caption: "Generate Art",
        },
        {
          src: "https://images.unsplash.com/photo-1558865869-c93f6f8482af?w=800&q=80",
          caption: "Fine-tune Details",
        },
      ],
    },
    {
      title: "4. Download & Share",
      description:
        "Export your masterpiece in ultra-high resolution formats ready for any use. Share directly to social media, download for commercial projects, or add to your portfolio. Your creations, your way.",
      icon: <Rocket className="w-12 h-12 text-pink-400" />,
      subpoints: [
        "Multiple export formats",
        "Social sharing",
        "Commercial licensing",
      ],
      demoImages: [
        {
          src: "https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80",
          caption: "Export Options",
        },
        {
          src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
          caption: "Share Artwork",
        },
      ],
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹0",
      features: [
        "15 generations/month",
        "720p resolution",
        "Basic art styles",
        "Community support",
        "24-hour generation queue",
        "Basic prompt assistance",
      ],
      icon: <Star className="w-6 h-6" />,
      popular: false,
      badge: "",
      description: "Perfect for hobbyists and beginners",
    },
    {
      name: "Creator",
      price: "₹999",
      features: [
        "150 generations/month",
        "2K resolution",
        "50+ art styles",
        "Priority support",
        "1-hour generation queue",
        "Advanced prompt builder",
      ],
      icon: <Image className="w-6 h-6" />,
      popular: true,
      badge: "Most Popular",
      description: "Ideal for content creators and artists",
    },
    {
      name: "Professional",
      price: "₹2,499",
      features: [
        "500 generations/month",
        "4K resolution",
        "All art styles",
        "24/7 priority support",
        "Instant generation",
        "Custom style training",
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: false,
      badge: "Best Value",
      description: "For professional artists and small teams",
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      features: [
        "Unlimited generations",
        "8K resolution",
        "Custom AI model training",
        "Dedicated account manager",
        "API access",
        "Custom integration support",
      ],
      icon: <Rocket className="w-6 h-6" />,
      popular: false,
      badge: "",
      description: "Tailored solutions for large organizations",
      enterprise: true,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Artist & Creative Director",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      content:
        "AstraPix has revolutionized my creative workflow. The AI understands artistic nuances I never thought possible. I've cut my concept art time by 70% while delivering better results to my clients.",
      company: "Artscape Studios",
      rating: 5,
      verifiedUser: true,
    },
    {
      name: "Mark Chen",
      role: "Senior Marketing Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      content:
        "The speed and quality of images generated are unmatched. We're creating entire campaigns in days instead of weeks. The ROI has been incredible - it's like having an entire design team at your fingertips.",
      company: "Global Innovations Inc.",
      rating: 5,
      verifiedUser: true,
    },
    {
      name: "Emily Rodriguez",
      role: "Lead UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      content:
        "Perfect for rapid prototyping and design iterations. The style consistency across generations is remarkable. We've integrated AstraPix into our daily design sprints with amazing results.",
      company: "TechForward Solutions",
      rating: 5,
      verifiedUser: true,
    },
  ];

  const showScrollIndicator = useCallback(() => {
    return !isMobile && window.scrollY < window.innerHeight;
  }, [isMobile]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden overscroll-none"
      style={{
        overscrollBehavior: "none",
        touchAction: "pan-y pinch-zoom",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <ChatBot />

      <div className="fixed inset-0 -z-10">
        {isMobile ? (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/50 to-black" />
        ) : (
          <>
            {/* Optimized gradient overlays with reduced opacity changes */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover sm:object-center object-right-center"
              style={{
                willChange: "transform, opacity",
                height: "100vh",
                width: "100vw",
                objectPosition: window.innerWidth < 640 ? "70%" : "center",
                // Simplified transform and effect properties
                opacity: Math.max(0, 1 - scrollProgress * 1.2),
                transform: `scale(${1 + scrollProgress * 0.05})`,
                // Apply blur only when scrolled significantly and only if not mobile
                filter:
                  scrollProgress > 0.2 && !isMobile
                    ? `blur(${Math.min(scrollProgress * 6, 6)}px)`
                    : "none",
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
        {/* Simpler gradient with fewer opacity changes */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black to-purple-900/30 z-20"
          style={{
            opacity: Math.min(0.8, scrollProgress * 0.7),
          }}
        />
      </div>

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-b border-white/10 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
            <div className="flex justify-between items-center">
              <motion.div
                // Remove unnecessary animations
                initial={{ opacity: 1 }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      AstraPix
                    </span>
                    <span className="text-xs font-medium text-purple-400/80 hidden sm:inline-block">
                      Generate. Create. Elevate.
                    </span>
                  </div>
                </div>
              </motion.div>
              <div className="flex items-center space-x-2 sm:space-x-4"></div>
            </div>
          </div>
        </nav>

        {showScrollIndicator() && (
          <motion.div 
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block"
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

        <div className="pt-16 sm:pt-20 space-y-16 sm:space-y-24 md:space-y-32 pb-16">
          <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              {/* Blurred Card Background */}
              <div
                className="
                  absolute inset-0
                  bg-white/10
                  backdrop-blur-lg
                  rounded-3xl
                  shadow-xl
                  z-0
                "
                aria-hidden="true"
              ></div>

              {/* Hero Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="space-y-2 sm:space-y-4 mb-8 sm:mb-12"
                >
                  <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-9xl font-serif relative">
                    {/* Blurred background just for the heading */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl rounded-3xl -z-10"></div>
                    <span className="block text-white mb-1 sm:mb-2 md:mb-4 transition-colors duration-300">
                      Unleash Your
                    </span>
                    <span className="block text-transparent bg-clip-text bg-white transition-all duration-300">
                      Creative <em>Vision</em>
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed mb-2 sm:mb-12 px-4 space-y-2 sm:space-y-4"
                >
                  <span className="block">
                    Transform your ideas into stunning visuals with our AI-powered platform.
                  </span>
                  <span className="block">
                    Create unique, professional-grade artwork that captivates.
                  </span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 px-4"
                >
                  <button
                    onClick={() => navigate("/auth")}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 group transform hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    <span className="text-base sm:text-lg">Start Creating</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/gallery")}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transform hover:scale-105 transition-all duration-300 hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <span className="text-base sm:text-lg">View Gallery</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                How It Works
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                Follow these simple steps to create stunning images with AstraPix:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {workflowSteps.map((step) => (
                <div
                  key={step.title}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 transition-all group hover:border-purple-400/30"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-500 mr-3">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-300 mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {step.subpoints.map((subpoint, index) => (
                      <span
                        key={index}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-500/10 rounded-full text-xs text-purple-300 border border-purple-500/20"
                      >
                        {subpoint}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    {step.demoImages.map((image, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <img
                          src={image.src}
                          alt={image.caption}
                          className="w-full h-auto rounded-lg shadow-md"
                          loading="lazy"
                          width="400"
                          height="300"
                          fetchpriority="low"
                        />
                        <p className="text-xs text-gray-400 text-center mt-1">
                          {image.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Pricing Plans
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                Choose the plan that best fits your needs. All plans include
                unlimited access to our AI image generation features.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`${
                    plan.popular ? "bg-purple-500/10" : "bg-black/40"
                  } rounded-xl p-4 sm:p-6 border border-white/20 transition-all group hover:border-purple-400/30`}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-500 mr-3">
                        {plan.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-purple-400">
                        {plan.popular && (
                          <span className="bg-purple-500/20 text-purple-500 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                            {plan.badge}
                          </span>
                        )}
                        <span className="font-bold text-white">
                          {plan.price}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-300"
                      >
                        <Check className="w-4 h-4 text-purple-400 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/auth")}
                      className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                What Our Users Say
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our users have to
                say about AstraPix:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 transition-all group hover:border-purple-400/30"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width="150"
                          height="150"
                          fetchpriority="low"
                        />
                      </div>
                      {testimonial.verifiedUser && (
                        <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white">
                          {testimonial.name}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-purple-400">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 italic group-hover:text-white transition-colors">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              {[
                { number: "1M+", label: "Images Generated" },
                { number: "50K+", label: "Active Users" },
                { number: "4.9/5", label: "User Rating" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    {stat.number}
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative">
              {/* Simple static gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-6">
                Ready to Start Creating?
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using AstraPix to
                bring their ideas to life.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Get Started For Free
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer className="border-t border-white/10" />
    </div>
  );
};

export default LandingPage;
