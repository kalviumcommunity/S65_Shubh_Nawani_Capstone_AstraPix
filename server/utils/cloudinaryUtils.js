const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const downloadImage = async (url, filepath) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.statusText}`);
        }
        const buffer = await response.buffer();
        await fs.promises.writeFile(filepath, buffer);
        return filepath;
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};

const uploadToCloudinary = async (imageUrl) => {
    try {
        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Create temporary file path
        const tempPath = path.join(uploadsDir, `temp-${Date.now()}.png`);
        
        // Download image to temp file
        console.log('Downloading image from:', imageUrl);
        await downloadImage(imageUrl, tempPath);
        
        console.log('Image downloaded to:', tempPath);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempPath, {
            folder: 'astrapix',
            use_filename: true,
            unique_filename: true,
            resource_type: 'auto' // Add this to handle different file types
        });
        
        console.log('Cloudinary Upload Result:', {
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            size: result.bytes
        });
        
        // Clean up temp file
        fs.unlinkSync(tempPath);
        console.log('Temp file removed');
        
        if (!result.secure_url) {
            throw new Error('No URL in Cloudinary response');
        }

        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Error in uploadToCloudinary:', error);
        throw error;
    }
};

module.exports = { uploadToCloudinary };