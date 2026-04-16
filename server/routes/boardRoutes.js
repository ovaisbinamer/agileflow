// File: server/routes/boardRoutes.js
import express from 'express';
import Board from '../models/Board.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate('owner', 'name email');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description } = req.body;
    const board = await Board.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedBoards: board._id },
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate(
      'members',
      'name email'
    );
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the board owner can delete it' });
    }
    await board.deleteOne();
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;