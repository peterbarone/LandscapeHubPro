const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const Job = sequelize.define('Job', {
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
  propertyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Properties',
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'draft',
      'scheduled',
      'in_progress',
      'completed',
      'cancelled',
      'on_hold'
    ),
    defaultValue: 'draft'
  },
  jobType: {
    type: DataTypes.ENUM(
      'maintenance',
      'landscaping',
      'hardscaping',
      'irrigation',
      'planting',
      'cleanup',
      'other'
    ),
    defaultValue: 'maintenance'
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  scheduledStartTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  scheduledEndTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  actualStartTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualEndTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes',
    allowNull: true
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringPattern: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Pattern for recurring jobs'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  assignedTo: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: true,
    comment: 'Array of User IDs assigned to this job'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  actualCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Reference to the invoice for this job'
  },
  weatherConditions: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  serviceItems: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'List of services included in this job'
  },
  completionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  clientSignature: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL to client signature image'
  },
  completionPhotos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    comment: 'URLs to job completion photos'
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['companyId']
    },
    {
      fields: ['propertyId']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['scheduledDate']
    }
  ]
});

module.exports = Job;
