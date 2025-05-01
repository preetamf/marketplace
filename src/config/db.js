const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./config');

const connectDB = async () => {
	try {
		const { uri, username, password, options } = config.mongodb;

		// Add authentication if credentials are provided
		if (username && password) {
			options.auth = {
				username,
				password,
			};
		}

		// Set up event listeners
		mongoose.connection.on('connected', () => {
			logger.info('MongoDB connected successfully');
		});

		mongoose.connection.on('error', (err) => {
			logger.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			logger.warn('MongoDB disconnected');
		});

		mongoose.connection.on('reconnected', () => {
			logger.info('MongoDB reconnected');
		});

		// Connect to MongoDB
		await mongoose.connect(uri, options);
		logger.info('MongoDB connection established');

		// Handle graceful shutdown
		const gracefulShutdown = async (signal) => {
			logger.info(`${signal} received. Closing MongoDB connection...`);
			try {
				await mongoose.connection.close();
				logger.info('MongoDB connection closed through app termination');
				process.exit(0);
			} catch (err) {
				logger.error('Error during MongoDB connection closure:', err);
				process.exit(1);
			}
		};

		// Listen for termination signals
		process.on('SIGINT', () => gracefulShutdown('SIGINT'));
		process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
		process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

		// Handle unhandled promise rejections
		process.on('unhandledRejection', (err) => {
			logger.error('Unhandled Promise Rejection:', err);
			gracefulShutdown('unhandledRejection');
		});

	} catch (error) {
		logger.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

module.exports = connectDB; 