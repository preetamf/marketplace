const express = require('express');
const productController = require('../controllers/productController');
const { productLimiter } = require('../middleware/rateLimiter');
const { validateRequest, productQuerySchema } = require('../middleware/validateRequest');

const router = express.Router();

router.get(
	'/trending',
	productLimiter,
	validateRequest(productQuerySchema),
	productController.getTrendingProducts
);

router.get(
	'/best-selling',
	productLimiter,
	validateRequest(productQuerySchema),
	productController.getBestSellingProducts
);

module.exports = router; 