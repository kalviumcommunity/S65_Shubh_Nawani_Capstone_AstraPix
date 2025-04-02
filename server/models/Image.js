const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

module.exports = mongoose.model('Image', imageSchema);