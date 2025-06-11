const { Sequelize } = require('sequelize');
const config = require('../config/database');
const logger = require('../utils/logger');
require('dotenv').config();

// Determine which environment we're in
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
let sequelize;

// Common options for both connection methods
const commonOptions = {
  dialect: 'postgres',
  logging: dbConfig.logging ? msg => logger.debug(msg) : false,
  pool: dbConfig.pool || {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Allows connecting to servers with self-signed certificates
    }
  }
};

try {
  // Handle both connection string URL and separate parameters
  if (dbConfig.url) {
    // If a connection URL is provided, use it directly
    logger.info('Initializing database using connection string');
    sequelize = new Sequelize(dbConfig.url, commonOptions);
  } else {
    // Otherwise use individual connection parameters
    logger.info('Initializing database using individual connection parameters');
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        ...commonOptions,
        host: dbConfig.host,
        port: dbConfig.port
      }
    );
  }
} catch (error) {
  logger.error('Failed to initialize database connection:', error);
  process.exit(1);
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize
};
