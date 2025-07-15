import React from 'react';
import { Link } from 'react-router-dom';

const movies = [
  { id: 1, title: 'Superman', year: '2025', rating: '9.2', posterUrl: 'https://placehold.co/400x600/EFEFEF/333?text=Superman' },
  { id: 2, title: 'Wicked', year: '2024', rating: '8.8', posterUrl: 'https://placehold.co/400x600/1a913d/FFF?text=Wicked' },
  { id: 3, title: 'Ballerina', year: '2025', rating: '8.5', posterUrl: 'https://placehold.co/400x600/333/FFF?text=Ballerina' },
  { id: 4, title: 'Demon Hunters', year: '2024', rating: '8.1', posterUrl: 'https://placehold.co/400x600/8e44ad/FFF?text=Demon+Hunters' },
  { id: 5, title: 'Furiosa', year: '2024', rating: '9.5', posterUrl: 'https://placehold.co/400x600/f39c12/333?text=Furiosa' },
  { id: 6, title: 'Movie 6', year: '2023', rating: '7.8', posterUrl: 'https://placehold.co/400x600/3498db/FFF?text=Movie+6' },
  { id: 7, title: 'Movie 7', year: '2023', rating: '8.0', posterUrl: 'https://placehold.co/400x600/e74c3c/FFF?text=Movie+7' },
  { id: 8, title: 'Movie 8', year: '2023', rating: '8.3', posterUrl: 'https://placehold.co/400x600/2ecc71/FFF?text=Movie+8' },
];

const MovieList = () => (
  <div className="movie-list-container">
    <h2 className="section-title">Box Office Rankings</h2>
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <Link to={`/movies/${movie.id}/reviews`} key={movie.id} className="movie-card-link">
          <div className="movie-card">
            <div className="ranking-badge">{index + 1}</div>
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="movie-poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x600/CCCCCC/FFFFFF?text=Image+Not+Found";
              }}
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-details">{movie.year} ・ ★ {movie.rating}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default MovieList;
