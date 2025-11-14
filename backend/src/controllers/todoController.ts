
import { Request, Response, NextFunction } from 'express';
import Todo from '../models/todoModel.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { IUser } from '../models/userModel.js'; 


export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const todos = await Todo.find({ user: (req.user as IUser)._id });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};


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


    if (todo.user.toString() !== (req.user as IUser)._id.toString()) {
      return next(new ApiError(401, 'Not authorized to view this todo'));
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
};


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


    if (todo.user.toString() !== (req.user as IUser)._id.toString()) {
      return next(new ApiError(401, 'Not authorized to update this todo'));
    }


    todo.title = title ?? todo.title; 
    todo.description = description ?? todo.description;
    todo.isCompleted = isCompleted ?? todo.isCompleted;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
};


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


    if (todo.user.toString() !== (req.user as IUser)._id.toString()) {
      return next(new ApiError(401, 'Not authorized to delete this todo'));
    }

    await todo.deleteOne(); 
    res.json({ message: 'Todo removed successfully' });
  } catch (error) {
    next(error);
  }
};