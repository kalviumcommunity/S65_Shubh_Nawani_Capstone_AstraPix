import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Sitemap = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">Main Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">Legal Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Sitemap;
