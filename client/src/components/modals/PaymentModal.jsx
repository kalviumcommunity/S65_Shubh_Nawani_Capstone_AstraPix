import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

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
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/payment/create-order`, {
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
                        const verifyData = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/payment/verify-payment`, {
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Choose Your Plan
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, index) => (
                            <motion.button
                                key={plan.credits}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePayment(plan)}
                                disabled={loading}
                                className={`relative p-6 rounded-xl border-2 transition-all ${
                                    selectedPlan === plan
                                        ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900 dark:to-gray-800'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                                }`}
                            >
                                {index === 1 && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                            Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                        {plan.credits} Credits
                                    </h3>
                                    <div className="text-purple-600 dark:text-purple-400 text-3xl font-bold mb-4">
                                        ₹{(plan.amount / 100).toLocaleString()}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                        ₹{((plan.amount / 100) / plan.credits).toFixed(2)} per credit
                                    </div>
                                    <div className={`py-2 px-4 rounded-lg ${
                                        selectedPlan === plan
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                    }`}>
                                        {loading && selectedPlan === plan ? 'Processing...' : 'Select Plan'}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Secure payment powered by Razorpay
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;