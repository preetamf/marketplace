const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'API is healthy',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
		version: process.env.npm_package_version,
		environment: process.env.NODE_ENV,
	});
});

// Import and use other route modules
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const bannerRoutes = require('./bannerRoutes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/banners', bannerRoutes);

module.exports = router; 