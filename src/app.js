const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const { errorHandler } = require('./middleware/error.middleware');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Marketplace API is running',
		timestamp: new Date().toISOString(),
	});
});

// Handle undefined routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

module.exports = app; 