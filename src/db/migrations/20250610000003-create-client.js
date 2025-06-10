'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clients', {
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
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      billingFrequency: {
        type: Sequelize.ENUM('weekly', 'biweekly', 'monthly', 'quarterly', 'annually'),
        defaultValue: 'monthly'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      clientSince: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    
    // Add index on companyId
    await queryInterface.addIndex('Clients', ['companyId']);
    
    // Add index on name
    await queryInterface.addIndex('Clients', ['lastName', 'firstName']);
    
    // Add unique constraint on company and email
    await queryInterface.addIndex('Clients', ['companyId', 'email'], {
      unique: true,
      where: {
        email: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Clients');
  }
};
