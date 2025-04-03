const Image = require('../models/imageModel');
const Credit = require('../models/creditModel');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../utils/cloudinaryUtils');
const Replicate = require("replicate");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const generateImage = async (req) => {
    const { prompt } = req.body;
    const userId = req.user._id;

    if (!prompt) throw new Error("Prompt is required");

    try {
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            { input: { prompt } }
        );

        if (!Array.isArray(output) || output.length === 0) {
            throw new Error('Invalid response from Replicate API');
        }

        const cloudinaryResult = await uploadToCloudinary(output[0]);
        const image = new Image({
            userId,
            prompt,
            imageUrl: cloudinaryResult.url,
            cloudinaryId: cloudinaryResult.public_id
        });
        await image.save();

        const userCredits = await Credit.findOne({ user: userId });
        if (userCredits) {
            userCredits.credit -= 1;
            await userCredits.save();
        }

        return {
            success: true,
            output,
            cloudinaryUrl: cloudinaryResult.url,
            message: "Image generated successfully",
            remainingCredits: userCredits ? userCredits.credit : 0
        };
    } catch (error) {
        throw error;
    }
};

const getUserImages = async (req, res) => {
    try {
        const images = await Image.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .select('prompt imageUrl cloudinaryId timestamp')
            .exec();
        
        res.status(200).json({
            success: true,
            images: images.map(img => ({
                _id: img._id,
                prompt: img.prompt,
                imageUrl: img.imageUrl,
                cloudinaryId: img.cloudinaryId,
                createdAt: img.timestamp
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery images'
        });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = await Image.findOne({ 
            _id: req.params.id,
            userId: req.user._id 
        });

        if (!image) {
            return res.status(404).json({ 
                success: false, 
                message: 'Image not found' 
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryId);
        
        // Delete from database
        await image.deleteOne();

        res.json({ 
            success: true, 
            message: 'Image deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting image' 
        });
    }
};

module.exports = { generateImage, getUserImages, deleteImage };