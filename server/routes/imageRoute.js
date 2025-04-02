const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const creditCheck = require('../middlewares/creditCheck');
const { generateImage, getUserImages, deleteImage } = require('../controllers/imageController');

// Generate image
router.post('/generate', authMiddleware, creditCheck, async (req, res) => {
    try {
        const result = await generateImage(req);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error generating image'
        });
    }
});

// Get user's gallery
router.get('/gallery', authMiddleware, getUserImages);

// Delete image
router.delete('/:id', authMiddleware, deleteImage);

module.exports = router;