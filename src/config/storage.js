require('dotenv').config();
const AWS = require('aws-sdk');

const s3Config = {
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
  accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  s3ForcePathStyle: true, // Needed for MinIO
  signatureVersion: 'v4',
  sslEnabled: process.env.MINIO_USE_SSL === 'true'
};

// Initialize S3 client with MinIO configuration
const s3 = new AWS.S3(s3Config);

// Default bucket name
const bucketName = process.env.MINIO_BUCKET || 'landscapehub';

// Ensure bucket exists
const initializeStorage = async () => {
  try {
    // Check if bucket exists
    await s3.headBucket({ Bucket: bucketName }).promise();
    console.log(`Bucket ${bucketName} already exists`);
  } catch (error) {
    if (error.code === 'NotFound' || error.code === 'NoSuchBucket') {
      // Create the bucket
      await s3.createBucket({ Bucket: bucketName }).promise();
      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.error('Error initializing storage:', error);
    }
  }
};

module.exports = {
  s3,
  bucketName,
  initializeStorage
};
