const { Sequelize } = require('sequelize');
const config = require('../config/database');
const logger = require('../utils/logger');

// Determine which environment we're in
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ? msg => logger.debug(msg) : false,
    pool: dbConfig.pool || {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: dbConfig.dialectOptions
  }
);

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
