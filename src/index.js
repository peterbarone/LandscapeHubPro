const app = require('./app');
const logger = require('./utils/logger');
const { testConnection } = require('./db');
const { setupAssociations } = require('./db/models');
const { initializeStorage } = require('./config/storage');

// Define port
const PORT = process.env.PORT || 3000;

// Initialize the application
const initializeApp = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('Failed to connect to the database. Exiting...');
      process.exit(1);
    }
    
    // Setup model associations
    setupAssociations();
    
    // Initialize storage (MinIO)
    await initializeStorage();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Application initialization failed:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Initialize the application
initializeApp();
