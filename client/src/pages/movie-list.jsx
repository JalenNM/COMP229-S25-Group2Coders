import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const MoviesList = () => {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
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

    const confirmed = window.confirm('Are you sure you want to delete this movie?');
    if (!confirmed) return;

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

  // Sorting logic
  const sortedMovies = [...movies].sort((a, b) => {
    let aField = a[sortField] || '';
    let bField = b[sortField] || '';
    if (sortField === 'releaseYear') {
      aField = Number(aField) || 0;
      bField = Number(bField) || 0;
    } else {
      aField = aField.toString().toLowerCase();
      bField = bField.toString().toLowerCase();
    }
    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mt-4" style={{ paddingBottom: '100px' }}>
      <h1 className="text-center mb-4">Movies</h1>

      {/* Sorting controls */}
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <label className="me-2 mb-0">Sort by:</label>
        <select value={sortField} onChange={e => setSortField(e.target.value)} className="form-select w-auto">
          <option value="title">Title</option>
          <option value="releaseYear">Year</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="form-select w-auto">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

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

      {sortedMovies.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Description</th>
              <th>Release Year</th>
              <th>Genre</th>
              <th>Director</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMovies.map((movie) => (
              <tr key={movie._id}>
                <td>
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ width: '60px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => navigate(`/movies/${movie._id}`)}
                      title="View & Review"
                    />
                  ) : (
                    <span className="text-muted">No Image</span>
                  )}
                </td>
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
