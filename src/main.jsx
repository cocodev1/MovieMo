import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Discover.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import ErrorPage from './ErrorPage.jsx'
import Movie from './Movie.jsx'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzg2YjgwZTU3ODJiYmQ3MDU2ZThhOThmZGUxMTNlYiIsInN1YiI6IjYzYTcyMDcyMDgzNTQ3MDBlMjBmYjI4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZBQNFtL3MFY2O26dcsxNsCB9lxiB44tFNaAm8KPlJ4'
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/movie/:movieId",
    element: <Movie />,
    loader: async ({ params }) => { 
      const toFetch = [
        `https://api.themoviedb.org/3/movie/${params.movieId}`,
        `https://api.themoviedb.org/3/movie/${params.movieId}/watch/providers`,
        `https://api.themoviedb.org/3/movie/${params.movieId}/credits`,
        `https://api.themoviedb.org/3/movie/${params.movieId}/recommendations`,
        `https://api.themoviedb.org/3/movie/${params.movieId}/videos`
      ]
      /*const response = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}`, options)
      const data = await response.json()
      const response2 = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}/watch/providers`, options)
      const data2  = await response2.json()
      const response3 = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}/credits`, options)
      const data3 = await response3.json()
      const response4 = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}/recommendations`, options)
      const data4 = await response4.json()
      const response5 = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}/videos`, options)
      const data5 = await response5.json()*/
      const [data, data2, data3, data4, data5] = await Promise.all(toFetch.map(async url => {
        const res = await fetch(url, options)
        const data = await res.json()
        return  data
      }))
      console.log(data5)
      let teaser = data5.results.find(r => r.type == "Trailer" && r.site == "YouTube" && r.official)?.key
      if(!teaser) {
        teaser = data5.results.find(r => r.site == "YouTube")?.key
      }
      return {data, providers: data2.results.UK || data2.results.US, cast: data3.cast, recommendations: data4, teaser: teaser}
    }
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
