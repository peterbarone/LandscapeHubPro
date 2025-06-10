'use strict';
const { v4: uuidv4 } = require('uuid');

// Create fixed UUIDs for reference in other seeders
const COMPANY_IDS = {
  GREEN_GARDENS: uuidv4(),
  BLUE_SKY: uuidv4()
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Companies', [
      {
        id: COMPANY_IDS.GREEN_GARDENS,
        name: 'Green Gardens Landscaping',
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        phoneNumber: '217-555-1234',
        email: 'info@greengardens.example.com',
        website: 'https://greengardens.example.com',
        description: 'Full-service landscaping company specializing in sustainable garden design and maintenance.',
        isActive: true,
        subscriptionTier: 'professional',
        subscriptionStatus: 'active',
        trialEndsAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: COMPANY_IDS.BLUE_SKY,
        name: 'Blue Sky Lawn Care',
        address: '456 Oak Avenue',
        city: 'Riverdale',
        state: 'CA',
        zipCode: '90210',
        phoneNumber: '310-555-5678',
        email: 'contact@blueskylawn.example.com',
        website: 'https://blueskylawn.example.com',
        description: 'Residential and commercial lawn care services with a focus on water conservation.',
        isActive: true,
        subscriptionTier: 'basic',
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Companies', null, {});
  }
};

// Export company IDs for reference in other seeders
module.exports.COMPANY_IDS = COMPANY_IDS;
