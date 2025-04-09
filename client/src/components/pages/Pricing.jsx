import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Pricing = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Pricing Plans</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Basic</h2>
              <p className="text-3xl font-bold mb-4">$9.99/mo</p>
              <ul className="space-y-2">
                <li>100 generations/month</li>
                <li>Basic support</li>
              </ul>
            </div>
            {/* Add Pro and Enterprise plans similarly */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
