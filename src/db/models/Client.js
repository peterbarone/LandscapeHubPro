const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  billingFrequency: {
    type: DataTypes.ENUM('weekly', 'biweekly', 'monthly', 'quarterly', 'annually'),
    defaultValue: 'monthly'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  clientSince: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['companyId']
    },
    {
      fields: ['lastName', 'firstName']
    }
  ]
});

module.exports = Client;
