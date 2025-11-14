import express from 'express';
import authRoutes from './routes/authRoutes.js'; 
import todoRoutes from './routes/todoRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, globalErrorHandler } from './middleware/errorMiddleware.js';


dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Todo API is running!' });
});


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);



app.use(notFound); 
app.use(globalErrorHandler);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});