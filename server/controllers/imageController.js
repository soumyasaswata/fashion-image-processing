// file path - controllers/imageController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // For image processing
const imageProcessingQueue = require('../jobQueue');
const { generateShots } = require('../poseDetection');

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// For handling single image upload
exports.handleImageUpload = (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading image.');
        }

        const file = req.file;
        if (!file) {
            return res.status(400).send('No image file uploaded.');
        }

        try {
            const filePath = path.join(__dirname, '../uploads', file.filename);
            const imageBuffer = fs.readFileSync(filePath);

            // Generate image shots using pose detection (asynchronously)
            const shots = await generateShots(imageBuffer);

            // Send the result back to the client
            res.json({ shots });
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).send('Error processing image.');
        }
    });
};

// For handling URL uploads
exports.handleUrlUpload = async (req, res) => {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).send('Invalid URLs.');
    }

    try {
        // Add jobs to the queue for each URL
        urls.forEach((url) => {
            imageProcessingQueue.add({ url });
        });

        res.status(200).json({ message: 'Images are being processed', status: 'Processing' });
    } catch (error) {
        console.error('Error adding URLs to the processing queue:', error);
        res.status(500).send('Error processing images.');
    }
};
