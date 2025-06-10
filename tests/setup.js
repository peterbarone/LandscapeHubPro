require('dotenv').config({ path: '.env.test' });
const { sequelize } = require('../src/db');

// Increase test timeout
jest.setTimeout(30000);

// Global setup before all tests
beforeAll(async () => {
  // Connect to the test database
  try {
    await sequelize.authenticate();
    console.log('Test database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
  }
});

// Global teardown after all tests
afterAll(async () => {
  // Close database connection
  await sequelize.close();
});
