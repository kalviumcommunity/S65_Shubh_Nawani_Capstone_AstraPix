import React from "react";
import { Mail, Phone, MessageSquare, Send } from "lucide-react";
import SimpleHeader from "../common/SimpleHeader";
import Footer from "../common/Footer";

const Contact = () => {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 shadow-lg">
          <SimpleHeader />
        </div>
        <div className="min-h-screen p-4 sm:p-8 pt-16 sm:pt-20 text-white/90">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Get in Touch
              </h1>
              <p className="text-base sm:text-lg text-white/70">
                We'd love to hear from you. Please fill out this form.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              {/* Contact Info */}
              <div className="space-y-4 sm:space-y-8">
                <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Email Us
                  </h3>
                  <p className="text-white/70 text-sm">support@astrapix.com</p>
                  <p className="text-white/70 text-sm">business@astrapix.com</p>
                </div>

                <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Call Us
                  </h3>
                  <p className="text-white/70 text-sm">+1 (555) 123-4567</p>
                  <p className="text-white/70 text-sm">Mon-Fri 9AM-6PM EST</p>
                </div>

                <div className="bg-white/5 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/10">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Live Chat
                  </h3>
                  <p className="text-white/70 text-sm">
                    Available 24/7 for Pro and Enterprise users
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2 bg-white/5 p-4 sm:p-8 rounded-xl backdrop-blur-sm border border-white/10">
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2.5 sm:p-3 rounded-lg bg-white/10 border border-white/10 focus:border-purple-500 transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2.5 sm:p-3 rounded-lg bg-white/10 border border-white/10 focus:border-purple-500 transition-colors text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-white/10 border border-white/10 focus:border-purple-500 transition-colors text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Subject
                    </label>
                    <select className="w-full p-2.5 sm:p-3 rounded-lg bg-white/10 border border-white/10 focus:border-purple-500 transition-colors text-sm sm:text-base">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing Question</option>
                      <option>Partnership Opportunity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Message
                    </label>
                    <textarea
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-white/10 border border-white/10 focus:border-purple-500 transition-colors h-24 sm:h-32 text-sm sm:text-base"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all font-medium sm:font-semibold flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base touch-manipulation">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
