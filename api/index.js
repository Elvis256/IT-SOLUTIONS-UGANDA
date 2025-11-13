require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('../config/database');
const logger = require('../config/logger');

const app = express();

// Initialize database connection (async - don't wait)
let dbConnected = false;
if (process.env.MONGODB_URL || process.env.MONGODB_URI) {
  connectDB().then((conn) => {
    if (conn) {
      dbConnected = true;
      logger.info('Database initialized successfully');
    }
  }).catch(err => {
    logger.error('Database initialization failed:', err);
  });
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

const contactLimiter = rateLimit({
  windowMs: 900000,
  max: 5,
  message: 'Too many submissions, please try again later.',
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/contact', contactLimiter, require('../routes/contact'));
app.use('/api/newsletter', require('../routes/newsletter'));
app.use('/api/blog', require('../routes/blog'));
app.use('/api/testimonials', require('../routes/testimonials'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/appointments', require('../routes/appointments'));
app.use('/api/quotes', require('../routes/quotes'));
app.use('/api/admin', require('../routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: dbConnected });
});

// Simple root route for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  // Don't handle static files - let Vercel serve them
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return res.status(404).send('Not found');
  }
  
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`);
  res.status(err.status || 500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

module.exports = app;
