const express = require('express');
const morgan = require('morgan');
const configureApp = require('./config/app');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const config = require('./config/config');

const app = express();

// Configure app with middleware
configureApp(app);

// Request logging
if (config.nodeEnv === 'development') {
	app.use(morgan('dev', { stream: logger.stream }));
} else {
	app.use(morgan('combined', { stream: logger.stream }));
}

// Health check route
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Marketplace API is running',
		timestamp: new Date().toISOString(),
		version: config.apiVersion,
		environment: config.nodeEnv,
	});
});

// API routes
app.use(`${config.api.prefix}`, require('./routes'));

// 404 handler
app.use((req, res, next) => {
	next(AppError.notFound(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	// Log error
	logger.error(err);

	// Send error response
	if (config.nodeEnv === 'development') {
		res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	} else {
		// Production mode
		if (err.isOperational) {
			res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		} else {
			// Programming or unknown errors
			logger.error('ERROR 💥', err);
			res.status(500).json({
				status: 'error',
				message: 'Something went wrong!',
			});
		}
	}
});

module.exports = app; 