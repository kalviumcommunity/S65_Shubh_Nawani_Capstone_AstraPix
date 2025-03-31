const Replicate = require("replicate");
const { writeFile } = require("fs/promises");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const Credit = require('../models/creditModel');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const generateImage = async (req) => {
    const { prompt } = req.body;
    const userId = req.user._id;

    if (!prompt) {
        throw new Error("Prompt is required");
    }

    try {
        console.log('Starting image generation with prompt:', prompt);
        
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            { input: { prompt } }
        );

        if (!Array.isArray(output) || output.length === 0) {
            throw new Error('Invalid response from Replicate API');
        }

        // Deduct credits after successful generation
        const userCredits = await Credit.findOne({ user: userId });
        if (userCredits) {
            userCredits.credit -= 1;
            await userCredits.save();
        }

        // Return the response object with all necessary data
        return {
            output,
            message: "Image generated successfully",
            remainingCredits: userCredits ? userCredits.credit : 0
        };

    } catch (error) {
        console.error('Error in generateImage:', error);
        throw error;
    }
};

module.exports = { generateImage };