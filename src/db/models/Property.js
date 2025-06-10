const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  propertyType: {
    type: DataTypes.ENUM('residential', 'commercial', 'industrial', 'institutional', 'other'),
    defaultValue: 'residential'
  },
  lotSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Size in acres'
  },
  lawnArea: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Size in square feet'
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  satelliteImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Stores property features like irrigation system, pool, etc.
  features: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  // Stores zones within the property
  zones: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['clientId']
    },
    {
      fields: ['address', 'zipCode']
    }
  ]
});

module.exports = Property;
