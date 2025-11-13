const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Support both MONGODB_URL (from Vercel storage) and MONGODB_URI
    const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      logger.warn('MONGODB_URL or MONGODB_URI not configured - database features will be unavailable');
      return;
    }
    
    // Mongoose 6+ doesn't need useNewUrlParser and useUnifiedTopology
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    logger.warn('Server will continue without database functionality');
    // Don't exit - allow server to run in limited mode
    return null;
  }
};

module.exports = connectDB;
