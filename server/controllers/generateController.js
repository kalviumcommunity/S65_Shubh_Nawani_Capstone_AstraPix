const Image = require("../models/Image"); // Import the Image model

exports.generateImage = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    // ...existing DALL-E and Cloudinary code...

    const newImage = new Image({
      userId,
      prompt,
      imageUrl: result.secure_url,
      generatedAt: new Date(),
    });

    const savedImage = await newImage.save();

    res.status(200).json({
      success: true,
      cloudinaryUrl: result.secure_url,
      imageId: savedImage._id,
      generatedAt: savedImage.generatedAt,
      createdAt: savedImage.createdAt,
    });
  } catch (error) {
    // ...existing error handling...
  }
};

exports.getGallery = async (req, res) => {
  try {
    const images = await Image.find()
      .sort({ generatedAt: -1 })
      .select("_id imageUrl prompt generatedAt createdAt")
      .lean();

    res.json({
      success: true,
      images: images.map((img) => ({
        ...img,
        generatedAt: img.generatedAt.toISOString(),
        createdAt: img.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    // ...existing error handling...
  }
};
