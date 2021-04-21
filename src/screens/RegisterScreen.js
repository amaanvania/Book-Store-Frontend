import React, {useState, useContext } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input/input'
import { UserContext } from '../components/UserContext';

function RegisterScreen({ location }) {

    // Global Context Variables
    const { setUser } = useContext(UserContext)
    const { setUserID } = useContext(UserContext)
    const { setUserRole } = useContext(UserContext)

    // useState Variables
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [country, setCountry] = useState("")
    const [zip, setZip] = useState("")
    const [phone, setPhone] = useState("")

    // using History to redirect (redirect reading the url path)
    let history = useHistory()
    const redirect = location.search ? location.search.split('=')[1] : '/'

    // Handler to verify passwords matching and then register the user and login if successful
    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            axios.post('/user/register', {
                user: {
                    id: 0,
                    address: 1,
                    fname: fname,
                    lname: lname,
                    username: username,
                    password: password
                }, address: {
                    id: 1,
                    street: street,
                    city: city,
                    province: province,
                    country: country,
                    zip: zip,
                    phone: phone
                }
            }).then((response) => {
                console.log(response)
                axios.post('/user/login', {
                    id: 0,
                    address: null,
                    fname: null,
                    lname: null,
                    username: username,
                    password: password
                }).then((response) => {
                    console.log(response)
                    axios.get(`/user/${username}`).then((response) => { 
                        console.log(response);
                        localStorage.setItem('user', username)
                        localStorage.setItem('userID', response.data.user.id)
                        localStorage.setItem('userRole', response.data.user.role)
                        setUser(localStorage.getItem('user'))
                        setUserID(localStorage.getItem('userID'))
                        setUserRole(localStorage.getItem('userRole'))
                        history.push('/')
                    }).catch((error) => { 
                        console.log(error.response.data)
                    })
                }).catch((error) => {
                    console.log(error.response.data)
                })
            }).catch((error) => {
                console.log(error.response.data);
            })
        }
    }

    return (
        <FormContainer>
            <h1>Register</h1>
            {message && <Message variant='danger'>{message}</Message>}
            <Form onSubmit={ submitHandler }>
                <Row>
                    <Col md={12}>
                        <Form.Group controlId='username'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control required placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId='fname'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control required placeholder='Enter First Name' value={fname} onChange={(e) => setFname(e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId='lname'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control required placeholder='Enter Last Name' value={lname} onChange={(e) => setLname(e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId='street'>
                            <Form.Label>Street</Form.Label>
                            <Form.Control required placeholder='Enter Street' value={street} onChange={(e) => setStreet(e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId='city'>
                            <Form.Label>City</Form.Label>
                            <Form.Control required placeholder='Enter City' value={city} onChange={(e) => setCity(e.target.value)}/>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId='province'>
                                    <Form.Label>Province</Form.Label>
                                    <Form.Control required placeholder='Enter Province' value={province} onChange={(e) => setProvince(e.target.value)}/>
                                </Form.Group>

                                <Form.Group controlId='zip'>
                                    <Form.Label>Zip Code</Form.Label>
                                    <Form.Control required placeholder='Enter Zip Code' value={zip} onChange={(e) => setZip(e.target.value)}/>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId='country'>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control required placeholder='Enter Country' value={country} onChange={(e) => setCountry(e.target.value)}/>
                                </Form.Group>

                                <Form.Group controlId='phone'>
                                    <Form.Label>Phone Number</Form.Label>
                                    <PhoneInput className="phone__input" required country="CA" placeholder="Enter Phone Number" value={phone} onChange={setPhone}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId='passwordConfirm'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                

                <Button type='submit' className='btn-block' variant='primary'>Register</Button>

                <Row className='py-3'>
                    <Col>
                        Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    )
}

export default RegisterScreen
