const AppError = require('./AppError');

/**
 * Wraps an async function to catch errors and pass them to the error handling middleware
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - A new function that handles errors
 */
const catchAsync = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch((err) => {
			// If the error is not an AppError, wrap it in one
			if (!(err instanceof AppError)) {
				err = new AppError(
					err.message || 'Something went wrong',
					err.statusCode || 500,
					'INTERNAL_SERVER_ERROR'
				);
			}
			next(err);
		});
	};
};

module.exports = catchAsync; 