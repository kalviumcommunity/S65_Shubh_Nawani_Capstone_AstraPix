import React from 'react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';
import { Shield, Lock, Eye, Database, Share2, Bell } from 'lucide-react';

const Privacy = () => {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen p-8 text-white/90">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/70">Your privacy is our top priority</p>
          </div>

          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">Data Protection</h2>
              </div>
              <p className="text-white/70">We implement industry-standard security measures to protect your data.</p>
              <ul className="mt-4 space-y-2 text-white/70">
                <li>• End-to-end encryption</li>
                <li>• Regular security audits</li>
                <li>• Secure data centers</li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">Information We Collect</h2>
              </div>
              <p className="text-white/70 mb-4">We collect and process the following information:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 mr-2 text-purple-400">•</div>
                  <div>
                    <span className="font-medium">Account Information:</span>
                    <p className="text-white/70">Email, username, and billing details</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 mr-2 text-purple-400">•</div>
                  <div>
                    <span className="font-medium">Usage Data:</span>
                    <p className="text-white/70">Image generations, prompts, and preferences</p>
                  </div>
                </li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">Data Sharing</h2>
              </div>
              <p className="text-white/70">We never sell your personal data to third parties.</p>
            </section>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4">Privacy Concerns?</h3>
            <p className="text-white/70 mb-4">Contact our data protection officer for any privacy-related questions.</p>
            <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors">
              Contact DPO
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
