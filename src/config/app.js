const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('../middleware/error.middleware');

const limiter = rateLimit({
	windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
	max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later',
});

const configureApp = (app) => {
	// Security middleware
	app.use(helmet());
	app.use(cors());

	// Body parsing middleware
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Rate limiting
	app.use(limiter);

	// Error handling
	app.use(errorHandler);
};

module.exports = configureApp; 