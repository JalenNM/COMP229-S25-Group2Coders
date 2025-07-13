import { Link } from "react-router-dom"

export default function MovieList() {
    const movies=[
    { _id: '1', title: 'Superman' },
    { _id: '2', title: 'Elio' },
    { _id: '3', title: 'Skill House' }
    ]
    return (
        <div>
        <h2>Movie Page</h2> 
        <ul>
            {movies.map(movie =>(
                <li key={movie._id}>
                    <Link to={`/movies/${movie._id}/review`}>{movie.title}</Link>

            </li>))}
        </ul>
        </div>
    )
}