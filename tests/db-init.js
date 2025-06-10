/**
 * This script helps initialize the test database with proper schema and seed data
 * Run with: node tests/db-init.js
 */
require('dotenv').config({ path: '.env.test' });
const { sequelize } = require('../src/db');
const { setupAssociations } = require('../src/db/models');
const { exec } = require('child_process');
const logger = require('../src/utils/logger');

async function initTestDatabase() {
  try {
    logger.info('Setting up test database...');
    
    // Test the database connection
    await sequelize.authenticate();
    logger.info('Database connection successful');
    
    // Set up model associations
    setupAssociations();
    
    // Sync all models with force: true to recreate tables
    logger.info('Dropping and recreating all tables...');
    await sequelize.sync({ force: true });
    
    // Run seeders
    logger.info('Running seeders...');
    exec('npm run db:seed', (error, stdout, stderr) => {
      if (error) {
        logger.error(`Seed execution error: ${error}`);
        return;
      }
      
      if (stderr) {
        logger.warn(`Seed stderr: ${stderr}`);
      }
      
      logger.info(`Seed output: ${stdout}`);
      logger.info('Test database initialization complete!');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Error initializing test database:', error);
    process.exit(1);
  }
}

// Run the initialization
initTestDatabase();
