const { sequelize } = require('../index');
const User = require('./User');
const Company = require('./Company');
const Client = require('./Client');
const Property = require('./Property');
const Job = require('./Job');

// Define model associations
function setupAssociations() {
  // Company has many Users
  Company.hasMany(User, { foreignKey: 'companyId' });
  User.belongsTo(Company, { foreignKey: 'companyId' });

  // Company has many Clients
  Company.hasMany(Client, { foreignKey: 'companyId' });
  Client.belongsTo(Company, { foreignKey: 'companyId' });

  // Client has many Properties
  Client.hasMany(Property, { foreignKey: 'clientId' });
  Property.belongsTo(Client, { foreignKey: 'clientId' });

  // Company has many Jobs
  Company.hasMany(Job, { foreignKey: 'companyId' });
  Job.belongsTo(Company, { foreignKey: 'companyId' });

  // Client has many Jobs
  Client.hasMany(Job, { foreignKey: 'clientId' });
  Job.belongsTo(Client, { foreignKey: 'clientId' });

  // Property has many Jobs
  Property.hasMany(Job, { foreignKey: 'propertyId' });
  Job.belongsTo(Property, { foreignKey: 'propertyId' });
}

module.exports = {
  sequelize,
  User,
  Company,
  Client,
  Property,
  Job,
  setupAssociations
};
