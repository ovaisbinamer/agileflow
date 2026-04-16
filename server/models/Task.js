// File: server/models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Task content is required'],
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    columnId: {
      type: String,
      required: true,
      default: 'todo',
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;