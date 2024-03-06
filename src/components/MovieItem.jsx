import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { Link } from 'react-router-dom'



export default function MovieItem({movie}) {

    const [rating, setRating] = useState(4.5)

    return (
        <div>
            <Link to={`/movie/${movie.id}`}>
            <figure style={{objectFit: 'cover',  display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row'}}>
                <img style={{width: "150px"}} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </figure>
            </Link>
            <p 
            style={{
                margin: 0,
                fontWeight: 'bold',
            }}
            >{movie.title}</p>
            <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: '5px'
            }}
            >
            <Rating
            onClick={e => console.log(e)}
            ratingValue={rating}
            size={20}
            transition
            fillColor='orange'
            emptyColor='gray'
            initialValue={rating}
            readonly
            allowFraction
                  />
            <p style={{margin: 0}}>{rating}</p>
         </div>
        </div>
    )

}