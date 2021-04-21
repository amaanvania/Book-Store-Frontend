import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap'
import Message from '../components/Message'
import { UserContext } from '../components/UserContext'

function OrderScreen() {

    // Global Context Variables
    const { user } = useContext(UserContext)
    const { userID } = useContext(UserContext)

    // useState Variables
    const [cartItems, setCartItems] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [userAddress, setUserAddress] = useState([])
    const [paid, setPaid] = useState('')
    const [orderID, setOrderID] = useState()
    const [error, setError] = useState()
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [country, setCountry] = useState("")
    const [zip, setZip] = useState("")
    const [shippingBool, setShippingBool] = useState(false)
    const [creditCard, setCreditCard] = useState('')

    // Updates on load and when user is changed
    useEffect(() => {
        axios.get(`/user/${user}`).then(function (response) { 
            console.log(response);
            setUserInfo(response.data.user)
            setUserAddress(response.data.address)
        }).catch(function (error) { 
            console.log(error.response.data);
        })

        axios.get(`/session/cart`).then(function (response) { 
            console.log(response);
            setCartItems(response.data);
        }).catch(function (error) { 
            console.log(error.response.data);
        })
    }, [user])

    // Calculations for subtotal, tax, and total
    const subtotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0)
    const tax = (subtotal * 0.13)
    const total = (subtotal + tax)

    // Handler for checkout
    const deliverHandler = () => {
        axios.post(`/session/checkout`, {
            ccd: creditCard,
            username: user,
            totalAmount: total.toFixed(2)
        }).then((response) => {
            if (response.data === 'Invalid Payment') {
                setError('Credit Card Authorization Failed.')
            } else {
                setPaid('Paid')
                setOrderID(response.data)
                setError('')
            }
        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    // Handler to display Shipping Change
    const shippingHandler = () => {
        if (shippingBool === false) {
            setShippingBool(true)
        } else {
            setShippingBool(false)
        }
    }

    // Submit Shipping Changes to the backend
    const submitHandler = () => {
        axios.post(`/address/update`, {
                id: userAddress.id,
                street: street,
                city: city,
                province: province,
                country: country,
                zip: zip,
                phone: null
        }).then((response) => {
            console.log(response)
            window.location.reload()
        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    return (
        <div>
            {paid ? (
                <h1>Order: {orderID}</h1>
            ) : 
            (<h1>Order:</h1>)}
            
            {error && <Message variant='danger'>{error}</Message>}
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {userInfo.fname} {userInfo.lname}</p>
                            <p><strong>Phone: </strong> <a href={`tel:${userAddress.phone}`}>{userAddress.phone}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {userAddress.street}, {userAddress.city}, {userAddress.province}, {userAddress.country}, {userAddress.zip}
                            </p>
                            <Button onClick={shippingHandler} className='btn-block' variant='secondary' type='button'>Change Shipping Address</Button>
                            {shippingBool && (
                                <div>
                                        <Form.Group controlId='street'>
                                            <Form.Label>Street</Form.Label>
                                            <Form.Control required placeholder='Enter Street' value={street} onChange={(e) => setStreet(e.target.value)}/>
                                        </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId='city'>
                                                <Form.Label>City</Form.Label>
                                                <Form.Control required placeholder='Enter City' value={city} onChange={(e) => setCity(e.target.value)}/>
                                            </Form.Group>

                                            <Form.Group controlId='province'>
                                                <Form.Label>Province</Form.Label>
                                                <Form.Control required placeholder='Enter Province' value={province} onChange={(e) => setProvince(e.target.value)}/>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId='zip'>
                                                <Form.Label>Zip Code</Form.Label>
                                                <Form.Control required placeholder='Enter Zip Code' value={zip} onChange={(e) => setZip(e.target.value)}/>
                                            </Form.Group>

                                            <Form.Group controlId='country'>
                                                <Form.Label>Country</Form.Label>
                                                <Form.Control required placeholder='Enter Country' value={country} onChange={(e) => setCountry(e.target.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button type='button' className='btn-block' variant='primary' onClick={submitHandler}>Confirm</Button>
                                </div>
                            )}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p><strong>Method: </strong>Credit Card</p>
                            {paid ?  (
                                <Message variant='success'>Order Successfully Completed.</Message>
                            ) : (
                                <Message variant='warning'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.lenght === 0 ? <Message variant='info'>Order is empty</Message> : (
                                <ListGroup variant='flush'>
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.book.image} alt={item.book.name} fluid rounded/>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.book.id}`}>{item.book.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.quantity} x ${item.book.price} = ${(item.quantity * item.book.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${subtotal.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${tax.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${total.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                        </ListGroup>

                        {/* {loadingDeliver && <Loader/>} */}
                        
                        {paid ? (
                            <div></div>
                        ) : (
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Form.Group controlId='username'>
                                        <Form.Label>Credit Card</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Credit Card Number' value={creditCard} onChange={(e) => setCreditCard(e.target.value)}/>
                                    </Form.Group>
                                </ListGroup.Item>
                            
                                <ListGroup.Item>
                                    <Button type='button' disabled={creditCard === ''} className='btn btn-block' onClick={deliverHandler}>Confirm Order</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                        
                        
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
