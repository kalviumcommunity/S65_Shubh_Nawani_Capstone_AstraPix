const Razorpay = require('razorpay');
const crypto = require('crypto');
const Credit = require('../models/creditModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

const createOrder = async (req, res) => {
    try {
        const { amount, credits } = req.body;
        const userId = req.user._id;

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                credits: credits.toString()
            }
        };

        const order = await razorpay.orders.create(options);
        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_API_KEY // Using API_KEY here
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(sign)
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // Get order details
        const order = await razorpay.orders.fetch(razorpay_order_id);
        const userId = order.notes.userId;
        const creditsToAdd = parseInt(order.notes.credits);

        if (!userId || !creditsToAdd) {
            return res.status(400).json({ message: 'Invalid order details' });
        }

        // Add credits to user
        let userCredits = await Credit.findOne({ user: userId });
        if (!userCredits) {
            userCredits = new Credit({ user: userId, credit: creditsToAdd });
        } else {
            userCredits.credit += creditsToAdd;
        }
        await userCredits.save();

        res.json({
            message: 'Payment verified successfully',
            credits: userCredits.credit
        });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
};

module.exports = { createOrder, verifyPayment };