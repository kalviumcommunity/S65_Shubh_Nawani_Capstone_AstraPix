import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const LoadingAnimation = () => {
  // Pre-calculate particle positions to avoid recalculating on every render
  const particles = useMemo(() => {
    // Reduce number of particles for better performance
    const count = window.innerWidth < 768 ? 30 : 50;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100 + "%",
      initialY: Math.random() * 100 + "%",
      scale: Math.random() * 0.5 + 0.5,
      animationDuration: Math.random() * 3 + 2,
    }));
  }, []);

  // Memoize pulse rings
  const pulseRings = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
      role="alert"
      aria-live="polite"
      aria-label="Loading application"
    >
      {/* Background particles - with optimized rendering */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{
              left: particle.initialX,
              top: particle.initialY,
              willChange: "transform, opacity",
              contain: "layout",
              backfaceVisibility: "hidden",
            }}
            initial={{
              scale: particle.scale,
              opacity: 0,
            }}
            animate={{
              x: ["0%", "10%", "-10%", "0%"],
              y: ["0%", "-10%", "10%", "0%"],
              scale: [0.8, 1.5, 0.8],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.animationDuration,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center space-x-3 sm:space-x-8">
        {/* Outer rotating gradients - performance optimized */}
        <motion.div
          className="absolute -inset-20 sm:-inset-40 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 blur-3xl"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          aria-hidden="true"
        />

        {/* Pulsing rings with reduced DOM operations */}
        {pulseRings.map((ring) => (
          <motion.div
            key={ring.id}
            className="absolute -inset-16 sm:-inset-24 rounded-full border border-purple-500/20"
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 2,
              delay: ring.delay,
              repeat: Infinity,
              ease: "easeOut",
              repeatType: "loop",
            }}
            aria-hidden="true"
          />
        ))}

        {/* Logo and Text Container */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 70,
              damping: 15,
            }}
            className="relative"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            <div
              className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse"
              aria-hidden="true"
            />
            <Logo
              className="w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
              aria-label="AstraPix logo"
            />
          </motion.div>

          {/* Text animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-1 sm:space-y-2"
          >
            <motion.span
              className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 block drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
              style={{
                backgroundSize: "200% auto",
                willChange: "background-position",
              }}
            >
              AstraPix
            </motion.span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs sm:text-sm md:text-base text-purple-400/80 tracking-wider"
            >
              Generate. Create. Elevate.
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(LoadingAnimation);
