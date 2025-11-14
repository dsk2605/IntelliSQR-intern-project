import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  timestamp: Date;
}

const logSchema: Schema<ILog> = new Schema({
  level: {
    type: String,
    enum: ['error', 'warn', 'info'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log: Model<ILog> = mongoose.model<ILog>('Log', logSchema);

export default Log;