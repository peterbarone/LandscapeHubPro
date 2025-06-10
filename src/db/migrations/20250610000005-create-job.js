'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      companyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      propertyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM(
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
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      scheduledStartTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      scheduledEndTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      actualStartTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualEndTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      estimatedDuration: {
        type: Sequelize.INTEGER,
        comment: 'Duration in minutes',
        allowNull: true
      },
      isRecurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      recurringPattern: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium'
      },
      assignedTo: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estimatedCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      actualCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      invoiceId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      weatherConditions: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      serviceItems: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      completionNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      clientSignature: {
        type: Sequelize.STRING,
        allowNull: true
      },
      completionPhotos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
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
    
    // Add indexes for faster lookups
    await queryInterface.addIndex('Jobs', ['companyId']);
    await queryInterface.addIndex('Jobs', ['propertyId']);
    await queryInterface.addIndex('Jobs', ['clientId']);
    await queryInterface.addIndex('Jobs', ['status']);
    await queryInterface.addIndex('Jobs', ['scheduledDate']);
    
    // Add composite indexes for common queries
    await queryInterface.addIndex('Jobs', ['companyId', 'status', 'scheduledDate']);
    await queryInterface.addIndex('Jobs', ['companyId', 'jobType', 'scheduledDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Jobs');
  }
};
