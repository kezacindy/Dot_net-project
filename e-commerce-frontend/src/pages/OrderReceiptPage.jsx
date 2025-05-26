import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, ListGroup, Image as BootstrapImage, Spinner, Alert } from 'react-bootstrap'; // Added Spinner & Alert
import { useAuth } from '../context/AuthContext';
import placeholderImageFromAssets from '../assets/images/placeholder.png';

const OrderReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Destructure user
  const { order, total } = location.state || {}; // Get order data passed from CheckoutPage

  const currencySymbol = 'rwf';

  useEffect(() => {
    if (!isAuthenticated) {
      // If someone lands here unauthenticated, maybe redirect to login
      // but usually, this page is reached after a successful checkout session.
      navigate('/login');
    }
    if (!order || !order.id) {
      // If no order data, redirect to home or order history as it's unexpected
      console.warn("OrderReceiptPage: No order data found in location state. Redirecting to home.");
      navigate('/');
    }
    // Optional: document.body.classList.add('receipt-page-body');
    // return () => document.body.classList.remove('receipt-page-body');
  }, [isAuthenticated, order, navigate]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImageFromAssets;
  };

  // This fallback should ideally not be hit often if navigation from checkout is correct
  if (!order || !order.id) {
    return (
      <Container className="page-container text-center mt-5">
        <Spinner animation="border" variant="primary" className="mb-3"/>
        <p>Loading order details or redirecting...</p>
        <Alert variant="info" className="mt-3">
            If you are not redirected, please <Link to="/">click here to go to the homepage</Link>.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="page-container mt-4 mb-5"> {/* Consistent page padding */}
      <Card className="order-receipt-card shadow-lg"> {/* Added shadow */}
        <Card.Header as="h2" className="text-center bg-success text-white py-3">
          <i className="fas fa-check-circle mr-2"></i>Order Confirmed!
        </Card.Header>
        <Card.Body className="p-4">
          <p className="text-center thank-you-msg mb-4 lead">
            Thank you for your purchase, {user?.firstName || 'Valued Customer'}!
          </p>
          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <h4>Order Summary</h4>
              <dl className="row receipt-details">
                <dt className="col-sm-5">Order ID:</dt>
                <dd className="col-sm-7">#{order.id}</dd>

                <dt className="col-sm-5">Order Date:</dt>
                <dd className="col-sm-7">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</dd>

                <dt className="col-sm-5">Order Status:</dt>
                <dd className="col-sm-7">
                  <span 
                    className={`badge ${
                      order.orderStatus === 'Pending' ? 'bg-warning text-dark' : 
                      order.orderStatus === 'Shipped' ? 'bg-info text-white' : 
                      order.orderStatus === 'Delivered' ? 'bg-success text-white' : 
                      'bg-secondary text-white' 
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </dd>

                <dt className="col-sm-5">Total Amount:</dt>
                <dd className="col-sm-7"><strong>{currencySymbol}{order.totalAmount?.toFixed(2)}</strong></dd>
              </dl>
            </Col>
            <Col md={6}>
              <h4>Shipping Address</h4>
              <address className="receipt-details">
                {/* Attempt to parse the address string for better display */}
                {order.shippingAddress?.split(',').map((part, index) => (
                    <p key={index} className="mb-1">{part.trim()}</p>
                ))}
              </address>
            </Col>
          </Row>

          <h4 className="mt-4 mb-3">Items Ordered ({order.orderItems?.length || 0})</h4>
          <ListGroup variant="flush" className="mb-4">
            {order.orderItems?.map((item) => (
              <ListGroup.Item key={item.id || item.productId} className="d-flex align-items-center px-0 py-3">
                <BootstrapImage
                  src={item.imageUrl || placeholderImageFromAssets}
                  alt={item.productName}
                  onError={handleImageError}
                  style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '15px' }}
                  rounded
                />
                <div className="flex-grow-1">
                  <strong className="d-block">{item.productName}</strong>
                  <div className="text-muted small">
                    Quantity: {item.quantity} × {currencySymbol}{item.unitPrice?.toFixed(2)}
                  </div>
                </div>
                <div className="font-weight-bold">
                  {currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="text-center mt-4 pt-3 border-top">
            <Button as={Link} to="/shop" variant="primary" className="mr-2 mb-2 mb-md-0">
              <i className="fas fa-shopping-bag mr-2"></i>Continue Shopping
            </Button>
            <Button as={Link} to="/order-history" variant="outline-secondary" className="mb-2 mb-md-0">
              <i className="fas fa-history mr-2"></i>View Order History
            </Button>
          </div>
          <p className="text-center text-muted mt-3 small">
            A confirmation email with your order details has been sent (Actual email sending TBD).
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderReceiptPage;