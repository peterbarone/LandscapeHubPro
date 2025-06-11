const express = require('express');
const router = express.Router();
const { sequelize } = require('../../db');
const { s3, bucketName } = require('../../config/storage');
const logger = require('../../utils/logger');

// Status API endpoint
router.get('/', async (req, res) => {
  const status = {
    time: new Date().toISOString(),
    app: {
      status: 'online',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0'
    },
    database: {
      status: 'checking',
      error: null
    },
    storage: {
      status: 'checking',
      bucket: bucketName,
      endpoint: process.env.MINIO_ENDPOINT || 'localhost',
      error: null
    }
  };

  // Check database connection
  try {
    await sequelize.authenticate();
    status.database.status = 'connected';
  } catch (error) {
    status.database.status = 'error';
    status.database.error = error.message;
    logger.error('Database connection error:', error);
  }

  // Check MinIO connection
  try {
    // Add timeout to prevent long waits
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
    });
    
    const bucketPromise = s3.headBucket({ Bucket: bucketName }).promise();
    
    await Promise.race([bucketPromise, timeoutPromise]);
    status.storage.status = 'connected';
  } catch (error) {
    status.storage.status = 'error';
    status.storage.error = error.message || 'Unknown error';
    logger.error('MinIO connection error:', error);
  }

  // Render status page if HTML requested
  const acceptHeader = req.get('Accept') || '';
  if (acceptHeader.includes('text/html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LandscapeHub System Status</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f7f9;
            color: #333;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .status-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .status-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .status-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0;
          }
          .status-indicator {
            padding: 6px 12px;
            border-radius: 16px;
            font-weight: 500;
            font-size: 0.85rem;
          }
          .status-connected {
            background: #d4edda;
            color: #155724;
          }
          .status-error {
            background: #f8d7da;
            color: #721c24;
          }
          .status-checking {
            background: #fff3cd;
            color: #856404;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #eee;
            padding: 10px 0;
          }
          .detail-label {
            font-weight: 500;
            color: #6c757d;
          }
          .error-message {
            background: rgba(248,215,218,0.2);
            border-left: 3px solid #f8d7da;
            padding: 10px;
            color: #721c24;
            margin-top: 10px;
            font-family: monospace;
            white-space: pre-wrap;
            overflow-x: auto;
          }
          .timestamp {
            text-align: center;
            color: #6c757d;
            font-size: 0.9rem;
            margin-top: 30px;
          }
          .refresh-btn {
            background: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 20px 0;
            cursor: pointer;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>LandscapeHub System Status</h1>
        
        <div class="status-card">
          <div class="status-header">
            <h2 class="status-title">Application</h2>
            <span class="status-indicator status-connected">ONLINE</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Environment</span>
            <span>${status.app.environment}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Version</span>
            <span>${status.app.version}</span>
          </div>
        </div>
        
        <div class="status-card">
          <div class="status-header">
            <h2 class="status-title">Database</h2>
            <span class="status-indicator ${
              status.database.status === 'connected' ? 'status-connected' : 'status-error'
            }">
              ${status.database.status.toUpperCase()}
            </span>
          </div>
          ${
            status.database.error 
            ? `<div class="error-message">${status.database.error}</div>`
            : ''
          }
        </div>
        
        <div class="status-card">
          <div class="status-header">
            <h2 class="status-title">Storage (MinIO)</h2>
            <span class="status-indicator ${
              status.storage.status === 'connected' ? 'status-connected' : 'status-error'
            }">
              ${status.storage.status.toUpperCase()}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Bucket</span>
            <span>${status.storage.bucket}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Endpoint</span>
            <span>${status.storage.endpoint}</span>
          </div>
          ${
            status.storage.error 
            ? `<div class="error-message">${status.storage.error}</div>`
            : ''
          }
        </div>
        
        <button class="refresh-btn" onclick="window.location.reload()">Refresh Status</button>
        
        <div class="timestamp">
          Last updated: ${new Date().toLocaleString()}
        </div>
        
        <script>
          // Auto refresh every 30 seconds
          setTimeout(() => {
            window.location.reload();
          }, 30000);
        </script>
      </body>
      </html>
    `);
  } else {
    // Return JSON if not explicitly requesting HTML
    res.json(status);
  }
});

module.exports = router;
