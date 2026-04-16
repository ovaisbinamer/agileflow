// File: server/routes/taskRoutes.js
import express from 'express';
import Task from '../models/Task.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { boardId } = req.query;
    if (!boardId) return res.status(400).json({ message: 'boardId is required' });
    const tasks = await Task.find({ boardId }).populate('assignee', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, content, boardId, columnId, priority, dueDate } = req.body;
    const task = await Task.create({
      title: title || '',
      content,
      boardId,
      columnId: columnId || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assignee: req.user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { columnId, order, title, content, priority, dueDate } = req.body;
    const updateFields = {
      ...(columnId !== undefined && { columnId }),
      ...(order !== undefined && { order }),
      ...(title !== undefined && { title }),
      ...(content && { content }),
      ...(priority && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate || null }),
    };
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('assignee', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Broadcast update to all board members via socket
    const io = req.app.get('io');
    if (io && task.boardId) {
      io.to(task.boardId.toString()).emit('task-updated', task);
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;