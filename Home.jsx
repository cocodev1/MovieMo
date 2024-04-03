import { useState } from "react";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { BACKEND } from "./src/const"; 


export default function Home() {


    const navigate = useNavigate()

    const [show, setShow] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = async () => {
        try {
            const res = await fetch(`${BACKEND}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            if(res.status == 500) {
                console.log("User already exists")
            }
        } catch(e) {
            console.log("User exist", e)
        }
        localStorage.setItem('email', email)
        setShow(false)
        navigate('/discover')
    }

    return (
        <>
        <Header />
        <div style={{
            backgroundImage: 'url(https://raw.githubusercontent.com/mc2076/moviemosaic/main/american-movie-posters-z0puq43u0qbtr6j2.webp)',
            height: '93.2vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'multiply'}}>
            <div className="big-home justify-content-center">
                <div className="col-md-12 text-center">
                    <h1  class="mb-4" style={{
                        fontSize: '3.5rem',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }}>Welcome to Movie Mosaic!</h1>
                    <p  className="big-home" style={{
                        fontSize: '2rem'
                    }}> Let us help you find the movie you are looking for.</p>
                    <p>  </p>
                    <p>  </p>
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => setShow(true)} data-bs-theme={localStorage.getItem('theme')}>Get Started</button>
                </div>
            </div>
            <Modal show={show} onHide={() => setShow(false)} data-bs-theme={localStorage.getItem('theme')}>
                   <Modal.Header closeButton data-bs-theme={localStorage.getItem('theme')} style={{...(localStorage.getItem('theme') == 'dark' && {color: "#fff"})}}>
                          <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Email</p>
                        <input type="email" onChange={e => setEmail(e.target.value)} />
                        <p>Password</p>
                        <input type="password" onChange={e => setPassword(e.target.value)}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={login}>
                            Login
                        </Button>
                    </Modal.Footer>

        </Modal>
        </div>

        </>
    )
}