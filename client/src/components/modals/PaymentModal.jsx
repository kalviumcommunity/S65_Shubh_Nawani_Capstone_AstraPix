import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Sparkles, Shield, Check, Loader, X } from "lucide-react";

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingState, setLoadingState] = useState("");

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Plans data memoized to prevent re-creation on each render
  const plans = React.useMemo(
    () => [
      {
        id: "basic",
        credits: 10,
        amount: 99900,
        perCredit: "₹999/credit",
        description: "Perfect for trying out the service",
        features: ["Basic access", "10 unique generations", "Standard support"],
      },
      {
        id: "popular",
        credits: 25,
        amount: 199900,
        perCredit: "₹799/credit",
        popular: true,
        description: "Most popular choice for creators",
        features: [
          "Everything in Basic",
          "25 unique generations",
          "Priority support",
        ],
      },
      {
        id: "premium",
        credits: 50,
        amount: 299900,
        perCredit: "₹599/credit",
        description: "Best value for power users",
        features: [
          "Everything in Popular",
          "50 unique generations",
          "Premium support",
        ],
      },
    ],
    [],
  );

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus trap inside modal
      const handleTabKey = (e) => {
        if (e.key === "Tab") {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );

          if (!focusableElements?.length) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      // Handle escape key
      const handleEscapeKey = (e) => {
        if (e.key === "Escape" && !loading && !verifying) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleTabKey);
      document.addEventListener("keydown", handleEscapeKey);

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Auto focus first interactive element
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
        document.removeEventListener("keydown", handleEscapeKey);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, loading, verifying, onClose]);

  const handlePayment = useCallback(
    async (plan) => {
      if (loading) return;
      setLoading(true);
      setSelectedPlan(plan);
      setLoadingState("initiating");

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/api/payment/create-order`,
          {
            amount: plan.amount,
            credits: plan.credits,
          },
        );

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "AstraPix",
          description: `${plan.credits} Credits Purchase`,
          order_id: data.orderId,
          handler: async (response) => {
            try {
              setVerifying(true);
              setLoadingState("verifying");
              const verifyData = await axios.post(
                `${import.meta.env.VITE_BASE_URI}/api/payment/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );
              setLoadingState("success");
              await new Promise((resolve) => setTimeout(resolve, 1000));
              onSuccess(verifyData.data.credits);
              onClose();
              toast.success(
                "Payment successful! Credits added to your account.",
                {
                  position:
                    window.innerWidth < 640 ? "bottom-center" : "top-right",
                  duration: 4000,
                },
              );
            } catch (error) {
              console.error("Payment verification failed:", error);
              setLoadingState("error");
              toast.error(
                error.response?.data?.message || "Payment verification failed",
                {
                  position:
                    window.innerWidth < 640 ? "bottom-center" : "top-right",
                },
              );
            } finally {
              setVerifying(false);
              setLoadingState("");
            }
          },
          theme: { color: "#7C3AED" },
          prefill: {
            name: "AstraPix User",
            contact: "",
            email: "",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setSelectedPlan(null);
              setLoadingState("");
            },
            animation: true,
            backdropclose: false,
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Failed to initiate payment:", error);
        setLoadingState("error");
        toast.error(
          error.response?.data?.message || "Failed to initiate payment",
          {
            position: window.innerWidth < 640 ? "bottom-center" : "top-right",
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, onClose, onSuccess],
  );

  const handleCloseModal = useCallback(() => {
    if (!loading && !verifying) {
      onClose();
    }
  }, [loading, verifying, onClose]);

  // Handle background click
  const handleBackdropClick = useCallback(
    (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !loading &&
        !verifying
      ) {
        onClose();
      }
    },
    [loading, verifying, onClose],
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overscroll-contain touch-none"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        {/* Loading/Verification Overlay */}
        <AnimatePresence>
          {(loadingState || verifying) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6"
              role="status"
              aria-live="polite"
            >
              <Loader
                className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 animate-spin mb-2 sm:mb-4"
                aria-hidden="true"
              />
              <p className="text-white/80 text-base sm:text-lg font-medium text-center">
                {loadingState === "initiating" && "Initiating payment..."}
                {loadingState === "verifying" && "Verifying payment..."}
                {loadingState === "success" && "Payment successful!"}
                {loadingState === "error" && "Payment failed"}
              </p>
              {(loadingState === "initiating" ||
                loadingState === "verifying") && (
                <motion.div
                  className="h-1 bg-purple-500/20 w-36 sm:w-48 mt-3 sm:mt-4 rounded-full overflow-hidden"
                  aria-hidden="true"
                >
                  <motion.div
                    className="h-full bg-purple-500"
                    animate={{
                      x: [-144, 144],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                      repeatType: "mirror",
                    }}
                    style={{ willChange: "transform" }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gray-900 border border-purple-500/20 rounded-xl p-4 sm:p-6 max-w-6xl w-full mx-2 sm:mx-4 shadow-xl max-h-[90vh] overflow-y-auto overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Sparkles
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400"
                aria-hidden="true"
              />
              <h2
                id="payment-modal-title"
                className="text-xl sm:text-2xl font-bold text-white"
              >
                Purchase Credits
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              onClick={handleCloseModal}
              className="text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              disabled={loading || verifying}
              aria-label="Close modal"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto text-center mb-6">
            Power up your creativity with AstraPix credits. Choose a plan that
            suits your needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
            {plans.map((plan) => (
              <motion.button
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePayment(plan)}
                disabled={loading || verifying}
                className={`w-full p-3 sm:p-6 rounded-lg border-2 relative text-left h-full flex flex-col touch-manipulation ${
                  selectedPlan === plan
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 hover:border-purple-500/50"
                } ${loading || verifying ? "opacity-50 cursor-not-allowed" : ""} transition-all group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                aria-label={`Purchase ${plan.credits} credits for ₹${(plan.amount / 100).toLocaleString()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 sm:-top-3 -right-1 sm:-right-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500 text-white text-xs rounded-full">
                    Popular Choice
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  <div className="mb-2 sm:mb-4">
                    <div className="flex items-start justify-between mb-1 sm:mb-2">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-white">
                          {plan.credits} Credits
                        </span>
                        <p className="text-purple-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                          {plan.perCredit}
                        </p>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        ₹{(plan.amount / 100).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs sm:text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/80"
                      >
                        <Check
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-white/10 pt-4 sm:pt-6">
            <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-purple-500/10 rounded-lg w-full sm:w-auto">
              <Shield
                className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm text-white/80">
                Secure payment powered by Razorpay
              </span>
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={handleCloseModal}
                disabled={loading || verifying}
                className="px-3 sm:px-4 py-2 text-white/60 hover:text-white transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-gray-900 focus:ring-offset-1 rounded-md"
                aria-label="Close modal"
              >
                Close
              </button>
              <a
                href="mailto:support@astrapix.com"
                className="px-3 sm:px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-gray-900 focus:ring-offset-1 rounded-md"
                aria-label="Email support"
              >
                Need Help?
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(PaymentModal);
