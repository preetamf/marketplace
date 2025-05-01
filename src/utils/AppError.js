class AppError extends Error {
	constructor(message, statusCode, errorCode, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.errorCode = errorCode;
		this.isOperational = isOperational;
		this.timestamp = new Date().toISOString();

		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(message = 'Bad Request', errorCode = 'BAD_REQUEST') {
		return new AppError(message, 400, errorCode);
	}

	static unauthorized(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
		return new AppError(message, 401, errorCode);
	}

	static forbidden(message = 'Forbidden', errorCode = 'FORBIDDEN') {
		return new AppError(message, 403, errorCode);
	}

	static notFound(message = 'Not Found', errorCode = 'NOT_FOUND') {
		return new AppError(message, 404, errorCode);
	}

	static conflict(message = 'Conflict', errorCode = 'CONFLICT') {
		return new AppError(message, 409, errorCode);
	}

	static validationError(message = 'Validation Error', errorCode = 'VALIDATION_ERROR') {
		return new AppError(message, 422, errorCode);
	}

	static tooManyRequests(message = 'Too Many Requests', errorCode = 'TOO_MANY_REQUESTS') {
		return new AppError(message, 429, errorCode);
	}

	static internalServerError(message = 'Internal Server Error', errorCode = 'INTERNAL_SERVER_ERROR') {
		return new AppError(message, 500, errorCode);
	}

	static serviceUnavailable(message = 'Service Unavailable', errorCode = 'SERVICE_UNAVAILABLE') {
		return new AppError(message, 503, errorCode);
	}

	toJSON() {
		return {
			status: this.status,
			statusCode: this.statusCode,
			errorCode: this.errorCode,
			message: this.message,
			timestamp: this.timestamp,
			...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
		};
	}
}

module.exports = AppError; 