const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
	// Server Configuration
	port: process.env.PORT || 3001,
	nodeEnv: process.env.NODE_ENV || 'development',
	apiVersion: process.env.API_VERSION || 'v1',

	// MongoDB Configuration
	mongodb: {
		uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marketplace',
		options: {
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		},
	},

	// Rate Limiting
	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
		max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
		message: 'Too many requests from this IP, please try again later',
	},

	// Logging
	logging: {
		level: process.env.LOG_LEVEL || 'info',
		filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
		maxSize: 5242880, // 5MB
		maxFiles: 5,
	},

	// Security
	security: {
		jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
		jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
		corsOptions: {
			origin: process.env.CORS_ORIGIN || '*',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		},
	},

	// API
	api: {
		prefix: '/api',
		timeout: 30000, // 30 seconds
		maxBodySize: '10mb',
	},
};

module.exports = config; 