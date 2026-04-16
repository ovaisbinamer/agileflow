// File: server/models/Board.js
import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
});

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Board name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    columns: {
      type: [columnSchema],
      default: [
        { id: 'todo', title: 'To Do', order: 0 },
        { id: 'inprogress', title: 'In Progress', order: 1 },
        { id: 'done', title: 'Done', order: 2 },
      ],
    },
  },
  { timestamps: true }
);

const Board = mongoose.model('Board', boardSchema);
export default Board;