import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import parse from 'url-parse'


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,DELETE",
    "Access-Control-Max-Age": "86400",
}

function handleOptions (request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    let headers = request.headers
    if (
            headers.get("Origin") !== null &&
            headers.get("Access-Control-Request-Method") !== null &&
            headers.get("Access-Control-Request-Headers") !== null
    ) {
            // Handle CORS pre-flight request.
            // If you want to check or reject the requested method + headers
            // you can do that here.
            let respHeaders = {
                    ...corsHeaders,
                    // Allow all future content Request headers to go back to browser
                    // such as Authorization (Bearer) or X-Client-Name-Version
                    "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
            }
            return new Response(null, {
                    headers: respHeaders,
            })
    }
    else {
            // Handle standard OPTIONS request.
            // If you want to allow other HTTP Methods, you can do that here.
            return new Response(null, {
                    headers: {
                            Allow: "GET, HEAD, POST, OPTIONS",
                    },
            })
    }
}

export default {


    async fetch(request, env, ctx) {
        if(request.method === "OPTIONS") {
            return handleOptions(request)
        }
        try {

        const pool = new Pool({ connectionString: env.DATABASE_URL })
        const adapter = new PrismaPg(pool)
        const prisma = new PrismaClient({ adapter })

        const url = parse(request.url, true)
        switch (url.pathname) {
            case "/watchlist": {
                if(request.method == "POST") {
                    const {email, movie} = await request.json()
                    console.log(email)
                    const user = await prisma.user.update({
                        where: {
                            email
                        },
                        data: {
                            watchlist: {
                                push: movie
                            }
                        }
                    })
                    return new Response(JSON.stringify(user), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                } else if(request.method == "DELETE") {

                    const {email, movie} = await request.json()
                    var user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    user = await prisma.user.update({
                        where: {
                            email
                        },
                        data: {
                            watchlist: {
                                set: user.watchlist.filter(m => m !== movie)
                            }
                        }
                    })
                    return new Response(JSON.stringify(user), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                }
                else {
                    const {email} = url.query
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    return new Response(JSON.stringify(user.watchlist), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                }
            }
            case "/user": {
                if(request.method == "POST") {
            
                    const {email, password} = await request.json() 
                    console.log(email)
                    const user = await prisma.user.create({
                        data: {
                            email,
                            password
                        }
                    })
                    return new Response(JSON.stringify(user), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                } 
                 else {
                    const {email} = url.query
                    const comments = await prisma.comment.findMany({
                        where: {
                            user: {
                                email
                            }
                        }
                    })

                    const avgRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length
                    const nComments  = comments.length
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    const {watchlist, createdAt} = user
                    return new Response(JSON.stringify({avgRating, nComments, watchlist, createdAt}), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                }
            }
            case "/movie" : {
                const {id} = url.query
                const comments =   await prisma.comment.findMany({
                    where: {
                        movieId: Number(id)
                    }
                })
                return new Response(JSON.stringify(comments), {
                    headers: {  
                        'content-type': 'application/json' ,
                        ...corsHeaders
                    }
                })
            }
            case "/comments": {
                if(request.method == "POST") {
                    const {user, movie, rating, text} = await request.json()
                    const comment = await prisma.comment.create({
                        data: {
                            user: {
                                connect: {
                                    email: user
                                }
                            },
                            movieId: movie,
                            rating,
                            content: text
                        }
                    })
                    return new Response(JSON.stringify(comment), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                } else {
                    const {movies} = url.query
                    const comments = await prisma.comment.findMany({
                        where: {
                            movieId: {
                                in: movies.split(",").map(Number)
                            }
                        }
                    })
                    const avgRatings = {}
                    for (var i = 0; i < comments.length; i++) {
                       if(avgRatings[comments[i].movieId]) {
                            avgRatings[comments[i].movieId].rating += comments[i].rating
                            avgRatings[comments[i].movieId].nComments += 1
                       } else {
                            avgRatings[comments[i].movieId] = {
                                rating: comments[i].rating,
                                nComments: 1
                            }
                       }
                    }
                    for (var key in avgRatings) {
                        avgRatings[key] = avgRatings[key].rating / avgRatings[key].nComments
                    }
                    const res = []
                    for (var key in avgRatings) {
                        res.push({movieId: key, avgRating: avgRatings[key]})
                    }
                    return new Response(JSON.stringify(res), {
                        headers: {  
                            'content-type': 'application/json' ,
                            ...corsHeaders
                        }
                    })
                }
            }
            default: {
                return new Response("Not found", {
                    status: 404,
                    headers: {  
                        'content-type': 'text/plain' 
                    }
                })
            }
        }

        
    }
    catch(e) {
        throw e
        return new Response(e.message, {
            status: 500,
            headers: {  
                'content-type': 'text/plain' 
            }
        })
    }
    }
}