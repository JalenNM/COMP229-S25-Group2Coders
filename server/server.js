import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import ProjectRouter from './routes/project.js';
import UserRouter from './routes/user.js';
import UserModel from './models/user.js';
import userRoutes from './routes/user.js';

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });


const app = express();
const PORT = 3000;

app.use(express.json());

//Routes
app.use('/health', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/projects', ProjectRouter);
app.use('/api/users', UserRouter);
app.use('/api/data', (req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

