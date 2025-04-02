const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const downloadImage = async (url, filepath) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    await fs.promises.writeFile(filepath, await response.buffer());
    return filepath;
  } catch (error) {
    throw error;
  }
};

const uploadToCloudinary = async (imageUrl) => {
  const tempPath = path.join(__dirname, '..', 'uploads', `temp-${Date.now()}.png`);
  
  try {
    await fs.promises.mkdir(path.dirname(tempPath), { recursive: true });
    await downloadImage(imageUrl, tempPath);
    
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: 'astrapix',
      unique_filename: true,
      resource_type: 'auto'
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    throw error;
  } finally {
    fs.existsSync(tempPath) && fs.unlinkSync(tempPath);
  }
};

module.exports = { uploadToCloudinary };