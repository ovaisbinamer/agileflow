// File: server/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Trust Render's proxy so req.ip / rate limiters work correctly
app.set('trust proxy', 1);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`[Socket.io] Socket ${socket.id} joined board room: ${boardId}`);
  });

  socket.on('leave-board', (boardId) => {
    socket.leave(boardId);
  });

  socket.on('task-moved', (payload) => {
    socket.to(payload.boardId).emit('task-moved', payload);
  });

  socket.on('task-created', (payload) => {
    socket.to(payload.boardId).emit('task-created', payload.task);
  });

  socket.on('task-updated', (payload) => {
    socket.to(payload.boardId).emit('task-updated', payload);
  });

  socket.on('task-deleted', (payload) => {
    socket.to(payload.boardId).emit('task-deleted', payload);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// Raw body for Stripe webhook (must be before express.json())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'AgileFlow API is running' }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[MongoDB] Connected successfully');
    httpServer.listen(PORT, () => {
      console.log(`[Server] AgileFlow backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  });