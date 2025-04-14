import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Image, CreditCard, FileText, HelpCircle, BookOpen, Mail, Map } from 'lucide-react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';

const Sitemap = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
        <SimpleHeader />
      </div>
      <div className="min-h-screen p-8 pt-20 text-white/90">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Sitemap
            </h1>
            <p className="text-lg text-white/70">Find everything you need on AstraPix</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Navigation */}
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-400" />
                Main Navigation
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-400" />
                Features
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/generate" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Generate Image
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Explore
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Favorites
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                Support
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Resources
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/blog" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/tutorials" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Legal
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Sitemap;
