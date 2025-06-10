const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  subscriptionTier: {
    type: DataTypes.ENUM('free', 'basic', 'professional', 'enterprise'),
    defaultValue: 'basic'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'trial', 'expired', 'cancelled'),
    defaultValue: 'trial'
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['name']
    }
  ]
});

module.exports = Company;
