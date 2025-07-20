import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.js'; // Import user routes
import path from 'path';
import { fileURLToPath } from 'url';

// Crate __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import MovieRouter from './routes/movies.js';
import reviewRoutes from './routes/reviews.js';
import UserRouter from './routes/user.js';
import adminRoutes from './routes/admin.js';

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

//Routes
app.use('/health', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/movies', MovieRouter);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', UserRouter);
app.use('/api/users', adminRoutes);
app.use('/api/users', userRoutes); // Ensure userRoutes is imported correctly
app.use('/api/data', (req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
