import express from 'express';
import { registerUser, loginUser, createAdminUser } from '../controllers/user.js';
import authMiddleware, { isAdmin } from '../middlewares/auth.js';
import UserModel from '../models/user.js';

const router = express.Router();

// Register a new User POST /api/users/register
router.post('/register', registerUser);

// Login a User POST /api/users/login
router.post('/login', loginUser);

// Create an Admin User POST /api/users/create-admin
router.post('/create-admin', createAdminUser);

// Get current user GET /api/users/me
router.get('/me', authMiddleware, (req, res) => {res.json(req.user);});

router.put('/me', authMiddleware, async (req, res) => {
  const { education, contact } = req.body;

  try {
    if (education !== undefined) req.user.education = education;
    if (contact !== undefined) req.user.contact = contact;

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
});

// get/api/users/all - Entire User Inquiry (Administrator Only)
router.get('/all', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data.' });
  }
});

// get/api/users/:id - Individual User Inquiries (Administrator Only)
router.get('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data.' });
  }
});

// [DELETE] /api/users/:id - 사용자 삭제 (관리자 전용)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});


export default router;