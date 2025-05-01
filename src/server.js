require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const seedDatabase = require('./data/seed');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	logger.error(`${err.name}: ${err.message}`);
	if (err.stack) {
		logger.error(err.stack);
	}
	process.exit(1);
});

// Check if database is empty and seed if needed
const checkAndSeedDatabase = async () => {
	try {
		const [categoryCount, productCount, bannerCount] = await Promise.all([
			Category.countDocuments(),
			Product.countDocuments(),
			Banner.countDocuments(),
		]);

		if (categoryCount === 0 && productCount === 0 && bannerCount === 0) {
			logger.info('Database is empty. Running seed script...');
			await seedDatabase();
			logger.info('Database seeded successfully');
		} else {
			logger.info('Database already contains data. Skipping seed script.');
		}
	} catch (err) {
		logger.error('Error checking/seeding database:', err.message);
	}
};

// Connect to MongoDB
mongoose
	.connect(config.mongodb.uri, config.mongodb.options)
	.then(async () => {
		logger.info('MongoDB connected successfully');
		await checkAndSeedDatabase();
	})
	.catch((err) => {
		logger.error('MongoDB connection error:', err.message);
		process.exit(1);
	});

// Start server
const server = app.listen(config.port, () => {
	const protocol = config.nodeEnv === 'production' ? 'https' : 'http';
	const host = 'localhost';
	const port = config.port;
	const apiPrefix = config.api.prefix;
	
	logger.info(`Server is running on ${protocol}://${host}:${port}`);
	logger.info(`API Base URL: ${protocol}://${host}:${port}${apiPrefix}`);
	logger.info(`Environment: ${config.nodeEnv}`);
	logger.info(`API Version: ${config.apiVersion}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
	logger.error(`${err.name}: ${err.message}`);
	if (err.stack) {
		logger.error(err.stack);
	}
	server.close(() => {
		process.exit(1);
	});
});

// Handle SIGTERM
process.on('SIGTERM', () => {
	logger.info('SIGTERM received. Shutting down gracefully...');
	server.close(() => {
		logger.info('Process terminated');
		process.exit(0);
	});
});

// Handle SIGINT
process.on('SIGINT', async () => {
	try {
		logger.info('SIGINT received. Closing MongoDB connection...');
		await mongoose.connection.close();
		logger.info('MongoDB connection closed');
		server.close(() => {
			logger.info('Process terminated');
			process.exit(0);
		});
	} catch (err) {
		logger.error('Error closing MongoDB connection:', err.message);
		process.exit(1);
	}
}); 