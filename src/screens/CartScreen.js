import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Row, Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap'
import Message from '../components/Message'
import { UserContext } from '../components/UserContext';

function CartScreen({ history }) {

    // Global Context Variables
    const { user } = useContext(UserContext)

    // useState Variables
    const [cartItems, setCartItems] = useState([])

    // Updates on load
    useEffect(() => {
        axios.get(`/session/cart`).then(function (response) { 
            console.log(response);
            setCartItems(response.data);
        }).catch(function (error) { 
            console.log(error.response.data);
        })
    }, [])

    // Handler for remove from cart
    const removeFromCartHandler = (e) => {
        console.log("id", e.target.value)
        axios.delete(`/session/delete`, {
            data: {
                bookID: e.target.value
            }
        }).then((response) => {
            console.log(response)
            setCartItems(response.data);
            // window.location.reload(false)
        }).catch((error) => {
            console.log(error.response.data);
        })
    }

    // Handler for cartUpdate to change quantity
    const cartQuantityHandler = (bookID) => (e) => {
        axios.post(`/session/updateQuantity`, {
                bookID: bookID,
                bookQuantity: e.target.value
        }).then((response) => {
            console.log(response)
            setCartItems(response.data);
        }).catch((error) => {
            console.log(error.response.data);
        })
    }

    // Handler to send to checkout or redirect to login if not singed in
    const checkoutHandler = () => {
        if (user) {
            history.push('/checkout')
        } else {
            history.push('/login?redirect=shipping')
        }
    }

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h1>Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <Message variant='info'>
                            Your cart is empty <Link to='/'>Go Back</Link>
                        </Message>
                    ) : (
                        <ListGroup variant='flush'>
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.book.name}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.book.image} alt={item.book.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/product/${item.book.id}`}>{item.book.name}</Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.book.price.toFixed(2)}
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control as="select" value={item.quantity} onChange={cartQuantityHandler(item.book.id)}>
                                                {
                                                    [...Array(item.book.quantity).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col md={1}>
                                            <Button type='button' variant='light' value={item.book.id} onClick={removeFromCartHandler}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items</h2>
                                ${cartItems.reduce((acc, item) => acc + item.quantity * item.book.price, 0).toFixed(2)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CartScreen
