import { useEffect, useRef, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { X } from 'react-bootstrap-icons'
import FilterHeader from './components/FilterHeader'
import FilterHeaderConst from './components/FilterHeaderConst'
import genres from './genres'
import languages from './languages'
import { Rating } from 'react-simple-star-rating'
import MovieItem from './components/MovieItem'
import { BACKEND } from './const'
import Header from '../Header'
import { Shuffle } from 'react-bootstrap-icons'




function App() {


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzg2YjgwZTU3ODJiYmQ3MDU2ZThhOThmZGUxMTNlYiIsInN1YiI6IjYzYTcyMDcyMDgzNTQ3MDBlMjBmYjI4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZBQNFtL3MFY2O26dcsxNsCB9lxiB44tFNaAm8KPlJ4'
    }
  }

  const [actors, setActors] = useState([])  
  const [sgenres, setsGenres] = useState([])
  const [producer, setProducer] = useState([])
  const [company, setCompany] = useState([])
  const [slanguages, setsLanguages] = useState([])
  const [subtitles, setSubtitles] = useState([])  
  const [rating, setRating] = useState(4.5)
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const scrollable = useRef(null)
  const [isScrollable, setIsScrollable] = useState(true)

  const search = async (npage) => {
    
    

   

    const url = new URL("https://api.themoviedb.org/3/discover/movie")
    if (sgenres.length > 0) {
      url.searchParams.append("with_genres", sgenres.filter(g => g.active).map(g => g.id).join(','))
    }
    if (company.length > 0) {
      url.searchParams.append("with_companies", company.map(p => p.id).join('|'))
    }
    if (producer.length > 0) {
      url.searchParams.append("with_crew", producer.map(p => p.id).join('|'))
    }
    if (actors.length > 0) {
      url.searchParams.append("with_cast", actors.map(a => a.id).join(','))
    }
    if (slanguages.length > 0) {
      url.searchParams.append("with_original_language", slanguages.filter(l => l.active).map(l => l.iso_639_1).join('|'))
    }
    url.searchParams.append("page", npage || 1)
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    const ratings = await fetch(`${BACKEND}/comments?movies=${data.results.map(m => m.id).join(',')}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
    }})
    const ratingsData = await ratings.json()
    console.log(ratingsData)
    const toret = data.results.map(m => ({...m, rating: ratingsData.find(r => r.movieId == m.id)?.avgRating || null}))
    console.log(toret)
    return toret

  }

  const onSearch = async (npage) => {
    const data = await search(npage)
    console.log(data)
    setPage(npage)
    setMovies(data)
    scrollable.current.scrollTop = 0 
    setIsScrollable(true) 
  }

  const onScroll = async (e) => {
    if(!isScrollable) {
      return
    }
    if (Math.abs(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) <= 1) {
      const data = await search(page + 1)
      setPage(page + 1)
      setMovies([...movies, ...data])
    }

  }


  const randomMovie = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${Math.round(Math.random() * 1000)}/recommendations`, options)
    
    if(res.status != 200) {
      await randomMovie()
    } else {
    const data = await res.json()
    
    setPage(1)
    if(data.results.length === 0) {
      await randomMovie()
    } else {
    setMovies(data.results)
    scrollable.current.scrollTop = 0
    setIsScrollable(false)
    }
    }

  }
  return (
    <>
    <Header />
      <div className='root' >
        <div className='filters'>
        
          <div>
                <FilterHeaderConst 
                  title={"Genres"}
                  placeholder="Search for a genre..."
                  onSelected={(selected) => {
                    
                    if(sgenres.filter(s => s.id === selected[0].id).length > 0) {
                      return
                    }

                    setsGenres([...(selected.map(s => ({...s, active: true}))), ...sgenres])
                  }}
                  options={genres}
                />

                <div className='genres-badge-container'>
                  {sgenres.map((genre, index) => (
                    <Badge  key={index}  bg={genre.active ? 'primary' : 'secondary'} onClick={() => {
                      /*const newGenres = sgenres.map(g => {
                        if (g.id === genre.id) {
                          return {...g, active: !g.active}
                        }
                        return g
                      })*/
                      const newGenres = sgenres.filter(g => g.id !== genre.id)
                      setsGenres(newGenres)
                    } }>
                      {genre.name}
                    </Badge>
                  ))}
                </div>
          </div>
          <div>
                <FilterHeader 
                  multiple={false}
                  title={"Studio"}
                  placeholder={"Search for a studio or producer..."}
                  onSelected={(selected) => setCompany(selected)}
                  selected={company}
                  baseUrls={[
                    "https://api.themoviedb.org/3/search/company?page=1&query=",
                    

                  ]}
                  
                />
            </div>
            <div>
            <FilterHeader 
                  multiple={false}
                  title={"Producer"}
                  placeholder={"Search for a studio or producer..."}
                  onSelected={(selected) => setProducer(selected)}
                  selected={producer}
                  baseUrls={[
                    
                    "https://api.themoviedb.org/3/search/person?&include_adult=false&language=en-US&page=1&query=,"

                  ]}
                  filterFunc={(res) => {
                    if ('known_for_department' in res) {
                      if (res.known_for_department === 'Directing') {
                        return true
                      }
                    }
                    else {
                      return true
                    }
                  }}
                />
            </div>
            <div>
                <FilterHeader
                multiple={true}
                  title="Actors"
                  placeholder="Search for an actor..."
                  onSelected={(selected) => setActors([...selected, ...actors])}
                  baseUrls={["https://api.themoviedb.org/3/search/person?&include_adult=false&language=en-US&page=1&query="]}
                />
                <div className='actors-badge-container'>
                  {actors.map((actor, index) => (
                    <Button key={index} size='sm' className='badge-actor' onClick={() => setActors([...actors.filter(a => a != actor)])}>
                      {actor.name}
                    <X />
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <FilterHeaderConst 
                  title={"Languages"}
                  placeholder="Search for languages..."
                  onSelected={(selected) => {
                    if(slanguages.filter(s => s.iso_639_1 === selected[0].iso_639_1).length > 0) {
                      return
                    }
                    setsLanguages([...(selected.map(s => ({...s, active: true}))), ...slanguages])
                  }}
                  options={languages.map(l => ({...l, name: l.iso_639_1.toUpperCase()}))}
                />

                <div className='genres-badge-container'>
                  {slanguages.map((genre, index) => (
                    <Badge  key={index}  bg={genre.active ? 'primary' : 'secondary'} onClick={() => {
                      /*const newGenres = slanguages.map(g => {
                        if (g.iso_639_1 === genre.iso_639_1) {
                          return {...g, active: !g.active}
                        }
                        return g
                      })*/
                      const newGenres = slanguages.filter(g => g.iso_639_1 !== genre.iso_639_1)
                      setsLanguages(newGenres)
                    } }>
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                </div>
                <div>
                <FilterHeaderConst 
                  title={"Subtitles"}
                  placeholder="Search for subtitles..."
                  onSelected={(selected) => {
                    if(subtitles.filter(s => s.iso_639_1 === selected[0].iso_639_1).length > 0) {
                      return
                    }
                    setSubtitles([...(selected.map(s => ({...s, active: true}))), ...subtitles])
                  }}
                  options={languages.map(l => ({...l, name: l.iso_639_1.toUpperCase()}))}
                />

                <div className='genres-badge-container'>
                  {subtitles.map((genre, index) => (
                    <Badge  key={index}  bg={genre.active ? 'primary' : 'secondary'} onClick={() => {
                      /*const newGenres = subtitles.map(g => {
                        if (g.iso_639_1 === genre.iso_639_1) {
                          return {...g, active: !g.active}
                        }
                        return g
                      })*/
                      const newGenres = subtitles.filter(g => g.iso_639_1 !== genre.iso_639_1)
                      setSubtitles(newGenres)
                    } }>
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            <Button className='search-button' onClick={async () => onSearch(1)}>Search</Button>

        </div>
        <div className='results' onScroll={onScroll} ref={scrollable}>
         
            {movies.map((movie, index) => (
              <MovieItem key={index} movie={movie} />
            ))}
            <Button className='random-button' onClick={randomMovie} >
              <Shuffle style={{marginRight: "5px"}} size={20} /> 
              Random Movies
            </Button>
        </div>
      </div>
      
    </>
  )
}

export default App
