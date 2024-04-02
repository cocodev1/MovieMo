import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BACKEND } from './src/const'
import { useNavigate } from 'react-router-dom'


export default function Header() {
    if(!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark')
        window.location.reload()
    }
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

    const randomMovie = async () => {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzg2YjgwZTU3ODJiYmQ3MDU2ZThhOThmZGUxMTNlYiIsInN1YiI6IjYzYTcyMDcyMDgzNTQ3MDBlMjBmYjI4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZBQNFtL3MFY2O26dcsxNsCB9lxiB44tFNaAm8KPlJ4'
            }
          }
          
        const id = Math.floor(Math.random() * 1000)
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, options)
        if(response.status != 404) {
            const data = await response.json()
            if(data.poster_path != null) {
        navigate('/movie/' + id)
            } else {
                await randomMovie()
            }
        } else {
            await randomMovie()
        }
    }

    return (
        <>
        <Navbar  className='headerbg'>
            <Container>
                <Navbar.Brand as={Link} to="/">MovieMosaic</Navbar.Brand>
                <Nav className="me-auto" style={{
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'flex-start'
                }}>
                    <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
                    <Nav.Link onClick={randomMovie}>Random Movie</Nav.Link>
                    <Nav.Link onClick={() => {
                        if(localStorage.getItem('theme') == 'dark') {
                            localStorage.setItem('theme', 'light')
                        } else {
                            localStorage.setItem('theme', 'dark')
                        }
                        window.location.reload()
                            
                            }}>
                                {localStorage.getItem('theme') == 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Nav.Link>
                   {
                          localStorage.getItem('email') ? (
                            <>
                            <Nav.Link as={Link} to="/account">Account</Nav.Link>
                            <Nav.Link style={{marginLeft: 'auto'}} onClick={() => {
                                localStorage.removeItem('email')
                                navigate('/')
                                }} >Logout</Nav.Link>
                            </>
                          ) : (
                            <div style={{
                                marginLeft: 'auto'
                            }}>
                            <Button>
                            <Nav.Link onClick={() => setShow(true)}>Login</Nav.Link>
                            </Button>
                            </div>
                          )
                   }
                </Nav>
            </Container>
        </Navbar>
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
        </>
    )
}