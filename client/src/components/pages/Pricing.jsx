import React from 'react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';

const Pricing = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
        <SimpleHeader />
      </div>
      <div className="min-h-screen p-8 pt-20 text-white/90">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Choose Your Plan
            </h1>
            <p className="text-lg text-white/70">Unlock the power of AI image generation with our flexible plans</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-purple-400 text-lg font-semibold mb-2">Basic</div>
              <h2 className="text-3xl font-bold mb-4">$9.99<span className="text-lg font-normal">/mo</span></h2>
              <p className="text-white/60 mb-6">Perfect for getting started</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>100 generations/month</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Basic support</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>720p resolution</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Standard queue priority</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-semibold">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-purple-600/10 to-pink-600/10 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-purple-400 text-lg font-semibold mb-2">Pro</div>
              <h2 className="text-3xl font-bold mb-4">$24.99<span className="text-lg font-normal">/mo</span></h2>
              <p className="text-white/60 mb-6">For professional creators</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>300 generations/month</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Priority support</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>4K resolution</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>High priority queue</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Advanced settings</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all font-semibold">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-purple-400 text-lg font-semibold mb-2">Enterprise</div>
              <h2 className="text-3xl font-bold mb-4">$99.99<span className="text-lg font-normal">/mo</span></h2>
              <p className="text-white/60 mb-6">For businesses & teams</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Unlimited generations</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>24/7 support</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>8K resolution</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Highest priority queue</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>API access</li>
                <li className="flex items-center"><div className="w-5 h-5 mr-3 text-purple-400">✓</div>Custom integration</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
