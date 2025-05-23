import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Image, CreditCard, FileText, HelpCircle, BookOpen, Mail, Map } from 'lucide-react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';

const Sitemap = () => {
  return (
    <>
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
        <SimpleHeader />
      </div>
      <div className="min-h-screen p-4 sm:p-8 pt-16 sm:pt-20 text-white/90">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Sitemap
            </h1>
            <p className="text-base sm:text-lg text-white/70">Find everything you need on AstraPix</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Main Navigation */}
            <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Main Navigation
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Gallery</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Features
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link to="/generate" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Generate Image</span>
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Explore</span>
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Favorites</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Support
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link to="/help" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Help Center</span>
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Resources
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link to="/blog" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Blog</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tutorials" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Tutorials</span>
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">API Reference</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Legal
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link to="/privacy" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-sm sm:text-base">Cookie Policy</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Sitemap;
