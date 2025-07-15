import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MoviesList = ({ user }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current user:', user); // Debug user role

    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error.message);
      }
    };

    fetchMovies();
  }, [user]);

  const handleDelete = async (movieId) => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error('Error deleting movie:', error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Movies</h1>

      {/* Admin-only Create button */}
      {user?.role === 'admin' && (
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => {
            console.log('Navigating to /movie-details');
            navigate('/movie-details');
          }}
        >
          Create New Movie
        </button>
      )}

      {movies.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Release Year</th>
              <th>Genre</th>
              <th>Director</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.description}</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.genre}</td>
                <td>{movie.director}</td>
                <td>
                  {user?.role === 'admin' ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => navigate(`/movie-details/${movie._id}`)}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-info btn-sm"
                      onClick={() => navigate(`/movies/${movie._id}`)}
                    >
                      View & Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No movies available</p>
      )}
    </div>
  );
};

export default MoviesList;
