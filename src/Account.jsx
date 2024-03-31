import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import daysjs from 'dayjs';
import Header from '../Header';



export default function Account() {
    const data = useLoaderData()
    console.log(data)
    return (
        <>
        <Header />
        <div className='account-page'>
            <div className='base-row-flex base-account-data'> 
                <p className='email'>{localStorage.getItem('email')}</p>
                <p className='created'>Member since {daysjs(data.createdAt).format('MMMM D, YYYY')}</p>
            </div>
           <div className='base-row-flex comm-section'>
            <p className='avg-rating'>{Math.round(data.avgRating * 10) / 10}</p>
            <p className='ncomments'>{data.nComments}</p>
           </div>
           <div className='base-row-flex comm-section-name'>
            <p className='avg-rating-name'>Avg.Rating</p>
            <p className='avg-ncomments-name'>Comments</p>
            </div>
            <div className='saved'>
                <p>Saved</p>
                <div className='saved-movies'>
                    {
                        data.saved.map((movie, index) => (
                            <div key={index} className='saved-movie'>
                                <Link to={`/movie/${movie.id}`} >
                                <img className="movie-saved hovered-poster" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
        </>
    )
}