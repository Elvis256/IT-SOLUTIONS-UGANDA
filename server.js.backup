require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const logger = require('./config/logger');

const app = express();
const port = process.env.PORT || 3000;

// Initialize database connection
let dbConnected = false;
connectDB().then((conn) => {
  if (conn) {
    dbConnected = true;
    logger.info('Database initialized successfully');
  }
}).catch(err => {
  logger.error('Database initialization failed:', err);
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Export for Vercel serverless
module.exports = app;

// Start server only in non-serverless environment
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 IT Solutions Uganda running at http://localhost:${port}`);
  });
}