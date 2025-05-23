import React from 'react';
import { BookOpen, Code, Cpu, Palette } from 'lucide-react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';

const Documentation = () => {
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
              Documentation
            </h1>
            <p className="text-base sm:text-lg text-white/70">Everything you need to know about AstraPix</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <section className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h2 className="text-lg sm:text-xl font-semibold">Getting Started</h2>
              </div>
              <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">Learn the basics of using AstraPix for AI image generation.</p>
              <ul className="space-y-1.5 sm:space-y-3 text-white/80 text-xs sm:text-sm">
                <li>• Quick start guide</li>
                <li>• Basic concepts</li>
                <li>• First generation</li>
              </ul>
            </section>

            <section className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h2 className="text-lg sm:text-xl font-semibold">API Reference</h2>
              </div>
              <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">Comprehensive API documentation for developers.</p>
              <ul className="space-y-1.5 sm:space-y-3 text-white/80 text-xs sm:text-sm">
                <li>• Authentication</li>
                <li>• Endpoints</li>
                <li>• Rate limits</li>
              </ul>
            </section>

            <section className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h2 className="text-lg sm:text-xl font-semibold">Style Guide</h2>
              </div>
              <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">Learn how to craft effective prompts for better results.</p>
              <ul className="space-y-1.5 sm:space-y-3 text-white/80 text-xs sm:text-sm">
                <li>• Prompt writing</li>
                <li>• Style examples</li>
                <li>• Best practices</li>
              </ul>
            </section>

            <section className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h2 className="text-lg sm:text-xl font-semibold">Technical Specs</h2>
              </div>
              <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">Technical details about our AI models and infrastructure.</p>
              <ul className="space-y-1.5 sm:space-y-3 text-white/80 text-xs sm:text-sm">
                <li>• Model versions</li>
                <li>• Resolution options</li>
                <li>• Performance stats</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Need Help?</h3>
            <p className="text-white/70 mb-4 text-sm sm:text-base">Can't find what you're looking for? Our support team is here to help.</p>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm sm:text-base touch-manipulation">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Documentation;
