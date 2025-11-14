import Log from '../models/logModel.js'; 

/**
 * 
 * @param level 
 * @param message 
 * @param stack 
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

    console.error('CRITICAL: Failed to log error to database.', dbError);
    console.error('Original Error:', { level, message, stack });
  }
};