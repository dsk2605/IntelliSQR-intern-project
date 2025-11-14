// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logErrorToDB } from '../utils/logger.js'; // Notice the .js extension!

/**
 * Custom error class to standardize API errors.
 */
export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Middleware to handle routes that are not found.
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handling middleware.
 * This is where all errors will end up.
 */
export const globalErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction // 'next' is required even if unused for it to be an error handler
) => {
  // Determine status code and message
  let statusCode: number;
  let message: string;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // For unexpected errors
    statusCode = 500; // Internal Server Error
    message = 'Something went wrong on the server.';
  }

  // Log the error to MongoDB
  // We log all 500-level errors, or other specific errors as needed
  if (statusCode >= 500) {
    logErrorToDB('error', err.message, err.stack);
  }

  // Send the error response to the client
  res.status(statusCode).json({
    message: message,
    // Only send the stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};