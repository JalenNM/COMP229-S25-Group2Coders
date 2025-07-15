import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MovieRouter from './routes/movieRoutes.js'
dotenv.config();
console.log('Mongo URI:', process.env.MONGODB_URL);


import ProjectRouter from './routes/project.js';
import UserRouter from './routes/user.js';

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/movies', MovieRouter);

//Routes
app.use('/health', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/projects', ProjectRouter);
app.use('/api/auth', UserRouter);
app.use('/api/data', (req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
