import { useEffect, useState } from "react";
import { useLoaderData, Link, ScrollRestoration } from "react-router-dom"
import { Rating } from 'react-simple-star-rating'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { BookmarkFill, PlayFill } from "react-bootstrap-icons"
import { BACKEND } from "./const";
import Header from "../Header";


export default function Movie() {

    const data = useLoaderData()
    const movie = data.data
    const providers = data.providers
    const cast = data.cast
    const recommendations = data.recommendations
    const teaser = data.teaser

   

    const [rating, setRating] = useState(null)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState(data.comments)
    const [watchlist, setWatchlist] = useState(data.watchlist)
    

    useEffect(() => {
        setComments(data.comments)
    }, [data])

    const postComment = async () => {
        const res = await fetch(`${BACKEND}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: comment,
                rating: rating,
                user: localStorage.getItem("email"),
                movie: movie.id
            })
        })
        const data = await res.json()
        console.log(data)
        setComments(c => [data, ...c])
        setComment("")
        setRating(0)
    }

    const addToWatchlist = async () => {
        const res = await fetch(`${BACKEND}/watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("email"),
                movie: movie.id
            })
        })
        const data = await res.json()
        setWatchlist([...watchlist, movie.id])
        console.log(data)
    }

    const removeToWatchlist = async () => {
        const res = await fetch(`${BACKEND}/watchlist`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("email"),
                movie: movie.id
            })
        })
        const data = await res.json()
        setWatchlist(watchlist.filter(w => w != movie.id))
        console.log(data)
    }

    return (
        <>
        <Header />  
        <div className="movie-page">
            <ScrollRestoration />
            <div className="movie-left-panel">
                <img className="movie-poster" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                <div className="comments">
                    <div className="comment-form">
                        <div className="comment-form-header">
                            <Rating
                            onClick={e => setRating(e)}
                            ratingValue={rating}
                            size={20}
                            transition
                            fillColor='orange'
                            emptyColor='gray'
                            initialValue={0}
                            allowFraction />
                        <Button variant="primary" onClick={postComment} disabled={!localStorage.getItem('email')}>Post</Button>

                        </div>
                        <textarea className="comment-form-textarea" placeholder="Write a comment..." onChange={e => setComment(e.target.value)}></textarea>
                        
                    </div>
                     {
                        comments.map((comment, index) => {
                            return (
                                
                                <div key={index} className="comment">
                                    <div className="comment-header">
                                    <Rating
                                        
                                        ratingValue={comment.rating}
                                        size={20}
                                        transition
                                        fillColor='orange'
                                        emptyColor='gray'
                                        initialValue={comment.rating}
                                        readonly
                                        allowFraction />
                                    <p>{comment.rating}</p>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div>
                <h3>{movie.title}</h3>
                <div className="movie-tags">
                    {
                        movie.genres.map((genre, index) => {
                            return (
                                <h4>
                                <Badge key={index}  bg="primary">
                                    {genre.name}
                                </Badge>
                                </h4>
                            )
                        })
                    }
                </div>
                <div className="movie-rating">
                <Rating
                    ratingValue={ comments.reduce((acc, c) => acc + c.rating, 0) / comments.length }
                    size={30}
                    transition
                    fillColor='orange'
                    emptyColor='gray'
                    initialValue={(comments.reduce((acc, c) => acc + c.rating, 0) / comments.length)}
                    readonly
                    allowFraction
                />
                <h5>{comments.length == 0 ? "Not rated" : Math.round((comments.reduce((acc, c) => acc + c.rating, 0) / comments.length) * 10) / 10 }</h5>
                </div>
                <div className="movie-button on-same-line">
                    <a href={`https://www.youtube.com/watch?v=${teaser}`} target="_blank">
                    <Button variant="primary">
                        <PlayFill style={{marginRight: "5px"}} />
                              Watch Trailer
                    </Button>
                    </a>
                    {(watchlist && watchlist.includes(movie.id)) ? 
                    <Button variant="primary" onClick={removeToWatchlist}>
                        <BookmarkFill style={{marginRight: "5px"}} />

                        Remove to watchlist</Button> : 
                        
                        <Button variant="primary" onClick={addToWatchlist} disabled={!localStorage.getItem('email')}>
                            <BookmarkFill style={{marginRight: "5px"}} />
                        
                           Add to Watchlist
                        </Button>}
                </div>
                <div className="movie-overview"></div>
                    <h4>Overview</h4>
                    <p>{movie.overview}</p>
                <div className="availableon"></div>
                    <h4>Available on</h4>
                    <div className="providers">
                        {
                            providers?.flatrate?.map((provider, index) => {
                                return (
                                    <img style={{width: "72px"}} key={index} src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} />
                                )
                            })
                        }
                    </div>
                <div className="movie-cast"></div>
                    <h4>Cast</h4>
                    <div className="cast on-same-line">
                        {
                            cast.filter(c => c.profile_path).slice(0, 10).map((actor, index) => {
                                return (
                                    <div key={index} className="actor">
                                        <img src={`https://image.tmdb.org/t/p/original${actor.profile_path}`} alt={actor.name} />
                                        <p>{actor.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                <div className="recommendations">
                    <h4>Recommendations</h4>
                    <div className="recommendations-container on-same-line">
                        {
                            recommendations.results.filter(r => r.poster_path).map((movie, index) => {
                                return (
                                    <Link to={`/movie/${movie.id}`} >
                                    <div key={index} className="recommendation">
                                        <img className="hovered-poster" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                    </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
            
        </div>
        </>
    )
}