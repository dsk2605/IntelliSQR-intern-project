// src/server.ts
import express from 'express';
import authRoutes from './routes/authRoutes.js'; // This is imported correctly
import todoRoutes from './routes/todoRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, globalErrorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Test Route ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Todo API is running!' });
});

// --- API Routes ---
// (Your routes must go *before* the error handlers)
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
// (We will add todoRoutes here soon)

// --- Error Handling Middleware ---
// (These must be *last*)
app.use(notFound); // Handles 404 errors
app.use(globalErrorHandler); // Handles all other errors

// --- Start the Server ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});