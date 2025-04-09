import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By accessing our service, you agree to these terms and conditions.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">2. User Responsibilities</h2>
              <p>Users must comply with all applicable laws and regulations.</p>
            </section>
            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
