// File: server/models/InviteToken.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const inviteTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex'),
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
  used: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const InviteToken = mongoose.model('InviteToken', inviteTokenSchema);
export default InviteToken;
