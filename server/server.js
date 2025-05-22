import express from 'express';
import mongoose from 'mongoose';

import ProjectRouter from './routes/project.js';

// MongoDB connection
mongoose.connect('mongodb+srv://thiagocastilho:pfOSa93z96rYpbiS@cluster0.o1kev.mongodb.net/mern?retryWrites=true&w=majority')
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json());

//Routes
app.use('/health', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/projects', ProjectRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
