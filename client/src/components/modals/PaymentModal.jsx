import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedPlan, setSelectedPlan] =
     useState(null);
    const [loading, setLoading] = useState(false);

    const plans = [
        { credits: 10, amount: 99900 },  // ₹999
        { credits: 25, amount: 199900 }, // ₹1,999
        { credits: 50, amount: 299900 }  // ₹2,999
    ];

    const handlePayment = async (plan) => {
        try {
            setLoading(true);
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
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed');
                    }
                },
                theme: {
                    color: '#7C3AED'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Failed to initiate payment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
                >
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
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
                                className={`w-full p-4 rounded-lg border-2 ${
                                    selectedPlan === plan
                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                                        : 'border-gray-200 dark:border-gray-700'
                                } hover:border-purple-600 transition-all`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {plan.credits} Credits
                                    </span>
                                    <span className="text-purple-600 dark:text-purple-400">
                                        ₹{(plan.amount / 100).toLocaleString()}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;