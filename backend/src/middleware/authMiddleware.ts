
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel.js';
import { ApiError } from './errorMiddleware.js';


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {

      token = authHeader.split(' ')[1];


      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET not defined');
      }

      const decoded = jwt.verify(token, secret) as { userId: string };

      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return next(new ApiError(401, 'Not authorized, user not found'));
      }

      next(); 
    } catch (error) {
      console.error('Token verification failed:', error);
      return next(new ApiError(401, 'Not authorized, token failed'));
    }
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token'));
  }
};