import express from 'express';
import { createMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from '../controllers/movie.js';
import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/admin.js';

const router = express.Router();

// HTTP Verbs for RESTful API GET, POST, PUT, DELETE

// Public: GET all movies (/api/movies)
router.get('/', getAllMovies);

// Public: GET a movie by ID (with reviews) (/api/movies/:id)
router.get('/:id', getMovieById);

// Admin only: Create a movie (POST /api/movies)
router.post('/', authMiddleware, adminMiddleware, createMovie);

// Admin only: Update a movie (PUT /api/movies/:id)
router.put('/:id', authMiddleware, adminMiddleware, updateMovie);

// Admin only: Delete a movie (DELETE /api/movies/:id)
router.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

export default router;