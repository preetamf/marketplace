const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const bannerRoutes = require('./bannerRoutes');

const router = express.Router();

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/banners', bannerRoutes);

module.exports = router; 