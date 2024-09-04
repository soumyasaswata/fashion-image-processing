// file path - routes/imageRoutes.js

const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Define routes and attach controllers
router.post('/upload', imageController.handleImageUpload);
router.post('/urls', imageController.handleUrlUpload);

module.exports = router;
