import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react'; // Keep original imports

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Keep original timer frequency
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoize the scrollToTop function for better performance
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer className="bg-gray-900/50 backdrop-blur-md border-t border-white/5 text-white">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {/* Company Section */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">AstraPix Inc.</h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-[200px] sm:max-w-none">
                Transforming imagination into reality through AI-powered image generation.
              </p>
            </div>

            {/* Navigation Sections */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">Quick Links</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Home</Link></li>
                <li><Link to="/gallery" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Gallery</Link></li>
                <li><Link to="/pricing" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Pricing</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">Support</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/help" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Help Center</Link></li>
                <li><Link to="/docs" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Documentation</Link></li>
                <li><Link to="/contact" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Contact Us</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">Legal</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/privacy" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Privacy Policy</Link></li>
                <li><Link to="/terms" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Terms of Service</Link></li>
                <li><Link to="/sitemap" onClick={scrollToTop} className="text-white/70 hover:text-white transition-colors cursor-pointer block">Sitemap</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright with System Status and Time */}
          <div className="mt-5 sm:mt-8 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <div className="text-xs sm:text-sm text-white/70 order-2 sm:order-1 sm:w-1/3">
                <p>© {new Date().getFullYear()} AstraPix Inc. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-2 order-1 sm:order-2 sm:w-1/3 justify-center">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs sm:text-sm text-white/70">All Systems Operational • {currentTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false 
                })}</span>
              </div>
              <div className="sm:w-1/3 order-3"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
