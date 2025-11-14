// src/models/todoModel.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Todo document
export interface ITodo extends Document {
  _id: mongoose.Types.ObjectId;  
  user: mongoose.Schema.Types.ObjectId; // Reference to the user
  title: string;
  description?: string; // Optional description
  isCompleted: boolean;
}

const todoSchema: Schema<ITodo> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This links it to the User model
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo: Model<ITodo> = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;