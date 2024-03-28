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
        <Navbar bg="dark" variant="dark" className='headerbg'>
            <Container>
                <Navbar.Brand as={Link} to="/">MovieMosaic</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
                   {
                          localStorage.getItem('email') ? (
                            <>
                            <Nav.Link as={Link} to="/account">Account</Nav.Link>
                            <Nav.Link onClick={() => {
                                localStorage.removeItem('email')
                                navigate('/')
                                }} >Logout</Nav.Link>
                            </>
                          ) : (
                            <>
                            <Nav.Link onClick={() => setShow(true)}>Login</Nav.Link>
                            </>
                          )
                   }
                </Nav>
            </Container>
        </Navbar>
        <Modal show={show} onHide={() => setShow(false)}>
                   <Modal.Header closeButton>
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