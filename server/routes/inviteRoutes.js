// File: server/routes/inviteRoutes.js
import express from 'express';
import crypto from 'crypto';
import protect from '../middleware/auth.js';
import InviteToken from '../models/InviteToken.js';
import Board from '../models/Board.js';
import User from '../models/User.js';
import { sendInviteEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * POST /api/invites
 * Send an invite email to a collaborator.
 * Body: { email, boardId }
 */
router.post('/', protect, async (req, res) => {
  try {
    const { email, boardId } = req.body;
    if (!email || !boardId) {
      return res.status(400).json({ message: 'email and boardId are required' });
    }

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Only board members (incl. owner) can invite
    const isMember = board.members.some((m) => m.toString() === req.user._id.toString())
      || board.owner.toString() === req.user._id.toString();
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    // Check if user is already a member
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const alreadyMember = board.members.some((m) => m.toString() === existingUser._id.toString());
      if (alreadyMember) {
        return res.status(400).json({ message: 'User is already a board member' });
      }
    }

    // Create invite token
    const token = crypto.randomBytes(32).toString('hex');
    await InviteToken.create({
      token,
      boardId,
      email,
      createdBy: req.user._id,
    });

    const acceptUrl = `${process.env.CLIENT_URL}/invite/${token}`;
    await sendInviteEmail(email, board.name, acceptUrl, req.user.name);

    res.status(201).json({ message: `Invite sent to ${email}` });
  } catch (error) {
    console.error('[Invite] Error:', error.message);
    res.status(500).json({ message: 'Failed to send invite. Check email configuration.' });
  }
});

/**
 * GET /api/invites/accept/:token
 * Accept an invite — adds the logged-in user to the board.
 * Requires authentication (user must be logged in to accept).
 */
router.get('/accept/:token', protect, async (req, res) => {
  try {
    const invite = await InviteToken.findOne({ token: req.params.token });

    if (!invite) return res.status(404).json({ message: 'Invite not found or already used' });
    if (invite.used) return res.status(400).json({ message: 'Invite has already been used' });
    if (new Date() > invite.expiresAt) return res.status(400).json({ message: 'Invite has expired' });

    // Add user to board if not already a member
    await Board.findByIdAndUpdate(invite.boardId, {
      $addToSet: { members: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedBoards: invite.boardId },
    });

    // Mark token as used
    invite.used = true;
    await invite.save();

    res.json({ message: 'You joined the board!', boardId: invite.boardId });
  } catch (error) {
    console.error('[Invite Accept] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
