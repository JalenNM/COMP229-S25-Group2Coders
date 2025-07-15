import express from 'express';
import User from '../models/user.js';
import authenticate from '../middlewares/auth.js'; // verifies JWT & sets req.user
import adminOnly from '../middlewares/admin.js'; // middleware that allows only admins

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/:id/role - Update user role (admin only)
router.put('/:id/role', authenticate, adminOnly, async (req, res) => {
  const { role } = req.body;
  const validRoles = ['user', 'admin'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Optional: Prevent admin from demoting themselves
  if (req.user.id === req.params.id && role !== 'admin') {
    return res.status(403).json({ message: 'You cannot change your own admin role' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user: { _id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(403).json({ message: 'You cannot delete your own account' });
  }

  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
