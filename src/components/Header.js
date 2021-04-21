import React, { useContext } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { UserContext } from './UserContext';

function Header() {
    
    // Global Context Variables
    const { user, setUser } = useContext(UserContext)
    const { userRole, setUserRole } = useContext(UserContext)
    const { setUserID } = useContext(UserContext)

    // Handler for logout, clear localstorage from user, userRole and userID
    const logoutHandler = () => {
        localStorage.clear()
        setUser('')
        setUserRole('')
        setUserID('')
        window.location.reload()
    }

    return (
        <header>
        <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>Our Store</Navbar.Brand>
                </LinkContainer>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <SearchBox/>
                    <Nav className="ml-auto">
                        {user ? ( 
                            <NavDropdown title={user} id='username'>
                                <LinkContainer to='/myorders'>
                                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ): (
                            <LinkContainer to='/login'>
                                <Nav.Link><i className="fas fa-user"></i> Login</Nav.Link>
                            </LinkContainer>
                        )}

                        {userRole === 'ADMIN' && (
                            <NavDropdown className="nav__text__right" title='Admin' id='adminmenu'>
                                <LinkContainer to='/admin/analytics'>
                                    <NavDropdown.Item>Analytics</NavDropdown.Item>
                                </LinkContainer>
                        </NavDropdown>
                        )}

                        <LinkContainer to='/cart'>
                            <Nav.Link><i className="fas fa-shopping-cart"></i> Cart</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
    )
}

export default Header
