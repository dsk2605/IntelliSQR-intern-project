import express from 'express';
import {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(protect);

router.route('/')
  .get(getTodos)       
  .post(createTodo);   

router.route('/:id')
  .get(getTodoById)    
  .put(updateTodo)     
  .delete(deleteTodo); 

export default router;