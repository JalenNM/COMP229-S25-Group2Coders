
import express from 'express';
import { createMovie, 
    deleteMovie,
     getAllMovies, getMovieById, updateMovies } from "../controllers/movieControllers.js"

const router = express.Router()
router.get('/',getAllMovies)
router.get('/:id',getMovieById)
router.post('/',createMovie)
router.put('/:id',updateMovies)
router.delete('/:id',deleteMovie)

export default router;