// backend/src/controllers/todoController.ts
import { Request, Response, NextFunction } from 'express';
import Todo from '../models/todoModel.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { IUser } from '../models/userModel.js'; // Import the IUser interface

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
// @access  Private
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // --- THIS IS THE FIX ---
    // We MUST filter by the user ID from the 'protect' middleware.
    // We cast to IUser to handle the TypeScript 'unknown' error.
    const todos = await Todo.find({ user: (req.user as IUser)._id });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return next(new ApiError(400, 'Title is required'));
    }

    const todo = new Todo({
      // --- THIS IS THE FIX ---
      // We MUST assign the new todo to the logged-in user.
      user: (req.user as IUser)._id,
      title,
      description: description || '',
      isCompleted: false,
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single todo by ID
// @route   GET /api/todos/:id
// @access  Private
export const getTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(new ApiError(404, 'Todo not found'));
    }

    // Security check: Make sure the todo belongs to the logged-in user
    if (todo.user.toString() !== (req.user as IUser)._id.toString()) {
      return next(new ApiError(401, 'Not authorized to view this todo'));
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, isCompleted } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(new ApiError(404, 'Todo not found'));
    }

    // Security check: Make sure the todo belongs to the logged-in user
    if (todo.user.toString() !== (req.user as IUser)._id.toString()) {
      return next(new ApiError(401, 'Not authorized to update this todo'));
    }

    // Update the fields
    todo.title = title ?? todo.title; // Use ?? to allow setting empty string or false
    todo.description = description ?? todo.description;
    todo.isCompleted = isCompleted ?? todo.isCompleted;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(new ApiError(404, 'Todo not found'));
    }

    // Security check: Make sure the todo belongs to the logged-in user
    if (todo.user.toString() !== (req.user as IUser)._id.toString()) {
      return next(new ApiError(401, 'Not authorized to delete this todo'));
    }

    await todo.deleteOne(); // Use .deleteOne()
    res.json({ message: 'Todo removed successfully' });
  } catch (error) {
    next(error);
  }
};