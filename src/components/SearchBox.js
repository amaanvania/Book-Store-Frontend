import React, {useState, useContext} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { SearchContext } from './SearchContext'

function SearchBox() {

    // Global Context Variables
    const { setKeyword } = useContext(SearchContext)

    // useState Variables
    const [search, setSearch] = useState('')

    // using History to redirect (redirect reading the url path)
    let history = useHistory()

    // Handler to submit and send the keyword to the Store Screen
    const submitHandler = (e) => {
        e.preventDefault()
        setKeyword(search)
        history.push('/')
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <Form.Control type='text' name='q' placeholder='Search...' onChange={(e) => setSearch(e.target.value)} className='mr-sm-2 ml-sm-5 search__box'>

            </Form.Control>

            <Button type='submit' variant='outline-success' className='p-2 search__btn'><i className='fas fa-search'></i>Search</Button>
        </Form>
    )
}

export default SearchBox