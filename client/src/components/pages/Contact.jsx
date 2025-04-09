import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="bg-white/5 p-6 rounded-lg">
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Email</label>
                <input type="email" className="w-full p-2 rounded bg-white/10" />
              </div>
              <div>
                <label className="block mb-2">Message</label>
                <textarea className="w-full p-2 rounded bg-white/10 h-32"></textarea>
              </div>
              <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
