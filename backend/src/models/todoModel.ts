import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITodo extends Document {
  _id: mongoose.Types.ObjectId;  
  user: mongoose.Schema.Types.ObjectId; 
  title: string;
  description?: string; 
  isCompleted: boolean;
}

const todoSchema: Schema<ITodo> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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