import express from 'express';
import { loginUser, registerUser, updateUserProfile } from '../controllers/user.js';

const router = express.Router();

// Register a new User POST /api/users/register
router.post('/register', registerUser);

// Login a User POST /api/users/login
router.post('/login', loginUser);

// Update User Profile PUT /api/users/:id/profile
router.put('/:id/profile', updateUserProfile);


export default router;