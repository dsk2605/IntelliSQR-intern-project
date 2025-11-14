// src/controllers/authController.ts
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { ApiError } from '../middleware/errorMiddleware.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User already exists'));
    }

    // 2. Create new user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in userModel
    });

    // 3. Send response
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
    next(error); // Pass error to global error handler
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // 3. Send response
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

    // 1. Generate a raw token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash the token and set to user
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Set token expiration (10 minutes)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // 4. Create reset URL
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // 5. MOCK SENDS EMAIL
    // In a real app, you'd use a service like SendGrid or Nodemailer
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

// --- 4. ADD THE 'resetPassword' FUNCTION ---
// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // 1. Get user based on the *hashed* token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    // 2. If token not valid or expired
    if (!user) {
      return next(new ApiError(400, 'Token is invalid or has expired'));
    }

    // 3. Set the new password
    user.password = password; // The pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4. Log the user in (optional, but good UX)
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
