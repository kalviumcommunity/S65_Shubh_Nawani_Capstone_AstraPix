const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (imageData) => {
  try {
    // Fetch the image from URL if imageData is a URL string
    const imageResponse = await fetch(imageData);
    const buffer = await imageResponse.arrayBuffer();

    // Convert buffer to base64
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataURI = `data:image/jpeg;base64,${base64Image}`;

    // Upload base64 data to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "astrapix",
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary: " + error.message);
  }
};

module.exports = { uploadToCloudinary };
