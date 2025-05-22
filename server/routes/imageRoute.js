const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const creditCheck = require("../middlewares/creditCheck");
const {
    generateImage,
    getUserImages,
    deleteImage,
    uploadMiddleware,
} = require("../controllers/imageController");

// Generate image - add authMiddleware before uploadMiddleware
router.post(
    "/generate",
    authMiddleware,
    creditCheck,
    uploadMiddleware,
    generateImage,
);

// Get user's gallery
router.get("/gallery", authMiddleware, getUserImages);

// Delete image
router.delete("/:id", authMiddleware, deleteImage);

module.exports = router;
