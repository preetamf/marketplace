const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const logger = require('../utils/logger');
const config = require('../config/config');

const seedDatabase = async () => {
	try {
		// Connect to MongoDB if not already connected
		if (mongoose.connection.readyState !== 1) {
			await mongoose.connect(config.mongodb.uri, config.mongodb.options);
			logger.info('Connected to MongoDB for seeding');
		}

		// Clear existing data
		await Promise.all([
			Product.deleteMany(),
			Category.deleteMany(),
			Banner.deleteMany(),
		]);
		logger.info('Cleared existing data');

		// Create main categories
		const electronics = await Category.create({
			name: 'Electronics',
			description: 'Latest electronic gadgets and devices',
			imageUrl: 'https://example.com/images/electronics.jpg',
			isFeatured: true,
			order: 1,
			icon: 'microchip',
			metaTitle: 'Electronics Store - Latest Gadgets & Devices',
			metaDescription: 'Shop the latest electronics, gadgets, and devices at competitive prices',
			metaKeywords: ['electronics', 'gadgets', 'devices', 'tech'],
			attributes: [
				{ name: 'Brand', type: 'text', required: true },
				{ name: 'Warranty', type: 'text', required: true },
				{ name: 'Color', type: 'select', options: ['Black', 'White', 'Silver', 'Gold'] },
			],
		});

		const fashion = await Category.create({
			name: 'Fashion',
			description: 'Trendy clothing and accessories',
			imageUrl: 'https://example.com/images/fashion.jpg',
			isFeatured: true,
			order: 2,
			icon: 'tshirt',
			metaTitle: 'Fashion Store - Latest Trends & Styles',
			metaDescription: 'Discover the latest fashion trends and styles for men and women',
			metaKeywords: ['fashion', 'clothing', 'accessories', 'style'],
			attributes: [
				{ name: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'], required: true },
				{ name: 'Color', type: 'select', options: ['Black', 'White', 'Blue', 'Red', 'Green'], required: true },
				{ name: 'Material', type: 'text', required: true },
			],
		});

		// Create sub-categories
		const smartphones = await Category.create({
			name: 'Smartphones',
			parent: electronics._id,
			description: 'Latest smartphones and mobile devices',
			imageUrl: 'https://example.com/images/smartphones.jpg',
			order: 1,
			icon: 'mobile-alt',
			metaTitle: 'Smartphones - Latest Mobile Devices',
			metaDescription: 'Browse the latest smartphones from top brands',
		});

		const laptops = await Category.create({
			name: 'Laptops',
			parent: electronics._id,
			description: 'High-performance laptops and notebooks',
			imageUrl: 'https://example.com/images/laptops.jpg',
			order: 2,
			icon: 'laptop',
			metaTitle: 'Laptops - High-Performance Computing',
			metaDescription: 'Find the perfect laptop for your needs',
		});

		const mensClothing = await Category.create({
			name: "Men's Clothing",
			parent: fashion._id,
			description: 'Stylish clothing for men',
			imageUrl: 'https://example.com/images/mens-clothing.jpg',
			order: 1,
			icon: 'user',
			metaTitle: "Men's Clothing - Latest Styles",
			metaDescription: 'Shop the latest men\'s fashion trends',
		});

		// Create products
		const products = await Product.create([
			{
				name: 'Premium Smartphone X',
				description: 'Flagship smartphone with AI camera and 5G connectivity',
				price: 999,
				comparePrice: 1099,
				salePrice: 899,
				saleStart: new Date('2024-03-01'),
				saleEnd: new Date('2024-03-31'),
				imageUrl: 'https://example.com/images/phonex.jpg',
				images: [
					{ url: 'https://example.com/images/phonex-1.jpg', alt: 'Front view', isDefault: true },
					{ url: 'https://example.com/images/phonex-2.jpg', alt: 'Back view' },
					{ url: 'https://example.com/images/phonex-3.jpg', alt: 'Side view' },
				],
				category: smartphones._id,
				subCategories: [electronics._id],
				stock: 50,
				sku: 'SMX-2024-1',
				weight: 0.2,
				dimensions: { height: 15, width: 7, length: 0.8, unit: 'cm' },
				tags: ['new-arrival', 'best-seller', 'trending'],
				attributes: [
					{ name: 'Brand', value: 'TechCo' },
					{ name: 'Warranty', value: '2 years' },
					{ name: 'Color', value: 'Black' },
				],
				variants: [
					{
						name: '128GB Black',
						sku: 'SMX-2024-1-128B',
						price: 999,
						stock: 20,
						attributes: [
							{ name: 'Storage', value: '128GB' },
							{ name: 'Color', value: 'Black' },
						],
					},
					{
						name: '256GB Black',
						sku: 'SMX-2024-1-256B',
						price: 1099,
						stock: 30,
						attributes: [
							{ name: 'Storage', value: '256GB' },
							{ name: 'Color', value: 'Black' },
						],
					},
				],
				rating: 4.5,
				ratingCount: 120,
				reviews: [
					{
						rating: 5,
						comment: 'Amazing phone with great camera quality',
						images: ['https://example.com/reviews/phonex-1.jpg'],
						createdAt: new Date('2024-02-15'),
					},
				],
				metaTitle: 'Premium Smartphone X - Latest Flagship Device',
				metaDescription: 'Experience the future with our latest flagship smartphone',
				metaKeywords: ['smartphone', 'flagship', '5G', 'AI camera'],
			},
			{
				name: 'Ultra Slim Laptop Pro',
				description: 'Powerful laptop with ultra-slim design',
				price: 1499,
				comparePrice: 1699,
				imageUrl: 'https://example.com/images/laptop-pro.jpg',
				images: [
					{ url: 'https://example.com/images/laptop-pro-1.jpg', alt: 'Front view', isDefault: true },
					{ url: 'https://example.com/images/laptop-pro-2.jpg', alt: 'Side view' },
				],
				category: laptops._id,
				subCategories: [electronics._id],
				stock: 30,
				sku: 'LP-2024-1',
				weight: 1.5,
				dimensions: { height: 1.5, width: 30, length: 20, unit: 'cm' },
				tags: ['new-arrival', 'trending'],
				attributes: [
					{ name: 'Brand', value: 'TechCo' },
					{ name: 'Warranty', value: '3 years' },
					{ name: 'Color', value: 'Silver' },
				],
				rating: 4.8,
				ratingCount: 85,
			},
			{
				name: 'Designer Men\'s Jacket',
				description: 'Premium leather jacket for men',
				price: 299,
				comparePrice: 399,
				salePrice: 249,
				saleStart: new Date('2024-03-01'),
				saleEnd: new Date('2024-03-15'),
				imageUrl: 'https://example.com/images/mens-jacket.jpg',
				images: [
					{ url: 'https://example.com/images/mens-jacket-1.jpg', alt: 'Front view', isDefault: true },
					{ url: 'https://example.com/images/mens-jacket-2.jpg', alt: 'Back view' },
				],
				category: mensClothing._id,
				subCategories: [fashion._id],
				stock: 25,
				sku: 'MJ-2024-1',
				weight: 0.8,
				dimensions: { height: 70, width: 50, length: 5, unit: 'cm' },
				tags: ['best-seller', 'featured'],
				attributes: [
					{ name: 'Size', value: 'L' },
					{ name: 'Color', value: 'Black' },
					{ name: 'Material', value: 'Genuine Leather' },
				],
				variants: [
					{
						name: 'Large Black',
						sku: 'MJ-2024-1-LB',
						price: 299,
						stock: 10,
						attributes: [
							{ name: 'Size', value: 'L' },
							{ name: 'Color', value: 'Black' },
						],
					},
					{
						name: 'Extra Large Black',
						sku: 'MJ-2024-1-XLB',
						price: 299,
						stock: 15,
						attributes: [
							{ name: 'Size', value: 'XL' },
							{ name: 'Color', value: 'Black' },
						],
					},
				],
				rating: 4.7,
				ratingCount: 65,
			},
		]);

		// Create banners
		const banners = await Banner.create([
			{
				title: 'Summer Sale',
				subtitle: 'Up to 50% off on selected items',
				description: 'Don\'t miss out on our biggest sale of the season',
				imageUrl: 'https://example.com/images/summer-sale.jpg',
				mobileImageUrl: 'https://example.com/images/summer-sale-mobile.jpg',
				link: '/sale',
				position: 1,
				targetDevice: 'all',
				backgroundColor: '#FF5733',
				textColor: '#FFFFFF',
				buttonText: 'Shop Now',
				buttonColor: '#FFFFFF',
				buttonTextColor: '#FF5733',
				status: 'scheduled',
				startDate: new Date('2024-05-01'),
				endDate: new Date('2024-05-31'),
				displayRules: {
					showOnHomepage: true,
					showOnCategory: true,
					showOnProduct: false,
					showOnCart: false,
					showOnCheckout: false,
				},
				targetCategories: [electronics._id, fashion._id],
				metaTitle: 'Summer Sale - Up to 50% Off',
				metaDescription: 'Shop our summer sale with discounts up to 50% on selected items',
				metaKeywords: ['summer sale', 'discount', 'offers'],
			},
			{
				title: 'New Arrivals',
				subtitle: 'Discover the latest products',
				description: 'Check out our newest additions to the collection',
				imageUrl: 'https://example.com/images/new-arrivals.jpg',
				mobileImageUrl: 'https://example.com/images/new-arrivals-mobile.jpg',
				link: '/new-arrivals',
				position: 2,
				targetDevice: 'all',
				backgroundColor: '#4A90E2',
				textColor: '#FFFFFF',
				buttonText: 'Explore',
				buttonColor: '#FFFFFF',
				buttonTextColor: '#4A90E2',
				status: 'active',
				startDate: new Date(),
				displayRules: {
					showOnHomepage: true,
					showOnCategory: false,
					showOnProduct: false,
					showOnCart: false,
					showOnCheckout: false,
				},
				targetCategories: [electronics._id],
				metaTitle: 'New Arrivals - Latest Products',
				metaDescription: 'Discover our latest product arrivals and stay ahead of the trends',
				metaKeywords: ['new arrivals', 'latest products', 'trending'],
			},
			{
				title: 'Limited Time Offer',
				subtitle: 'Special discounts on electronics',
				description: 'Hurry! Limited time offers on selected electronics',
				imageUrl: 'https://example.com/images/electronics-offer.jpg',
				mobileImageUrl: 'https://example.com/images/electronics-offer-mobile.jpg',
				link: '/electronics-offer',
				position: 3,
				targetDevice: 'desktop',
				backgroundColor: '#2ECC71',
				textColor: '#FFFFFF',
				buttonText: 'View Offers',
				buttonColor: '#FFFFFF',
				buttonTextColor: '#2ECC71',
				status: 'active',
				startDate: new Date(),
				endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
				displayRules: {
					showOnHomepage: true,
					showOnCategory: true,
					showOnProduct: true,
					showOnCart: false,
					showOnCheckout: false,
				},
				targetCategories: [electronics._id],
				targetProducts: [products[0]._id, products[1]._id],
				metaTitle: 'Limited Time Electronics Offers',
				metaDescription: 'Special discounts on selected electronics for a limited time',
				metaKeywords: ['electronics', 'offers', 'discounts'],
			},
		]);

		logger.info('Database seeded successfully');

		// Only exit if called directly from command line
		if (require.main === module) {
			process.exit(0);
		}
	} catch (error) {
		logger.error('Error seeding database:', error);
		
		// Only exit if called directly from command line
		if (require.main === module) {
			process.exit(1);
		} else {
			throw error;
		}
	}
};

// Export the function
module.exports = seedDatabase;

// Run the seed script if called directly
if (require.main === module) {
	seedDatabase(); }