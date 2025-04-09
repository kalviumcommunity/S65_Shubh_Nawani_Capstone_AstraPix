import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const HelpCenter = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Help Center</h1>
          <div className="grid gap-6">
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">How do I generate images?</h3>
                  <p className="text-white/70">Simply input your text description and click generate.</p>
                </div>
                <div>
                  <h3 className="font-medium">What payment methods do you accept?</h3>
                  <p className="text-white/70">We accept all major credit cards and PayPal.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;
