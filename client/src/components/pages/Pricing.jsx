import React from 'react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';

const Pricing = () => {
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
              Choose Your Plan
            </h1>
            <p className="text-base sm:text-lg text-white/70">Unlock the power of AI image generation with our flexible plans</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Basic Plan */}
            <div className="bg-white/5 p-5 sm:p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 touch-manipulation">
              <div className="text-purple-400 text-base sm:text-lg font-semibold mb-1 sm:mb-2">Basic</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">$9.99<span className="text-base sm:text-lg font-normal">/mo</span></h2>
              <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">Perfect for getting started</p>
              <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>100 generations/month</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Basic support</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>720p resolution</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Standard queue priority</li>
              </ul>
              <button className="w-full py-2.5 sm:py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-medium sm:font-semibold text-sm sm:text-base touch-manipulation">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-purple-600/10 to-pink-600/10 p-5 sm:p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 relative touch-manipulation">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium sm:font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-purple-400 text-base sm:text-lg font-semibold mb-1 sm:mb-2">Pro</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">$24.99<span className="text-base sm:text-lg font-normal">/mo</span></h2>
              <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">For professional creators</p>
              <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>300 generations/month</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Priority support</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>4K resolution</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>High priority queue</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Advanced settings</li>
              </ul>
              <button className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all font-medium sm:font-semibold text-sm sm:text-base touch-manipulation">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/5 p-5 sm:p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 touch-manipulation">
              <div className="text-purple-400 text-base sm:text-lg font-semibold mb-1 sm:mb-2">Enterprise</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">$99.99<span className="text-base sm:text-lg font-normal">/mo</span></h2>
              <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">For businesses & teams</p>
              <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Unlimited generations</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>24/7 support</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>8K resolution</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Highest priority queue</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>API access</li>
                <li className="flex items-center"><div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-400">✓</div>Custom integration</li>
              </ul>
              <button className="w-full py-2.5 sm:py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-medium sm:font-semibold text-sm sm:text-base touch-manipulation">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Pricing;
