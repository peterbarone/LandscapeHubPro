'use strict';
const { v4: uuidv4 } = require('uuid');
const { CLIENT_IDS } = require('./20250610000003-demo-clients');

// Create fixed UUIDs for reference in other seeders
const PROPERTY_IDS = {
  GREEN_GARDENS_PROPERTY1: uuidv4(),
  GREEN_GARDENS_PROPERTY2: uuidv4(),
  GREEN_GARDENS_PROPERTY3: uuidv4(),
  BLUE_SKY_PROPERTY1: uuidv4(),
  BLUE_SKY_PROPERTY2: uuidv4()
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Properties', [
      {
        id: PROPERTY_IDS.GREEN_GARDENS_PROPERTY1,
        clientId: CLIENT_IDS.GREEN_GARDENS_CLIENT1,
        name: 'Main Residence',
        address: '789 Pine Road',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702',
        propertyType: 'residential',
        lotSize: 0.25,
        lawnArea: 5000,
        latitude: 39.781721,
        longitude: -89.650148,
        notes: 'Front lawn requires weekly mowing during growing season.',
        isActive: true,
        satelliteImageUrl: null,
        features: JSON.stringify({
          hasIrrigationSystem: true,
          hasPool: false,
          hasPatio: true,
          hasGarden: true
        }),
        zones: JSON.stringify({
          frontLawn: { area: 2000, type: 'lawn', notes: 'Weekly mowing' },
          backLawn: { area: 3000, type: 'lawn', notes: 'Weekly mowing' },
          gardenBeds: { area: 500, type: 'garden', notes: 'Monthly maintenance' }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: PROPERTY_IDS.GREEN_GARDENS_PROPERTY2,
        clientId: CLIENT_IDS.GREEN_GARDENS_CLIENT1,
        name: 'Vacation Home',
        address: '123 Lakeside Lane',
        city: 'Lake Springfield',
        state: 'IL',
        zipCode: '62707',
        propertyType: 'residential',
        lotSize: 0.5,
        lawnArea: 8000,
        latitude: 39.699793,
        longitude: -89.637150,
        notes: 'Service only needed between May and September.',
        isActive: true,
        satelliteImageUrl: null,
        features: JSON.stringify({
          hasIrrigationSystem: false,
          hasPool: false,
          hasPatio: true,
          hasGarden: true,
          hasDock: true
        }),
        zones: JSON.stringify({
          lakeFront: { area: 1500, type: 'specialty', notes: 'Erosion control needed' },
          lawn: { area: 8000, type: 'lawn', notes: 'Biweekly mowing' }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: PROPERTY_IDS.GREEN_GARDENS_PROPERTY3,
        clientId: CLIENT_IDS.GREEN_GARDENS_CLIENT2,
        name: 'Primary Residence',
        address: '101 Maple Avenue',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62703',
        propertyType: 'residential',
        lotSize: 0.33,
        lawnArea: 6500,
        latitude: 39.763393,
        longitude: -89.614809,
        notes: 'Has newly planted trees that need special care.',
        isActive: true,
        satelliteImageUrl: null,
        features: JSON.stringify({
          hasIrrigationSystem: true,
          hasPool: true,
          hasPatio: true,
          hasGarden: true
        }),
        zones: JSON.stringify({
          frontYard: { area: 2500, type: 'lawn', notes: 'Weekly mowing' },
          backYard: { area: 4000, type: 'lawn', notes: 'Weekly mowing' },
          poolArea: { area: 800, type: 'specialty', notes: 'Landscaping around pool' }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: PROPERTY_IDS.BLUE_SKY_PROPERTY1,
        clientId: CLIENT_IDS.BLUE_SKY_CLIENT1,
        name: 'Primary Residence',
        address: '555 Beach Boulevard',
        city: 'Riverdale',
        state: 'CA',
        zipCode: '90211',
        propertyType: 'residential',
        lotSize: 0.2,
        lawnArea: 3500,
        latitude: 34.084381,
        longitude: -118.380872,
        notes: 'Drought-resistant landscaping throughout property.',
        isActive: true,
        satelliteImageUrl: null,
        features: JSON.stringify({
          hasIrrigationSystem: true,
          hasPool: true,
          hasPatio: true,
          hasGarden: true,
          droughtResistant: true
        }),
        zones: JSON.stringify({
          frontYard: { area: 1500, type: 'xeriscape', notes: 'Low water plants' },
          backYard: { area: 2000, type: 'mixed', notes: 'Partial lawn, partial xeriscape' }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: PROPERTY_IDS.BLUE_SKY_PROPERTY2,
        clientId: CLIENT_IDS.BLUE_SKY_CLIENT2,
        name: 'Residence',
        address: '222 Sunset Drive',
        city: 'Riverdale',
        state: 'CA',
        zipCode: '90212',
        propertyType: 'residential',
        lotSize: 0.15,
        lawnArea: 2500,
        latitude: 34.077761,
        longitude: -118.391642,
        notes: 'Small property with native California plants.',
        isActive: true,
        satelliteImageUrl: null,
        features: JSON.stringify({
          hasIrrigationSystem: true,
          hasPool: false,
          hasPatio: true,
          hasGarden: true,
          nativePlants: true
        }),
        zones: JSON.stringify({
          entireYard: { area: 2500, type: 'native', notes: 'California native plants' }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Properties', null, {});
  }
};

// Export property IDs for reference in other seeders
module.exports.PROPERTY_IDS = PROPERTY_IDS;
