require('dotenv').config();
const { connectDB } = require('./config/db');
const logger = require('./config/logger');
const app = require('./app');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server up on port ${PORT} (${process.env.NODE_ENV})`);
  });
}

start().catch(err => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
