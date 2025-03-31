const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const creditCheck = require('../middlewares/creditCheck');
const { generateImage } = require('../controllers/imageController');
const { uploadToCloudinary } = require('../utils/cloudinaryUtils');

// Main image generation route with auth and credit check
router.post('/generate', authMiddleware, creditCheck, async (req, res) => {
    try {
        const replicateResponse = await generateImage(req);
        console.log('Replicate Response:', replicateResponse);
        
        if (!replicateResponse || !replicateResponse.output) {
            return res.status(400).json({
                success: false,
                message: 'No image generated from Replicate'
            });
        }

        const imageUrl = replicateResponse.output[0];
        console.log('Generated Image URL:', imageUrl);

        const cloudinaryResult = await uploadToCloudinary(imageUrl);
        console.log('Cloudinary Upload Result:', cloudinaryResult);

        return res.status(200).json({
            success: true,
            replicateUrl: imageUrl,
            cloudinaryUrl: cloudinaryResult.url // Make sure this matches what frontend expects
        });
    } catch (error) {
        console.error('Error in generate route:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Error generating image'
        });
    }
});
// Route to get a user's generated images
router.get('/gallery', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    // Add logic to fetch user's generated images
    res.status(200).json({ images: [] }); // Implement image fetching
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery', error: error.message });
  }
});

module.exports = router;