import { Request, Response, NextFunction } from 'express';
import { logErrorToDB } from '../utils/logger.js'; 


export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const globalErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction 
) => {

  let statusCode: number;
  let message: string;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {

    statusCode = 500; 
    message = 'Something went wrong on the server.';
  }


  if (statusCode >= 500) {
    logErrorToDB('error', err.message, err.stack);
  }


  res.status(statusCode).json({
    message: message,

    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};