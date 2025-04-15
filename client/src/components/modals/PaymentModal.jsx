import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Sparkles, Shield, Check, Loader } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loadingState, setLoadingState] = useState(''); // Add this state

    const plans = [
        { 
            credits: 10, 
            amount: 99900,
            perCredit: '₹999/credit',
            description: 'Perfect for trying out the service',
            features: ['Basic access', '10 unique generations', 'Standard support']
        },
        { 
            credits: 25, 
            amount: 199900,
            perCredit: '₹799/credit',
            popular: true,
            description: 'Most popular choice for creators',
            features: ['Everything in Basic', '25 unique generations', 'Priority support']
        },
        { 
            credits: 50, 
            amount: 299900,
            perCredit: '₹599/credit',
            description: 'Best value for power users',
            features: ['Everything in Popular', '50 unique generations', 'Premium support']
        }
    ];

    const handlePayment = async (plan) => {
        if (loading) return;
        setLoading(true);
        setSelectedPlan(plan);
        setLoadingState('initiating'); // Set loading state
        
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
                        setVerifying(true);
                        setLoadingState('verifying'); // Update loading state
                        const verifyData = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/payment/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setLoadingState('success');
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Show success briefly
                        onSuccess(verifyData.data.credits);
                        onClose();
                        toast.success('Payment successful! Credits added to your account.');
                    } catch (error) {
                        setLoadingState('error');
                        toast.error('Payment verification failed');
                    } finally {
                        setVerifying(false);
                        setLoadingState('');
                    }
                },
                theme: { color: '#7C3AED' }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            setLoadingState('error');
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

                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"

                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"

            >
                {/* Loading/Verification Overlay */}
                {(loadingState || verifying) && (
                    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                        <p className="text-white/80 text-lg font-medium">
                            {loadingState === 'initiating' && 'Initiating payment...'}
                            {loadingState === 'verifying' && 'Verifying payment...'}
                            {loadingState === 'success' && 'Payment successful!'}
                            {loadingState === 'error' && 'Payment failed'}
                        </p>
                        {(loadingState === 'initiating' || loadingState === 'verifying') && (
                            <motion.div 
                                className="h-1 bg-purple-500/20 w-48 mt-4 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-purple-500"
                                    animate={{
                                        x: [-192, 192],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        ease: "linear",
                                    }}
                                />
                            </motion.div>
                        )}
                    </div>
                )}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}

                    className="bg-gray-900 border border-purple-500/20 rounded-xl p-6 max-w-6xl w-full mx-4 shadow-xl"
                >
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">Purchase Credits</h2>
                        </div>
                        <p className="text-white/60 max-w-md mx-auto">
                            Power up your creativity with AstraPix credits. Choose a plan that suits your needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {plans.map((plan) => (

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

                                disabled={loading || verifying}
                                className={`w-full p-6 rounded-lg border-2 relative text-left h-full flex flex-col ${
                                    selectedPlan === plan
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-white/10 hover:border-purple-500/50'
                                } ${(loading || verifying) ? 'opacity-50 cursor-not-allowed' : ''} transition-all group`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 -right-2 px-3 py-1 bg-purple-500 text-white text-xs rounded-full">
                                        Popular Choice
                                    </div>
                                )}

                                <div className="flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className="text-2xl font-bold text-white">
                                                    {plan.credits} Credits
                                                </span>
                                                <p className="text-purple-400 text-sm mt-1">{plan.perCredit}</p>
                                            </div>
                                            <span className="text-3xl font-bold text-white">
                                                ₹{(plan.amount / 100).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 flex-grow">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                                                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}

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


                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-purple-400" />
                            <span className="text-sm text-white/80">Secure payment powered by Razorpay</span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                            <a 
                                href="mailto:support@astrapix.com"
                                className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Need Help?
                            </a>
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