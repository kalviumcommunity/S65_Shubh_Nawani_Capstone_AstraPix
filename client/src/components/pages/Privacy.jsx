import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>Your privacy is important to us. This policy outlines how we collect and use your data.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We use your information to improve our services and your experience.</p>
            </section>
            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
