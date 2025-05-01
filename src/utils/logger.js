const winston = require('winston');
const path = require('path');
const config = require('../config/config');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
	let msg = `${timestamp} [${level}]: ${message}`;
	if (stack) {
		msg += `\n${stack}`;
	}
	return msg;
});

// Custom format for file output
const fileFormat = combine(
	timestamp(),
	errors({ stack: true }),
	json()
);

const logger = winston.createLogger({
	level: config.logging.level,
	format: fileFormat,
	transports: [
		// File transport for all logs
		new winston.transports.File({
			filename: path.join(config.logging.filePath),
			maxsize: config.logging.maxSize,
			maxFiles: config.logging.maxFiles,
			format: fileFormat,
		}),
		// File transport for errors only
		new winston.transports.File({
			filename: path.join('logs/error.log'),
			level: 'error',
			maxsize: config.logging.maxSize,
			maxFiles: config.logging.maxFiles,
			format: fileFormat,
		}),
		// Console transport with colors
		new winston.transports.Console({
			format: combine(
				colorize(),
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				consoleFormat
			),
		}),
	],
	// Handle uncaught exceptions
	exceptionHandlers: [
		new winston.transports.File({
			filename: path.join('logs/exceptions.log'),
			maxsize: config.logging.maxSize,
			maxFiles: config.logging.maxFiles,
		}),
	],
	// Handle unhandled rejections
	rejectionHandlers: [
		new winston.transports.File({
			filename: path.join('logs/rejections.log'),
			maxsize: config.logging.maxSize,
			maxFiles: config.logging.maxFiles,
		}),
	],
});

// Create a stream object for Morgan
logger.stream = {
	write: (message) => {
		logger.info(message.trim());
	},
};

// Helper methods for different log levels
logger.info = (message, meta) => {
	logger.log('info', message, meta);
};

logger.error = (message, meta) => {
	logger.log('error', message, meta);
};

logger.warn = (message, meta) => {
	logger.log('warn', message, meta);
};

logger.debug = (message, meta) => {
	logger.log('debug', message, meta);
};

module.exports = logger; 