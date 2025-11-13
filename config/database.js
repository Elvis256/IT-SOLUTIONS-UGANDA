const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('MONGODB_URI not configured - database features will be unavailable');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    logger.warn('Server will continue without database functionality');
    // Don't exit - allow server to run in limited mode
  }
};

module.exports = connectDB;
