import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        { credits: 10, amount: 99900 },
        { credits: 25, amount: 199900 },
        { credits: 50, amount: 299900 }
    ];

    const handlePayment = async (plan) => {
        if (loading) return;
        setLoading(true);
        setSelectedPlan(plan);
        
        try {
            const { data } = await axios.post('http://localhost:8000/api/payment/create-order', {
                amount: plan.amount,
                credits: plan.credits
            });

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'AstraPix',
                description: `${plan.credits} Credits Purchase`,
                order_id: data.orderId,
                handler: async (response) => {
                    try {
                        const verifyData = await axios.post('http://localhost:8000/api/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        onSuccess(verifyData.data.credits);
                        onClose();
                        toast.success('Payment successful!');
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                theme: { color: '#7C3AED' }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error('Failed to initiate payment');
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose} // Close on backdrop click
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={e => e.stopPropagation()} // Prevent closing when clicking modal content
                    className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 max-w-md w-full mx-4 border border-white/10 shadow-xl"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-bold mb-6 text-white">
                        Purchase Credits
                    </h2>
                    
                    <div className="space-y-4">
                        {plans.map((plan) => (
                            <motion.button
                                key={plan.credits}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePayment(plan)}
                                disabled={loading}
                                className={`w-full p-4 rounded-lg border ${
                                    selectedPlan === plan
                                        ? 'border-purple-500 bg-purple-500/20'
                                        : 'border-white/10 hover:border-purple-500/50'
                                } transition-all group`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col items-start">
                                        <span className="text-lg font-semibold text-white group-hover:text-purple-400">
                                            {plan.credits} Credits
                                        </span>
                                        <span className="text-sm text-white/60">
                                            Best for {plan.credits < 25 ? 'starters' : plan.credits < 50 ? 'regular users' : 'power users'}
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-purple-400">
                                        ₹{(plan.amount / 100).toLocaleString()}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <p className="mt-6 text-center text-white/60 text-sm">
                        Secure payments powered by Razorpay
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;