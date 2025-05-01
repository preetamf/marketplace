const express = require('express');
const bannerController = require('../controllers/bannerController');
const { bannerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/', bannerLimiter, bannerController.getAllBanners);

module.exports = router; 