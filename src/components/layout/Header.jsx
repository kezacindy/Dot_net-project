import React from 'react';
// Import Link from react-router-dom
import { Link, useNavigate } from 'react-router-dom';
// REMOVE or comment out LinkContainer import
// import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import logo from '../../assets/images/logo2.jpg'; // Make sure this path is correct
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Placeholder for cart count - replace with CartContext later
  const cartCount = 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="mb-3 shadow-sm">
      <Container>
        {/* Use Nav.Link as={Link} for the brand */}
        <Nav.Link as={Link} to="/" className="navbar-brand p-0"> {/* Remove default padding */}
          <img
            src={logo}
            height="40"
            className="d-inline-block align-top"
            alt="E-Commerce Logo"
          />
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* Use Nav.Link as={Link} for navigation items */}
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>

            {isAuthenticated && isAdmin() && (
              <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
            )}

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/order-history">Orders</Nav.Link>
                {user?.firstName && <Navbar.Text className="mx-2">Hi, {user.firstName}</Navbar.Text>}
                <Button variant="outline-secondary" size="sm" onClick={handleLogout} className="ml-2">Logout</Button>
              </>
            ) : (
               <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}

            <Nav.Link as={Link} to="/cart">
              Cart{' '}
              {cartCount > 0 && (
                <Badge pill bg="primary" text="light">{cartCount}</Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;