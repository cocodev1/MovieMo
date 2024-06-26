import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { Link } from 'react-router-dom'



export default function MovieItem({movie}) {

    const [rating, setRating] = useState(movie.rating)
    
    return (
        <div>
            <Link to={`/movie/${movie.id}`} >
            <figure style={{objectFit: 'cover',  display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row'}}>
                <img style={{width: "150px"}} className='hovered-poster' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
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
            ratingValue={rating != null ? rating : 0}
            size={20}
            transition
            fillColor='orange'
            emptyColor='gray'
            initialValue={rating != null ? rating : 0   }
            readonly
            allowFraction
                  />
            <p style={{margin: 0}}>{(Math.round(rating * 10) / 10) || "Not rated"}</p>
         </div>
        </div>
    )

}