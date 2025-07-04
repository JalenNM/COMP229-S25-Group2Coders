import UserModel from '../models/user.js';
import generateToken from '../utils/jwt.js';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();

        const token = generateToken(savedUser)

        res.status(201).json({message: 'User registered successfully', user: savedUser, token});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// Login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; //destructuring email and password from request body
        const user = await UserModel.findOne({ email});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(user)

        res.status(200).json({ message: 'Login successful', user, token});

    } catch (error) {
        res.status(500).json({ message: 'Server error' }); 
    }
}