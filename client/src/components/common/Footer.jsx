import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 py-6 sm:py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info - Full Width on Mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-white">AstraPix Inc.</h3>
            <p className="text-sm text-white/70">
              Transforming imagination into reality through AI-powered image generation.
            </p>
          </div>

          {/* Navigation Sections */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="text-white/70 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-white/70 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/docs" className="text-white/70 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/sitemap" className="text-white/70 hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright - Improved Mobile Layout */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10">
          <p className="text-center text-sm text-white/70">
            © {new Date().getFullYear()} AstraPix Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;