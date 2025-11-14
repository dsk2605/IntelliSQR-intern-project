// src/utils/logger.ts
import Log from '../models/logModel.js'; // Notice the .js extension!

/**
 * Logs an error to the MongoDB database.
 * @param level - The severity level ('error', 'warn', 'info').
 * @param message - The error message.
 * @param stack - The error stack trace (optional).
 */
export const logErrorToDB = async (
  level: 'error' | 'warn' | 'info',
  message: string,
  stack?: string
) => {
  try {
    const newLog = new Log({
      level,
      message,
      stack: stack || 'No stack trace available',
      timestamp: new Date(),
    });
    await newLog.save();
    console.log('Error logged to DB');
  } catch (dbError) {
    // If logging to DB fails, log to console to avoid an infinite loop
    console.error('CRITICAL: Failed to log error to database.', dbError);
    console.error('Original Error:', { level, message, stack });
  }
};