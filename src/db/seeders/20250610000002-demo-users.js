'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { COMPANY_IDS } = require('./20250610000001-demo-companies');

// Create fixed UUIDs for reference in other seeders
const USER_IDS = {
  GREEN_GARDENS_ADMIN: uuidv4(),
  GREEN_GARDENS_MANAGER: uuidv4(),
  GREEN_GARDENS_CREW: uuidv4(),
  BLUE_SKY_ADMIN: uuidv4(),
  BLUE_SKY_CREW: uuidv4()
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate password hashes
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Password123!', salt);
    
    return queryInterface.bulkInsert('Users', [
      {
        id: USER_IDS.GREEN_GARDENS_ADMIN,
        email: 'admin@greengardens.example.com',
        passwordHash: defaultPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: 'admin',
        companyId: COMPANY_IDS.GREEN_GARDENS,
        phoneNumber: '217-555-1000',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: USER_IDS.GREEN_GARDENS_MANAGER,
        email: 'manager@greengardens.example.com',
        passwordHash: defaultPassword,
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'manager',
        companyId: COMPANY_IDS.GREEN_GARDENS,
        phoneNumber: '217-555-1001',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: USER_IDS.GREEN_GARDENS_CREW,
        email: 'crew@greengardens.example.com',
        passwordHash: defaultPassword,
        firstName: 'Michael',
        lastName: 'Davis',
        role: 'crew',
        companyId: COMPANY_IDS.GREEN_GARDENS,
        phoneNumber: '217-555-1002',
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: USER_IDS.BLUE_SKY_ADMIN,
        email: 'admin@blueskylawn.example.com',
        passwordHash: defaultPassword,
        firstName: 'Sarah',
        lastName: 'Thompson',
        role: 'admin',
        companyId: COMPANY_IDS.BLUE_SKY,
        phoneNumber: '310-555-5001',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: USER_IDS.BLUE_SKY_CREW,
        email: 'crew@blueskylawn.example.com',
        passwordHash: defaultPassword,
        firstName: 'David',
        lastName: 'Wilson',
        role: 'crew',
        companyId: COMPANY_IDS.BLUE_SKY,
        phoneNumber: '310-555-5002',
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

// Export user IDs for reference in other seeders
module.exports.USER_IDS = USER_IDS;
