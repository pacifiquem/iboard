import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import logger, { morganStream } from './config/logger';
import { testConnection } from './config/database';
import {
  corsOptions,
  helmetConfig,
  sanitizeRequest,
  requestLogger,
  errorHandler,
  notFoundHandler,
  compression,
} from './middleware/security';
import { generalLimiter, speedLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './config/swagger';
import apiRoutes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(compression());

// Rate limiting and speed limiting
app.use(generalLimiter);
app.use(speedLimiter);

// Request parsing and sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequest);

// Logging middleware
app.use(morgan('combined', { stream: morganStream }));
app.use(requestLogger);

// Setup Swagger documentation
setupSwagger(app);

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'IBoard Server is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      health: '/api/health',
      ideas: '/api/ideas',
      docs: '/api-docs',
    },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API available at: http://localhost:${PORT}/api`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
  
  // Test database connection on startup
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('Failed to connect to database on startup');
    process.exit(1);
  }
  
  logger.info('Server startup completed successfully');
});

export default app;
