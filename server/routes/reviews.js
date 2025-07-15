import express from 'express';
import Review from '../models/review.js';
import mongoose from 'mongoose';
import Movie from '../models/movie.js';
import authenticate from '../middlewares/auth.js'; // your auth middleware that sets req.user

const router = express.Router();

// GET reviews by movie ID (query param)
router.get('/', async (req, res) => {
  const { movieId } = req.query;

  if (!movieId) {
    return res.status(400).json({ message: 'movieId query parameter is required' });
  }

  try {
    const reviews = await Review.find({ movie: movieId }).populate('reviewer', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new review (authenticated, non-admin only)
router.post('/', authenticate, async (req, res) => {
  console.log('DEBUG req.user in review POST:', req.user);
  const { movieId, reviewText, rating } = req.body;

  if (!movieId || !reviewText || rating == null) {
    return res.status(400).json({ message: 'movieId, reviewText and rating are required' });
  }

  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot post reviews' });
  }

  // Validate movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: 'Invalid movieId' });
  }

  // Check that the movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  try {
    const review = new Review({
      movie: movieId,
      reviewer: req.user._id,
      reviewText,
      rating,
    });

    const savedReview = await review.save();

    // Populate reviewer username for response
    await savedReview.populate('reviewer', 'username');

    res.status(201).json({ review: savedReview });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// DELETE review by ID (authenticated, admin or review owner only)
router.delete('/:id', authenticate, async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Debug log for reviewer
    console.log('DEBUG review.reviewer in DELETE:', review.reviewer);
    let reviewerId;
    if (review.reviewer) {
      if (typeof review.reviewer === 'object' && review.reviewer._id) {
        reviewerId = review.reviewer._id.toString();
      } else {
        reviewerId = review.reviewer.toString();
      }
    } else {
      return res.status(403).json({ message: 'Review has no reviewer, cannot authorize delete.' });
    }

    if (req.user.role === 'admin' || req.user._id.toString() === reviewerId) {
      await review.deleteOne();
      return res.json({ message: 'Review deleted successfully' });
    } else {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
