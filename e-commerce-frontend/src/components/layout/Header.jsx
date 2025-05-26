import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import logo from '../../assets/images/logo2.jpg';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-3 shadow-sm" style={{backgroundColor: '#1a237e'}}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            height="40"
            className="d-inline-block align-top"
            alt="E-Commerce Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto align-items-center">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/shop" className="text-white">Shop</Nav.Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin() && (
                  <Nav.Link as={Link} to="/admin" className="text-white">Admin</Nav.Link>
                )}
                <Nav.Link as={Link} to="/order-history" className="text-white">Orders</Nav.Link>
                {user?.firstName && (
                  <Navbar.Text className="mx-2 d-none d-lg-inline text-white">
                    Hi, {user.firstName}
                  </Navbar.Text>
                )}
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-lg-2 mt-2 mt-lg-0"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">Register</Nav.Link>
              </>
            )}
            
            <Nav.Link as={Link} to="/cart" className="ml-lg-2 text-white">
              <i className="fas fa-shopping-cart mr-1"></i>
              Cart{' '}
              {isAuthenticated && cartCount > 0 && (
                <Badge pill bg="light" text="dark">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;