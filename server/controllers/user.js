import UserModel from '../models/user.js';
import generateToken from '../utils/jwt.js';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new user instance and save (password hashing done in model pre-save)
    const newUser = new UserModel({ email, username, password });
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken(savedUser);

    // Send back safe user data without password
    const safeUser = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Send safe user data
    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ message: 'Login successful', user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
