import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Documentation = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Documentation</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
              <p className="text-white/70">Learn how to use AstraPix effectively.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">API Reference</h2>
              <p className="text-white/70">Detailed information about our API endpoints.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Documentation;
