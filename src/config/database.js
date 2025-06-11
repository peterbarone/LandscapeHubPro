require('dotenv').config();

// Parse connection string to extract SSL parameters if present
const parseConnectionString = (connString) => {
  if (!connString || typeof connString !== 'string') return { useSSL: false };
  
  const useSSL = connString.includes('sslmode=require') || connString.includes('ssl=true');
  return { useSSL };
};

const useConnectionString = process.env.DB_USE_CONNECTION_STRING === 'true' || 
  (process.env.DB_HOST && (process.env.DB_HOST.includes('postgres://') || process.env.DB_HOST.includes('postgresql://')));

// Common SSL options for connection strings and regular connections
const getDialectOptions = (env) => {
  // For connection strings, parse SSL settings
  if (useConnectionString && process.env.DB_HOST) {
    const { useSSL } = parseConnectionString(process.env.DB_HOST);
    
    // If connection string has SSL enabled or we want to force SSL
    if (useSSL || process.env.DB_SSL === 'true') {
      return {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false // IMPORTANT: Allows self-signed certificates
          }
        }
      };
    }
  } 
  // For individual params, check DB_SSL env var
  else if (process.env.DB_SSL === 'true') {
    return {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    };
  }
  
  return {}; // No SSL options
};

module.exports = {
  development: {
    ...(useConnectionString ? {
      url: process.env.DB_HOST,
      dialect: 'postgres',
    } : {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'landscapehub',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: 'postgres',
    }),
    ...getDialectOptions('development'),
    logging: console.log,
  },
  test: {
    ...(useConnectionString ? {
      url: process.env.DB_HOST,
      dialect: 'postgres',
    } : {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'landscapehub_test',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: 'postgres',
    }),
    logging: false,
  },
  production: {
    ...(useConnectionString ? {
      url: process.env.DB_HOST,
      dialect: 'postgres',
    } : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: 'postgres',
    }),
    ...getDialectOptions('production'),
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
