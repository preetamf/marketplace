const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max) => {
	return rateLimit({
		windowMs, // Time window in milliseconds
		max, // Maximum number of requests per windowMs
		message: 'Too many requests from this IP, please try again later.',
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	});
};

// Create different rate limiters for different routes
const productLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const bannerLimiter = createRateLimiter(60 * 60 * 1000, 200); // 200 requests per hour
const categoryLimiter = createRateLimiter(60 * 60 * 1000, 300); // 300 requests per hour

module.exports = {
	productLimiter,
	bannerLimiter,
	categoryLimiter,
}; 