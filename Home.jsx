import Header from "./Header";

export default function Home() {
    return (
        <>
        <Header />
        <div style={{
            backgroundImage: 'url(https://raw.githubusercontent.com/mc2076/moviemosaic/main/american-movie-posters-z0puq43u0qbtr6j2.webp)',
            height: '93.2vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'multiply'}}>
            <div className=" justify-content-center">
                <div className="col-md-12 text-center">
                    <h1  class="mb-4" style={{
                        fontSize: '3.5rem',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        color: 'white',
                        textOverflow: 'ellipsis'
                    }}>Welcome to Movie Mosaic!</h1>
                    <p style={{
                        color: 'white',
                        fontSize: '2rem'
                    }}> Let us help you find the movie you are looking for.</p>
                    <p>  </p>
                    <p>  </p>
                    <button type="button" className="btn btn-primary btn-lg">Get Started</button>
                </div>
            </div>
        </div>

        </>
    )
}