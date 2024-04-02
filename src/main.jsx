import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Discover.jsx'

import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import ErrorPage from './ErrorPage.jsx'
import Movie from './Movie.jsx'
import Account from './Account.jsx'
import { BACKEND } from './const.js'
import Home from '../Home.jsx'


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzg2YjgwZTU3ODJiYmQ3MDU2ZThhOThmZGUxMTNlYiIsInN1YiI6IjYzYTcyMDcyMDgzNTQ3MDBlMjBmYjI4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZBQNFtL3MFY2O26dcsxNsCB9lxiB44tFNaAm8KPlJ4'
  }
}


const router = createHashRouter([
  {

    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/discover",
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
        `https://api.themoviedb.org/3/movie/${params.movieId}/videos`,
        
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
      const response6 = await fetch(`${BACKEND}/movie?id=${params.movieId}`)
      const data6 = await response6.json()
      let response7
      let data7
      if(localStorage.getItem("email")) {
        response7 = await fetch(`${BACKEND}/watchlist?email=${localStorage.getItem("email")}`)
        data7 = await response7.json()
      }
      return {data, providers: data2.results.UK || data2.results.US, cast: data3.cast, recommendations: data4, teaser: teaser, comments: data6, watchlist: data7}
    }
  },
  {
    path: "/account",
    element: <Account />,
    loader: async () => {
      const user = localStorage.getItem("email")
      if(!user) {
        return {}
      }
      const response = await fetch(`${BACKEND}/user?email=${user}`)
      const data = await response.json()
      const details = await Promise.all([...new Set(data.watchlist)].map(async id => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, options)
        const data = await response.json()
        return data
      
      }))

      return {...data, saved: details}
    }

  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div data-bs-theme={localStorage.getItem('theme') || "dark"}>
    <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
)
