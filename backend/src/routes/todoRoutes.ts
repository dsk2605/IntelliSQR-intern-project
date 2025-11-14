// src/routes/todoRoutes.ts
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

// Apply the 'protect' middleware to all routes in this file.
// This means no one can access these routes without a valid token.
router.use(protect);

router.route('/')
  .get(getTodos)       // GET /api/todos (Get all user's todos)
  .post(createTodo);   // POST /api/todos (Create a new todo)

router.route('/:id')
  .get(getTodoById)    // GET /api/todos/:id (Get a single todo)
  .put(updateTodo)     // PUT /api/todos/:id (Update a todo)
  .delete(deleteTodo); // DELETE /api/todos/:id (Delete a todo)

export default router;