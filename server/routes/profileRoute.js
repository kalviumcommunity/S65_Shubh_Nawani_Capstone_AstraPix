const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // User is already attached to req by middleware
        const user = await User.findById(req.user._id)
            .select('-password')
            .select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile Route Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;