const AppError = require('./AppError');

/**
 * Wraps an async function to catch errors and pass them to the error handling middleware
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - A new function that handles errors
 */
const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

module.exports = catchAsync; 