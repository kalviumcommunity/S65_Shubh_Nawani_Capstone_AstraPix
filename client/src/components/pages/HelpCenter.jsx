import React, { useState } from 'react';
import { Search, HelpCircle, Zap, CreditCard, Settings, MessageSquare } from 'lucide-react';
import SimpleHeader from '../common/SimpleHeader';
import Footer from '../common/Footer';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      questions: [
        {
          q: "How do I generate my first image?",
          a: "Enter a detailed description in the text box and click 'Generate'. Our AI will create an image based on your prompt."
        },
        {
          q: "What makes a good prompt?",
          a: "Be specific, include details about style, lighting, and composition. Example: 'A serene lake at sunset with mountains in the background, photorealistic style'."
        }
      ]
    },
    {
      title: "Billing & Credits",
      icon: <CreditCard className="w-6 h-6 text-purple-400" />,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and select cryptocurrency payments."
        },
        {
          q: "How do credits work?",
          a: "Each image generation costs 1 credit. Credits are included in your subscription or can be purchased separately."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      questions: [
        {
          q: "What image resolutions are available?",
          a: "We offer 720p, 1080p, 4K, and 8K resolutions depending on your subscription plan."
        },
        {
          q: "How can I improve image quality?",
          a: "Use detailed prompts, specify art style, and upgrade to higher resolution plans for better quality."
        }
      ]
    }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
        <SimpleHeader />
      </div>
      <div className="min-h-screen p-8 pt-20 text-white/90">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Help Center
            </h1>
            <p className="text-lg text-white/70 mb-8">Find answers to common questions about AstraPix</p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, index) => (
              <section key={index} className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  {category.icon}
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="pl-4 border-l-2 border-purple-500/30">
                      <h3 className="font-medium mb-2">{faq.q}</h3>
                      <p className="text-white/70">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold">Still Need Help?</h3>
            </div>
            <p className="text-white/70 mb-4">Can't find what you're looking for? Our support team is available 24/7.</p>
            <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;
