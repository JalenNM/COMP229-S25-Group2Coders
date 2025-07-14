import { useParams } from "react-router-dom"

export default function Review() {
    const {movieId} = useParams()
    /*need to fetch reviews*/
    return (
        <div>
            <h2>Review moviesId:{movieId}</h2>
        </div>
    )
}