import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function Home() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/movies')
            .then((res) => res.json())
            .then((data) => setMovies(data));
    }, []);

    return (
        <div className="container mt-4" style={{ paddingBottom: '100px' }}>
            <h1 className="mb-4">Featured Movies</h1>
            {movies.length === 0 ? (
                <div className="text-center">No movies available</div>
            ) : (
                <div className="scrolling-wrapper">
                    <div className="scrolling-content">
                        {[...movies, ...movies].map((movie, idx) => (
                            <div
                                className="card h-100 shadow-sm scrolling-card"
                                style={{ cursor: 'pointer' }}
                                key={movie._id + '-' + idx}
                                onClick={() => navigate(`/movies/${movie._id}`)}
                            >
                                {movie.posterUrl ? (
                                    <img
                                        src={movie.posterUrl}
                                        className="card-img-top"
                                        alt={movie.title}
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                        style={{ height: '300px' }}
                                    >
                                        <span className="text-muted">No Image</span>
                                    </div>
                                )}
                                <div className="card-body d-flex flex-column justify-content-end" style={{ minHeight: '70px', overflow: 'visible', paddingBottom: '0.5rem' }}>
                                    <h5 className="card-title text-center" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', wordBreak: 'break-word', marginBottom: 0 }}>
                                        {movie.title}
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}