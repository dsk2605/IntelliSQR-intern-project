
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { ApiError } from '../middleware/errorMiddleware.js';


export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

 
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User already exists'));
    }

  
    const user = await User.create({
      name,
      email,
      password, 
    });


    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(res, user._id as mongoose.Types.ObjectId),
      });
    } else {
      return next(new ApiError(400, 'Invalid user data'));
    }
  } catch (error) {
    next(error); 
  }
};


export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });


    if (user && (await user.matchPassword(password))) {
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(res, user._id as mongoose.Types.ObjectId),
      });
    } else {
      return next(new ApiError(401, 'Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }


    const resetToken = crypto.randomBytes(32).toString('hex');


    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');


    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();


    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;


    console.log('--- PASSWORD RESET ---');
    console.log('Send this link to the user (or copy-paste for demo):');
    console.log(resetURL);
    console.log('------------------------');

    res.status(200).json({
      message: 'Reset token (mock) generated. Check backend console.',
    });
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const { token } = req.params;


    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, 
    });


    if (!user) {
      return next(new ApiError(400, 'Token is invalid or has expired'));
    }

    user.password = password; 
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(res, user._id as mongoose.Types.ObjectId),
    });
  } catch (error) {
    next(error);
  }
};
