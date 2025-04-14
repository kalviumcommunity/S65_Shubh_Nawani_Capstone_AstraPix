import React from 'react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';
import { FileText, UserCheck, Scale, AlertTriangle } from 'lucide-react';

const Terms = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
        <SimpleHeader />
      </div>
      <div className="min-h-screen p-8 pt-20 text-white/90">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Terms of Service
            </h1>
            <p className="text-lg text-white/70">Please read these terms carefully before using AstraPix</p>
          </div>

          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              </div>
              <p className="text-white/70 mb-4">By accessing or using AstraPix, you agree to be bound by these terms.</p>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-white/60 text-sm">Last updated: November 2023</p>
              </div>
            </section>

            <section className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">2. User Responsibilities</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-5 h-5 mr-3 text-purple-400">•</div>
                  <div>
                    <h3 className="font-medium mb-1">Content Guidelines</h3>
                    <p className="text-white/70">Users must not generate inappropriate or harmful content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 mr-3 text-purple-400">•</div>
                  <div>
                    <h3 className="font-medium mb-1">Account Security</h3>
                    <p className="text-white/70">Maintain the confidentiality of your account credentials</p>
                  </div>
                </li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
              </div>
              <p className="text-white/70">You retain rights to your generated images while granting us license to:</p>
              <ul className="mt-4 space-y-2 text-white/70">
                <li>• Display your content</li>
                <li>• Improve our services</li>
                <li>• Market our platform</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 p-8 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold">Important Notice</h3>
            </div>
            <p className="text-white/70">Violation of these terms may result in account suspension or termination.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
