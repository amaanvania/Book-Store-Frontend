import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'

function Footer() {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-5">
                        Copyright &copy; Our Store
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
