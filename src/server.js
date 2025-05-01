require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const config = require('./config/config');

const PORT = config.port;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	logger.error(err.name, err.message, err.stack);
	process.exit(1);
});

const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectDB();

		// Start the server
		const server = app.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}`);
			logger.info(`Environment: ${config.nodeEnv}`);
			logger.info(`API Version: ${config.apiVersion}`);
		});

		// Handle server errors
		server.on('error', (error) => {
			if (error.syscall !== 'listen') {
				throw error;
			}

			const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

			switch (error.code) {
				case 'EACCES':
					logger.error(`${bind} requires elevated privileges`);
					process.exit(1);
					break;
				case 'EADDRINUSE':
					logger.error(`${bind} is already in use`);
					process.exit(1);
					break;
				default:
					throw error;
			}
		});

		// Handle graceful shutdown
		const gracefulShutdown = async (signal) => {
			logger.info(`${signal} received. Shutting down gracefully...`);
			try {
				server.close(() => {
					logger.info('Process terminated');
					process.exit(0);
				});
			} catch (err) {
				logger.error('Error during shutdown:', err);
				process.exit(1);
			}
		};

		// Listen for termination signals
		process.on('SIGINT', () => gracefulShutdown('SIGINT'));
		process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
		process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

	} catch (error) {
		logger.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer(); 