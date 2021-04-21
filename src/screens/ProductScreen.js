import React, {useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Row, Col, Image, ListGroup, Button, Card, Form, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Rating from '../components/Rating'
import { UserContext } from '../components/UserContext';

// eventually send props info OPTIONALLY from storescreen for faster loading. 

function ProductScreen({ match, history }) {

    // Global Context Variables
    const { user } = useContext(UserContext)
    const { userID } = useContext(UserContext)

    // useState Variables
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [bookInfo, setBookInfo] = useState({})
    const [reviewInfo, setReviewInfo] = useState([])

    // Getting path from the url string (this relates to the bookID)
    let path = window.location.pathname.split('\\').pop().split('/').pop();

    // Updates on load and when path is changed
    useEffect(() => {
        axios.get(`/book/${path}`).then(function (response) { 
            console.log(response);
            setBookInfo(response.data);
        }).catch(function (error) { 
            console.log(error.response.data);
        })

        axios.get(`/review/book/${path}`).then(function (response) { 
            console.log(response);
            setReviewInfo(response.data);
        }).catch(function (error) { 
            console.log(error.response.data);
        })
    }, [path])

    // Handler to addToCard (passing bookID and bookQuantity)
    const addToCartHandler = () => {
        console.log("Path: ", path, qty)
        axios.post(`/session/addToCart`, {
            bookID: path,
            bookQuantity: qty
        }).then((response) => {
            console.log(response)
            history.push(`/cart/`)
        }).catch((error) => {
            console.log(error.response.data);
        })
    }

    // Handler to insert a review to the backend
    const submitHandler = (e) => {
        e.preventDefault()
        axios.post(`/review/insert`, {
            review_id: 0,
            book_id: path,
            review: comment,
            rating: rating,
            user_id: userID,
            date_time: null
        }).then((response) => {
            console.log(response)
            window.location.reload()
        }).catch((error) => {
            console.log(error.response.data);
        })
    }

    return (
        <Container>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            <Row>
                <Col md={5}>
                    <Image src={bookInfo.image} alt={bookInfo.name} fluid/>
                </Col>

                <Col md={4}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{bookInfo.name}</h3>
                            <Rating value={bookInfo.rating} text={` ${bookInfo.numReviews} reviews`} color={'#f8e825'}/>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: ${(bookInfo.price * 1).toFixed(2)}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Category: {bookInfo.category}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item >
                                <Row>
                                    <Col>Price:</Col>
                                    <Col><strong>${(bookInfo.price * qty).toFixed(2)}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item >
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>{bookInfo.quantity > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                </Row>
                            </ListGroup.Item>

                            {bookInfo.quantity > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty:</Col>
                                        <Col xs='auto' className='my-1'>
                                            <Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
                                                {
                                                    [...Array(bookInfo.quantity).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button onClick={addToCartHandler} className='btn-block' disabled={bookInfo.quantity === 0} type='button'>Add to Cart</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>   
            </Row>

            <Row className="pt-4">
                <Col md={6}>
                    <h4>Reviews</h4>
                    <ListGroup variant='flush'>
                        {reviewInfo.map((review) => (
                            <ListGroup.Item key={review.review_id}>
                                <strong>{review.name}</strong>
                                <Rating value={review.rating} color='#f8e825'/>
                                <p>{review.date_time.substring(0, 10)}</p>
                                <p>{review.review}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col md={6}>
                    <h4>Write a review</h4>

                    {user ? (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value=''>Select...</option>
                                    <option value='1'>1 - Poor</option>
                                    <option value='2'>2 - Fair</option>
                                    <option value='3'>3 - Good</option>
                                    <option value='4'>4 - Very Good</option>
                                    <option value='5'>5 - Excellent</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='comment'>
                                <Form.Label>Review</Form.Label>
                                <Form.Control as='textarea' rows='5' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Button disabled={rating === 0 || comment === ''} type='submit' variant='primary'>Submit</Button>
                        </Form>
                    ) : (
                        <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                    )}
                </Col>
            </Row>
    </Container>
    )
}

export default ProductScreen
