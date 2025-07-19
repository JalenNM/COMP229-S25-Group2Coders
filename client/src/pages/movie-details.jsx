import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MovieDetails = ({ user }) => {
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
    director: '',
    posterUrl: '',
  });

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch movie and reviews if editing/viewing
  useEffect(() => {
    if (!id) return;

    const fetchMovieAndReviews = async () => {
      try {
        const [movieRes, reviewRes] = await Promise.all([
          fetch(`/api/movies/${id}`),
          fetch(`/api/reviews?movieId=${id}`),
        ]);

        if (!movieRes.ok || !reviewRes.ok) throw new Error('Failed to fetch data');

        const movieData = await movieRes.json();
        const reviewData = await reviewRes.json();

        setMovie(movieData.movie || movieData); // support both {movie, reviews} and flat
        if (movieData.reviews) {
          setReviews(movieData.reviews);
        } else {
          setReviews(reviewData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchMovieAndReviews();
  }, [id]);

  // Redirect non-admin users away from create page, but allow all users (including admins) to view reviews page
  useEffect(() => {
    if (!id && (!user || user.role !== 'admin')) {
      navigate('/movies');
    }
    // If id exists (viewing a movie), allow all users including admins
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitMovie = async (e) => {
    e.preventDefault();
    console.log('Submitting movie:', movie);

    if (!user || user.role !== 'admin') {
      alert('Unauthorized: Admin access required');
      return;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/movies/${id}` : '/api/movies';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(movie),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Save movie error:', errorData);
        alert('Error saving movie: ' + (errorData.message || 'Unknown error'));
        return;
      }

      const data = await res.json();
      console.log('Movie saved:', data);
      navigate('/movies');
    } catch (err) {
      console.error('Movie save error:', err);
      alert('Error saving movie: ' + err.message);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    console.log('handleSubmitReview triggered', { reviewText, rating, user, id });

    if (!user || user.role === 'admin') {
      alert('Only non-admin users can post reviews.');
      return;
    }

    if (!reviewText.trim()) {
      alert('Review text cannot be empty.');
      return;
    }

    if (rating < 0 || rating > 5) {
      alert('Rating must be between 0 and 5. Decimals allowed.');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          movieId: id,
          reviewText,
          rating,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview.review]);
      setReviewText('');
      setRating(5);
    } catch (err) {
      console.error('Review submit error:', err);
      alert('Error submitting review: ' + err.message);
    }
  };

  const handleDeleteReview = async (reviewId, reviewerId) => {
    if (!user) {
      alert('You must be logged in');
      return;
    }
    if (user.role !== 'admin' && user._id !== reviewerId) {
      alert('Only admins or the review owner can delete this review');
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error('Failed to delete review');

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error('Review delete error:', err);
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ paddingBottom: '100px' }}>
      <h2 className="text-center mb-4">{id ? 'Movie Details' : 'Create Movie'}</h2>

      {user?.role === 'admin' && (
        <form onSubmit={handleSubmitMovie}>
          <div className="form-group mb-3">
            <label>Title</label>
            <input
              name="title"
              value={movie.title}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Description</label>
            <input
              name="description"
              value={movie.description}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Release Year</label>
            <input
              name="releaseYear"
              type="number"
              value={movie.releaseYear}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Genre</label>
            <input
              name="genre"
              value={movie.genre}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Director</label>
            <input
              name="director"
              value={movie.director}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Poster Image URL</label>
            <input
              name="posterUrl"
              value={movie.posterUrl}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. /poster1.jpg or https://..."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {id ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {id && (
        <>
          <hr />
          {!movie.title ? (
            <div className="text-center my-4">Loading movie details...</div>
          ) : (
            <>
              <div className="row mb-4 align-items-center">
                <div className="col-md-3 text-center mb-3 mb-md-0">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                  ) : (
                    <span className="text-muted">No Image</span>
                  )}
                </div>
                <div className="col-md-9">
                  <h2>{movie.title}</h2>
                  <p><strong>Description:</strong> {movie.description}</p>
                  <p><strong>Release Year:</strong> {movie.releaseYear}</p>
                  <p><strong>Genre:</strong> {movie.genre}</p>
                  <p><strong>Director:</strong> {movie.director}</p>
                </div>
              </div>
              <h3 className="text-center mb-3">User Reviews for <span>{movie.title}</span></h3>
              <h4>Reviews</h4>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <ul className="list-group mb-4">
                  {reviews.map((r) => (
                    <li className="list-group-item" key={r._id}>
                      <div>
                        <strong>User:</strong> {r.reviewer?.username || 'Anonymous'}
                      </div>
                      <div>
                        <strong>Rating:</strong> {r.rating} / 5
                      </div>
                      <div>{r.reviewText}</div>
                      {(user?.role === 'admin' || user?._id === r.reviewer?._id) && (
                        <button
                          className="btn btn-danger btn-sm mt-2"
                          onClick={() => handleDeleteReview(r._id, r.reviewer._id)}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {user && user.role !== 'admin' && (
                (() => {
                  const hasReviewed = reviews.some(r => r.reviewer?._id === user._id);
                  if (hasReviewed) {
                    return <div className="alert alert-info">You have already submitted a review for this movie.</div>;
                  }
                  return (
                    <form onSubmit={handleSubmitReview}>
                      <div className="form-group mb-2">
                        <label>Review</label>
                        <textarea
                          className="form-control"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Rating</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="form-control"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-success">
                        Submit Review
                      </button>
                    </form>
                  );
                })()
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetails;
