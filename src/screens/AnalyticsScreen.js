import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { UserContext } from '../components/UserContext'

function AnalyticsScreen() {

    // Global Context Variables
    const { userRole } = useContext(UserContext)


    // useState Variables
    const [analytics, setAnalytics] = useState({})
    const [top10, setTop10] = useState([])
    const [userReport, setUserReport] = useState([])
    const [monthlyReport, setMonthlyReport] = useState([])
    const [error, setError] = useState()
    const [loading] = useState()

    // Updates on load and when userRole is changed
    useEffect(() => {
        // Check to see the role of the user
        if (userRole === 'ADMIN') {
            // Retreive top 10 from backend
            axios.get(`/analytics/top10`).then(function (response) { 
                console.log(response);
                setTop10(response.data);
            }).catch(function (error) { 
                console.log(error.response.data);
            })
            // Retreive monthly report map from backend
            axios.get(`/analytics/monthly/all`).then(function (response) { 
                console.log(response);
                setAnalytics(response.data);
            }).catch(function (error) { 
                console.log(error.response.data);
            })
            
            // Retreive user report from backend
            axios.get(`/analytics/user/report`).then(function (response) { 
                console.log(response);
                setUserReport(response.data);
            }).catch(function (error) { 
                console.log(error.response.data);
            })
        } else {
            setError('Only admins can view this page.')
        }
        
    }, [userRole])

    // Handler to set selected Month
    const monthHandler = (monthData) => (e) => {
        setMonthlyReport(analytics[e.target.value])
        //console.log(e.target.value)
        console.log("MONTHLY REPORT: ", monthData.bid, monthlyReport)
    }

    return (
        <Container>
            <h1>Analytics</h1>
            {loading 
            ? (<Loader/>)
            : error 
                ? (<Message variant='danger'>{error}</Message>)
                : (
                    <div>
                        <Row>
                            <Col md={9}>
                                {Object.keys(analytics).map((month) => (
                                    <Button key={month} value={month} onClick={monthHandler(month)}>{month}</Button>
                                ))} 
                                <h4>Monthly Report</h4>
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>TITLE</th>
                                            <th>PRICE</th>
                                            <th>AMOUNT SOLD</th>
                                            <th>SALES</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            monthlyReport.map(mop => (
                                                <tr key={mop.bid}>
                                                    <td>{mop.bid}</td>
                                                    <td>{mop.title}</td>
                                                    <td>{mop.price.toFixed(2)}</td>
                                                    <td>{mop.amount_sold}</td>
                                                    <td>{mop.monthly_sales.toFixed(2)}</td>
                                                </tr>
                                                ))

                                        }
                                        {/* {Object.keys(analytics).forEach(function(key) {
                                            analytics['APRIL'].map(month => (
                                                //console.log("Month: ", month)
                                                <tr key={month.bid}>
                                                    <td>{month.bid}</td>
                                                    <td>{month.title}</td>
                                                    <td>{month.price}</td>
                                                    <td>{month.amunt_sold}</td>
                                                    <td>{month.monthly_sales}</td>
                                                </tr>
                                            ))
                                        })} */}
                                    </tbody>
                                </Table>

                                <h4>Top 10 Sold Books</h4>
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>TITLE</th>
                                            <th>QUANTITY</th>
                                            <th>PRICE</th>
                                            <th>REVENUE</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {top10.map(top => (
                                            <tr key={top.bid}>
                                                <td>{top.bid}</td>
                                                <td>{top.title}</td>
                                                <td>{top.quantity}</td>
                                                <td>{top.price.toFixed(2)}</td>
                                                <td>{top.revenue.toFixed(2)}</td>
                                            </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Col>

                            <Col md={3}>
                                <h4>User Buying Statistics</h4>
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>USERNAME</th>
                                            <th>TOTAL</th>
                                            <th>ZIP CODE</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {userReport.map((report, i) => (
                                            <tr key={i}>
                                                <td>{report.username}</td>
                                                <td>{report.total_amount.toFixed(2)}</td>
                                                <td>{report.zip_code}</td>
                                            </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </div>
                )}
        </Container>
    )
}

export default AnalyticsScreen
