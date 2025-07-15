import UserModel from '../models/user.js';
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { email } = req.body;

        // email validation
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();

        const token = generateToken(savedUser);

        const userResponse = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
        };

        res.status(201).json({ message: 'User registered successfully', user: userResponse, token });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

// Login a user // admin login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // JWT token includes user role
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

//admin login user
export const createAdminUser = async (req, res) => {
  try {
    // Check if admin user already exists
    const existingEmail = await UserModel.findOne({ email: 'admin@admin.com' });
    const existingUsername = await UserModel.findOne({ username: 'admin' });

    if (existingEmail || existingUsername) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const admin = new UserModel({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
