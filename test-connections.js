require('dotenv').config();
const { Sequelize } = require('sequelize');
const AWS = require('aws-sdk');
const pg = require('pg');

console.log('---------------------------------------------');
console.log('LandscapeHubPro Connection Test Tool');
console.log('---------------------------------------------');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('Running connection tests...');

// Test database connection direct with pg
async function testPgConnection() {
  console.log('\n1. Testing PostgreSQL connection with native pg driver:');
  
  try {
    // Get connection information
    const dbHost = process.env.DB_HOST || 'localhost';
    console.log('DB_HOST:', dbHost);
    
    // Check if it's a connection string
    if (dbHost.includes('postgres://') || dbHost.includes('postgresql://')) {
      console.log('Detected connection string format');
      
      // Create Client with connection string
      const client = new pg.Client({
        connectionString: dbHost,
        ssl: {
          rejectUnauthorized: false
        }
      });
      
      await client.connect();
      console.log('✅ PostgreSQL connection SUCCESS (pg driver)');
      const res = await client.query('SELECT NOW() as time');
      console.log('   Server time:', res.rows[0].time);
      await client.end();
    } else {
      console.log('Using separate connection parameters');
      const client = new pg.Client({
        host: dbHost,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
        } : false
      });
      
      await client.connect();
      console.log('✅ PostgreSQL connection SUCCESS (pg driver)');
      const res = await client.query('SELECT NOW() as time');
      console.log('   Server time:', res.rows[0].time);
      await client.end();
    }
  } catch (error) {
    console.error('❌ PostgreSQL connection FAILED (pg driver)');
    console.error('   Error:', error.message);
    console.error('   Detail:', error);
  }
}

// Test database connection with Sequelize
async function testSequelizeConnection() {
  console.log('\n2. Testing PostgreSQL connection with Sequelize:');
  
  try {
    // Get connection information
    const dbHost = process.env.DB_HOST || 'localhost';
    
    let sequelize;
    if (dbHost.includes('postgres://') || dbHost.includes('postgresql://')) {
      console.log('Using connection string with Sequelize');
      sequelize = new Sequelize(dbHost, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      });
    } else {
      console.log('Using separate connection parameters with Sequelize');
      sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD, 
        {
          host: dbHost,
          port: process.env.DB_PORT || 5432,
          dialect: 'postgres',
          logging: false,
          dialectOptions: process.env.DB_SSL === 'true' ? {
            ssl: {
              require: true,
              rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
            }
          } : {}
        }
      );
    }
    
    await sequelize.authenticate();
    console.log('✅ Sequelize connection SUCCESS');
    
    const [results] = await sequelize.query('SELECT NOW() as time');
    console.log('   Server time:', results[0].time);
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Sequelize connection FAILED');
    console.error('   Error:', error.message);
    if (error.original) {
      console.error('   Original error:', error.original.message);
    }
  }
}

// Test MinIO connection
async function testMinioConnection() {
  console.log('\n3. Testing MinIO connection:');
  
  try {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000');
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;
    const bucketName = process.env.MINIO_BUCKET;
    
    console.log(`   Endpoint: ${endpoint}:${port} (SSL: ${useSSL ? 'Yes' : 'No'})`);
    console.log(`   Bucket: ${bucketName}`);
    
    if (!accessKey || !secretKey) {
      throw new Error('Missing MinIO credentials');
    }
    
    const s3 = new AWS.S3({
      endpoint: `${useSSL ? 'https' : 'http'}://${endpoint}:${port}`,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    
    const result = await s3.headBucket({ Bucket: bucketName }).promise();
    console.log('✅ MinIO connection SUCCESS');
    
  } catch (error) {
    console.error('❌ MinIO connection FAILED');
    console.error('   Error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testPgConnection();
    await testSequelizeConnection();
    await testMinioConnection();
    
    console.log('\n---------------------------------------------');
    console.log('Connection tests completed.');
    console.log('---------------------------------------------');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runAllTests();
