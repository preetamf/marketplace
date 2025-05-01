const express = require('express');
const categoryController = require('../controllers/categoryController');
const { categoryLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/featured', categoryLimiter, categoryController.getFeaturedCategories);

module.exports = router; 