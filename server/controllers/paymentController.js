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
            keyId: process.env.RAZORPAY_API_KEY
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(sign)
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const order = await razorpay.orders.fetch(razorpay_order_id);
        const creditsToAdd = parseInt(order.notes.credits);

        let userCredits = await Credit.findOne({ user: order.notes.userId });
        if (!userCredits) {
            userCredits = new Credit({ user: order.notes.userId, credit: creditsToAdd });
        } else {
            userCredits.credit += creditsToAdd;
        }
        await userCredits.save();

        res.json({
            message: 'Payment verified successfully',
            credits: userCredits.credit
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment' });
    }
};

module.exports = { createOrder, verifyPayment };
