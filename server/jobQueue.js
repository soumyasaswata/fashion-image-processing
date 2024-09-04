// file path - server/jobQueue.js

const Queue = require('bull');
const sharp = require('sharp');
const axios = require('axios'); // Make sure you require axios if you are using it'
const Image = require('./models/Image');

const imageProcessingQueue = new Queue('image processing');

module.exports = imageProcessingQueue;

imageProcessingQueue.process(async (job, done) => {
    try {
        const { url, filePath } = job.data;

        let processedBuffer;
        if (url) {
            // Download and process image from URL
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            processedBuffer = await sharp(buffer).resize(800, 600).toBuffer();
        } else if (filePath) {
            // Process uploaded image file
            processedBuffer = await sharp(filePath).resize(800, 600).toBuffer();
        }

        // Optionally save the processed image to the database
        const base64Image = processedBuffer.toString('base64');
        const newImage = new Image({ url: url || filePath, status: 'completed', processedImage: base64Image });
        await newImage.save();

        // Notify the job is done with the result
        done(null, { image: base64Image });

    } catch (error) {
        console.error('Error processing image:', error);
        done(error); // Signals that the job failed
    }
});
