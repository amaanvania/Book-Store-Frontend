import React, {useState, useEffect, useContext} from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap'
import Product from '../components/Product'
import axios from 'axios';
import { SearchContext } from '../components/SearchContext';


function StoreScreen( {history} ) { 

    // Global Context Variables
    const { keyword } = useContext(SearchContext)

    // useState Variables
    const [bookData, setBookData] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Updates on load and when keyword is changed
    useEffect(() => {
        if (keyword === '') {
            axios.get(`/book/all`).then(function (response) { // able to get book info
                console.log(response)
                setBookData(response.data)
            }).catch(function (error) { // invalid 
                console.log(error.response.data)
            })
        } else {
            axios.get(`/book/keyword/${keyword}`).then(function (response) { // able to get book info
                console.log(response)
                setBookData(response.data)
            }).catch(function (error) { // invalid 
                console.log(error.response.data)
            })
        }
        axios.get(`/category/all`).then(function (response) {
            console.log(response)
            setCategories(response.data)
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }, [keyword])

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value)
    }

    // Matching reviews with book reviews to display
    const products = (bookData, reviews) => bookData.map(itm => ({
        ...reviews.find((item) => (item.bid === itm.id) && item), ...itm
    }))

    return (
        <div>
            <Container>
            <h1>Latest Products</h1>
            <Row>
                <Button value={'all'} onClick={handleCategoryChange}>All</Button>
                {(categories.map((cat) => (
                    <Button key={cat} value={cat} onClick={handleCategoryChange}>{cat}</Button>
                )))}
            </Row>
            <Row>
                <Col>
                {(() => {
                    if (selectedCategory === 'all') {
                        return (<div>
                            {(bookData.map((book) => (
                                <Col md={3} sm={6} xs={12} style={{display: 'inline-block'}} key={book.id}>
                                    <Product product={book}/> 
                                </Col>)))}
                        </div>)
                    } else if (selectedCategory !== 'all') {
                        return (<div>
                            {(bookData.map((book) => { return book.category === selectedCategory ?
                                (<Col md={3} sm={6} xs={12} style={{display: 'inline-block'}} key={book.id}>
                                    <Product product={book}/>
                                </Col>): null}))}
                        </div>)
                    }
                })()}
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default StoreScreen
