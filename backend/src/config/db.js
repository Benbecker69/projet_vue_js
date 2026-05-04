const mongoose = require('mongoose');
const logger = require('./logger');

async function connectDB(uri) {
  const url = uri || process.env.MONGO_URI;
  await mongoose.connect(url);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = { connectDB };
