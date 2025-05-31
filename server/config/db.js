import mongoose from 'mongoose';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up MongoDB indexes
    await Promise.all([
      conn.connection.collection('users').createIndex({ email: 1 }, { unique: true }),
      conn.connection.collection('users').createIndex({ username: 1 }, { unique: true }),
      conn.connection.collection('accounts').createIndex({ userId: 1 }),
      conn.connection.collection('transactions').createIndex({ fromAccount: 1, timestamp: -1 }),
      conn.connection.collection('transactions').createIndex({ toAccount: 1, timestamp: -1 }),
      conn.connection.collection('behavioraldata').createIndex({ userId: 1, timestamp: -1 })
    ]);

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;