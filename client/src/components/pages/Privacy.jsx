import React from "react";
import SimpleHeader from "../common/SimpleHeader";
import Footer from "../common/Footer";

const Privacy = () => {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 pt-14 sm:pt-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-16 md:py-24">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-white">
            Privacy Policy
          </h1>
          <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/10">
            <div className="space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-purple-400">
                  Information We Collect
                </h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  We collect information you provide directly to us when using
                  AstraPix, including: personal information, usage data, and
                  generated images.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-purple-400">
                  How We Use Your Information
                </h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  We use the collected information to provide, maintain, and
                  improve our services, to develop new features, and to protect
                  AstraPix and our users.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-purple-400">
                  Data Security
                </h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
