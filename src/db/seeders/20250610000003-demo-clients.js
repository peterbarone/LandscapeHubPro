'use strict';
const { v4: uuidv4 } = require('uuid');
const { COMPANY_IDS } = require('./20250610000001-demo-companies');

// Create fixed UUIDs for reference in other seeders
const CLIENT_IDS = {
  GREEN_GARDENS_CLIENT1: uuidv4(),
  GREEN_GARDENS_CLIENT2: uuidv4(),
  BLUE_SKY_CLIENT1: uuidv4(),
  BLUE_SKY_CLIENT2: uuidv4()
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Clients', [
      {
        id: CLIENT_IDS.GREEN_GARDENS_CLIENT1,
        companyId: COMPANY_IDS.GREEN_GARDENS,
        firstName: 'Robert',
        lastName: 'Anderson',
        email: 'randerson@example.com',
        phoneNumber: '217-555-2001',
        address: '789 Pine Road',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702',
        notes: 'Prefers service on Tuesdays or Thursdays.',
        billingFrequency: 'monthly',
        isActive: true,
        clientSince: new Date(2024, 1, 15), // February 15, 2024
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: CLIENT_IDS.GREEN_GARDENS_CLIENT2,
        companyId: COMPANY_IDS.GREEN_GARDENS,
        firstName: 'Jennifer',
        lastName: 'Martinez',
        email: 'jmartinez@example.com',
        phoneNumber: '217-555-2002',
        address: '101 Maple Avenue',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62703',
        notes: 'Has a dog that needs to be kept indoors during service.',
        billingFrequency: 'biweekly',
        isActive: true,
        clientSince: new Date(2024, 3, 10), // April 10, 2024
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: CLIENT_IDS.BLUE_SKY_CLIENT1,
        companyId: COMPANY_IDS.BLUE_SKY,
        firstName: 'William',
        lastName: 'Taylor',
        email: 'wtaylor@example.com',
        phoneNumber: '310-555-6001',
        address: '555 Beach Boulevard',
        city: 'Riverdale',
        state: 'CA',
        zipCode: '90211',
        notes: 'Has specific plants that require special care.',
        billingFrequency: 'monthly',
        isActive: true,
        clientSince: new Date(2024, 2, 5), // March 5, 2024
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: CLIENT_IDS.BLUE_SKY_CLIENT2,
        companyId: COMPANY_IDS.BLUE_SKY,
        firstName: 'Lisa',
        lastName: 'Brown',
        email: 'lbrown@example.com',
        phoneNumber: '310-555-6002',
        address: '222 Sunset Drive',
        city: 'Riverdale',
        state: 'CA',
        zipCode: '90212',
        notes: 'Requests service only before noon.',
        billingFrequency: 'quarterly',
        isActive: true,
        clientSince: new Date(2024, 4, 20), // May 20, 2024
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Clients', null, {});
  }
};

// Export client IDs for reference in other seeders
module.exports.CLIENT_IDS = CLIENT_IDS;
