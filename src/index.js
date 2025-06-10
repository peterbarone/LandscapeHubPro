const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'LandscapeHub Pro API',
    version: '0.1.0',
    environment: process.env.NODE_ENV
  });
});

// Start server
app.listen(port, () => {
  console.log(`LandscapeHub Pro API running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
