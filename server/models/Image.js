// file path - models/Image.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
    createdAt: { type: Date, default: Date.now },
    processedImage: { type: String } // Optional, to store base64 string of processed image
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
