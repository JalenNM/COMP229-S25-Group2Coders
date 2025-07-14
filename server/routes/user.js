import express from 'express';
import { registerUser, loginUser, createAdminUser } from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';

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


export default router;