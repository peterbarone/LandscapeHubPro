require('dotenv').config();
const { parse } = require('pg-connection-string');

// Parse connection string if provided
const parseDbConfig = (env) => {
  // Check if DB_HOST is a connection string
  if (process.env.DB_HOST && process.env.DB_HOST.startsWith('postgres://')) {
    const config = parse(process.env.DB_HOST);
    return {
      username: config.user || process.env.DB_USER,
      password: config.password || process.env.DB_PASSWORD,
      database: config.database || process.env.DB_NAME,
      host: config.host,
      port: config.port || process.env.DB_PORT,
      dialect: 'postgres',
      logging: env === 'development',
      dialectOptions: {
        ssl: config.ssl === 'require' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    };
  }
  
  // Default configuration if not using connection string
  return {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: env === 'development'
  };
};

module.exports = {
  development: {
    ...parseDbConfig('development'),
    logging: console.log,
  },
  test: {
    ...parseDbConfig('test'),
    logging: false,
  },
  production: {
    ...parseDbConfig('production'),
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
