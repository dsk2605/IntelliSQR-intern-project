// src/routes/authRoutes.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  forgotPassword, // <-- 1. IMPORT
  resetPassword,
  // forgotPassword, // We will add these later
  // resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword); // <-- 3. ADD ROUTE
router.put('/reset-password/:token', resetPassword);
export default router;