import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Table } from 'react-bootstrap'
import { UserContext } from '../components/UserContext'

function MyOrdersScreen() {
    
    // Global Context Variables
    const { userID } = useContext(UserContext)

    // useState Variables
    const [orders, setOrders] = useState([])

    // Updates on load and userID change
    useEffect(() => {
        axios.get(`/order/user/${userID}`).then(function (response) { 
            console.log(response)
            setOrders(response.data)
        }).catch(function (error) { 
            console.log(error.response.data);
        })
    }, [userID])

    return (
        <div>
            <h1>My Orders</h1>
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                        <th>TOTAL PRICE</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.status}</td>
                            <td>{order.date_time.substring(0, 10)}</td>
                            <td>{order.total_price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default MyOrdersScreen
