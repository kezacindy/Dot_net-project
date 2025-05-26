import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, ListGroup, Row, Col, Image as BootstrapImage } from 'react-bootstrap';
import { getOrderHistory } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import placeholderImageFromAssets from '../assets/images/placeholder.png';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const currencySymbol = 'rwf';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register?redirect=/order-history');
    } else {
      fetchOrders();
    }
    // document.body.classList.add('page-body-style'); // General page style
    // return () => document.body.classList.remove('page-body-style');
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderHistory();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch order history.');
      console.error("Fetch Order History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImageFromAssets;
  };

  if (!isAuthenticated) {
    return <Container className="text-center mt-5"><p>Redirecting to login...</p><Spinner animation="border" /></Container>;
  }

  if (loading) {
    return (
      <Container className="text-center mt-5 page-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading your order history...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 page-container">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchOrders} variant="primary">Try Again</Button>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <h2 className="mb-4">My Order History</h2>
      {orders.length === 0 ? (
        <Card className="text-center shadow-sm">
          <Card.Body>
            <Card.Title>No Orders Yet</Card.Title>
            <Card.Text>You haven't placed any orders with us.</Card.Text>
            <Button as={Link} to="/shop" variant="primary">Start Shopping</Button>
          </Card.Body>
        </Card>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="mb-4 order-history-item">
            <Card.Header className="order-history-header">
              <div>
                <h5>Order ID: #{order.id}</h5>
                <small className="text-muted">
                  Placed on: {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                </small>
              </div>
              <div>
                <span className={`badge bg-${order.orderStatus === 'Pending' ? 'warning text-dark' : (order.orderStatus === 'Delivered' ? 'success' : 'info')}`}>
                  {order.orderStatus}
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={8}><strong>Shipping Address:</strong> {order.shippingAddress}</Col>
                <Col md={4} className="text-md-right"><strong>Total: {currencySymbol}{order.totalAmount?.toFixed(2)}</strong></Col>
              </Row>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-light font-weight-bold">Items:</ListGroup.Item>
                {order.orderItems?.map(item => (
                  <ListGroup.Item key={item.id || item.productId} className="d-flex align-items-center py-3">
                    <BootstrapImage
                      src={item.imageUrl || placeholderImageFromAssets}
                      alt={item.productName}
                      onError={handleImageError}
                      className="order-item-image"
                    />
                    <div className="flex-grow-1">
                      <strong>{item.productName}</strong>
                      <div className="text-muted small">
                        Qty: {item.quantity} × {currencySymbol}{item.unitPrice?.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-weight-bold">
                      {currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            {/* Optionally add a reorder button or view details link per order */}
            {/* <Card.Footer className="text-right">
              <Button as={Link} to={`/orders/${order.id}`} variant="outline-primary" size="sm">View Details</Button>
            </Card.Footer> */}
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderHistoryPage;