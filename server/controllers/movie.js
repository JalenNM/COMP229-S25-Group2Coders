import MovieModel from '../models/movie.js';
import ReviewModel from '../models/review.js';

// Read all movies - open to all
export const getAllMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a movie by ID with reviews - open to all
export const getMovieById = async (req, res) => {
  try {
    const movie = await MovieModel.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const reviews = await ReviewModel.find({ movie: movie._id })
      .populate('reviewer', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ movie, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new movie - admin only
export const createMovie = async (req, res) => {
  try {
    // Check admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const newMovie = new MovieModel(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a movie by ID - admin only
export const updateMovie = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const updatedMovie = await MovieModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a movie by ID - admin only
export const deleteMovie = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const deletedMovie = await MovieModel.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
