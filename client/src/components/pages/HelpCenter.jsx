import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  Zap,
  CreditCard,
  Settings,
  MessageSquare,
} from "lucide-react";
import SimpleHeader from "../common/SimpleHeader";
import Footer from "../common/Footer";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      questions: [
        {
          q: "How do I generate my first image?",
          a: "Enter a detailed description in the text box and click 'Generate'. Our AI will create an image based on your prompt.",
        },
        {
          q: "What makes a good prompt?",
          a: "Be specific, include details about style, lighting, and composition. Example: 'A serene lake at sunset with mountains in the background, photorealistic style'.",
        },
      ],
    },
    {
      title: "Billing & Credits",
      icon: <CreditCard className="w-6 h-6 text-purple-400" />,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and select cryptocurrency payments.",
        },
        {
          q: "How do credits work?",
          a: "Each image generation costs 1 credit. Credits are included in your subscription or can be purchased separately.",
        },
      ],
    },
    {
      title: "Technical Support",
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      questions: [
        {
          q: "What image resolutions are available?",
          a: "We offer 720p, 1080p, 4K, and 8K resolutions depending on your subscription plan.",
        },
        {
          q: "How can I improve image quality?",
          a: "Use detailed prompts, specify art style, and upgrade to higher resolution plans for better quality.",
        },
      ],
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
          <SimpleHeader />
        </div>
        <div className="min-h-screen p-4 sm:p-8 pt-16 sm:pt-20 text-white/90">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Help Center
              </h1>
              <p className="text-base sm:text-lg text-white/70 mb-5 sm:mb-8">
                Find answers to common questions about AstraPix
              </p>

              <div className="relative max-w-xl sm:max-w-2xl mx-auto">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 transition-colors text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-8">
              {faqCategories.map((category, index) => (
                <section
                  key={index}
                  className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400">
                      {category.icon}
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {category.title}
                    </h2>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    {category.questions.map((faq, faqIndex) => (
                      <div
                        key={faqIndex}
                        className="pl-3 sm:pl-4 border-l-2 border-purple-500/30"
                      >
                        <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          {faq.q}
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h3 className="text-lg sm:text-xl font-semibold">
                  Still Need Help?
                </h3>
              </div>
              <p className="text-white/70 mb-4 text-sm sm:text-base">
                Can't find what you're looking for? Our support team is
                available 24/7.
              </p>
              <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base touch-manipulation">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;
