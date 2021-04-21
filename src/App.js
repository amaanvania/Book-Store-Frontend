// General Imports
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Components
import Header from './components/Header'
import Footer from './components/Footer'

// Screens
import StoreScreen from './screens/StoreScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductScreen from './screens/ProductScreen';
import OrderScreen from './screens/OrderScreen';
import { UserContext } from './components/UserContext';
import { SearchContext } from './components/SearchContext'
import MyOrdersScreen from './screens/MyOrdersScreen'


function App() {
    
    const [keyword, setKeyword] = useState('')
    const [user, setUser] = useState(localStorage.getItem('user'))
    const [userID, setUserID] = useState(localStorage.getItem('userID'))
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'))

    return (
        <Router>
            <SearchContext.Provider value={{ keyword, setKeyword }}>
            <UserContext.Provider value={{ user, setUser, userID, setUserID, userRole, setUserRole }}>
                <Header/>
                <main className="py-3">
                    <Container>
                        <Route exact path="/" component={StoreScreen}/>
                        <Route path='/login' component={LoginScreen}/>
                        <Route path='/register' component={RegisterScreen}/>
                        <Route path='/myorders' component={MyOrdersScreen}/>
                        <Route path="/admin/analytics" component={AnalyticsScreen}/>
                        <Route path="/cart" component={CartScreen}/>
                        <Route path="/product/:customPath" component={ProductScreen}/>
                        <Route path="/checkout" component={OrderScreen}/>
                    </Container>
                </main>
                <Footer/>
            </UserContext.Provider>
            </SearchContext.Provider>
        </Router>
    );
}

export default App;
