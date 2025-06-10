'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      propertyType: {
        type: Sequelize.ENUM('residential', 'commercial', 'industrial', 'institutional', 'other'),
        defaultValue: 'residential'
      },
      lotSize: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Size in acres'
      },
      lawnArea: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Size in square feet'
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      satelliteImageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      features: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      zones: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
    
    // Add index on clientId for faster lookups
    await queryInterface.addIndex('Properties', ['clientId']);
    
    // Add index on address and zipCode
    await queryInterface.addIndex('Properties', ['address', 'zipCode']);
    
    // Add geospatial index for location-based queries
    await queryInterface.addIndex('Properties', ['latitude', 'longitude']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Properties');
  }
};
