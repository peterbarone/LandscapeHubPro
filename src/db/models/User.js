const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'crew', 'client'),
    defaultValue: 'crew'
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Instance methods
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Class methods
User.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Hooks
User.beforeCreate(async (user) => {
  if (user.changed('passwordHash')) {
    user.passwordHash = User.generateHash(user.passwordHash);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash')) {
    user.passwordHash = User.generateHash(user.passwordHash);
  }
});

module.exports = User;
