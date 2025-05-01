const config = {
	// Server Configuration
	port: process.env.PORT || 3000,
	nodeEnv: 'production',
	apiVersion: process.env.API_VERSION || 'v1',

	// MongoDB Configuration
	mongodb: {
		uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/marketplace',
		options: {
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		},
	},

	// Rate Limiting
	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
		max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
		message: 'Too many requests from this IP, please try again later',
	},

	// Logging
	logging: {
		level: 'error',
		filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
		maxSize: 5242880, // 5MB
		maxFiles: 5,
	},

	// Security
	security: {
		jwtSecret: process.env.JWT_SECRET || 'your-production-secret-key',
		jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
		corsOptions: {
			origin: process.env.CORS_ORIGIN || 'https://marketplace-zra7.onrender.com',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		},
	},

	// API
	api: {
		prefix: '/api',
		timeout: parseInt(process.env.API_TIMEOUT) || 30000,
		maxBodySize: process.env.API_MAX_BODY_SIZE || '10mb',
	},
};

module.exports = config; 