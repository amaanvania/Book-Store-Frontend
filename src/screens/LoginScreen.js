import React, { useState, useContext } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { UserContext } from '../components/UserContext';

function LoginScreen({ location }) {

        // Global Context Variables
    const { setUser } = useContext(UserContext)
    const { setUserID } = useContext(UserContext)
    const { setUserRole } = useContext(UserContext)

    // useState Variables
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState()

    // using History to redirect (redirect reading the url path)
    let history = useHistory()
    const redirect = location.search ? location.search.split('=')[1] : '/'

    // Handler to submit username and passwsord to login (checks to see if user exists and if password is correct)
    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('/user/login', {
            id: 0,
            address: null,
            fname: null,
            lname: null,
            username: username,
            password: password
        }).then((response) => {
            console.log(response)
            if (response.data === 'invalid password') {
                setError('Invalid Password')
            } else if (response.data  === 'invalid username') {
                setError('Invalid Username')
            } else {
                axios.get(`/user/${username}`).then((response) => { 
                    console.log(response);
                    localStorage.setItem('user', username)
                    localStorage.setItem('userID', response.data.user.id)
                    localStorage.setItem('userRole', response.data.user.role)
                    setUser(localStorage.getItem('user'))
                    setUserID(localStorage.getItem('userID'))
                    setUserRole(localStorage.getItem('userRole'))
                    history.goBack()
                }).catch((error) => { 
                    console.log(error.response.data)
                })
            }
        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            <Form onSubmit={ submitHandler }>
                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='username' placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <Button type='submit' variant='primary'>Sign In</Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
