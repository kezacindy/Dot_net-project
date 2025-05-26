import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Image as BootstrapImage, Spinner, Alert, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import placeholderImageFromAssets from '../assets/images/placeholder.png';

// Inline CSS styles
const styles = `
.cart-page-body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
}

.cart-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Styles */
.cart-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.3);
}

.cart-title {
  color: white !important;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cart-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
}

/* Enhanced Cards */
.enhanced-card {
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s ease !important;
  margin-bottom: 1.5rem !important;
}

.enhanced-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
}

/* Cart Items */
.cart-items-card {
  overflow: hidden;
}

.cart-item {
  padding: 1.5rem 0;
  transition: all 0.3s ease;
  position: relative;
}

.cart-item:hover {
  background: rgba(147, 197, 253, 0.1);
  border-radius: 12px;
  margin: 0 -1rem;
  padding: 1.5rem 1rem;
}

.cart-item-border {
  border-bottom: 1px solid rgba(147, 197, 253, 0.2);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 0.5rem;
}

.product-image {
  max-height: 100px !important;
  width: 100% !important;
  object-fit: contain !important;
  transition: transform 0.3s ease !important;
}

.product-image:hover {
  transform: scale(1.05);
}

.product-details {
  width: 100%;
}

.product-name {
  color: #1e293b !important;
  font-weight: 600 !important;
  font-size: 1.2rem !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.4;
}

.unit-price {
  color: #64748b !important;
  font-size: 0.9rem !important;
  margin-bottom: 0 !important;
}

.price-value {
  color: #059669 !important;
  font-weight: 600 !important;
}

.quantity-controls {
  position: relative;
}

.quantity-input {
  width: 80px !important;
  text-align: center !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.quantity-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25) !important;
}

.remove-btn {
  color: #dc2626 !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  transition: all 0.3s ease !important;
}

.remove-btn:hover {
  color: #b91c1c !important;
  text-decoration: none !important;
  transform: translateX(-2px);
}

.item-total {
  color: #1e293b !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
}

.cart-notice {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  color: white !important;
  padding: 1rem !important;
  border-radius: 10px !important;
  margin-top: 1.5rem !important;
  font-size: 0.9rem !important;
  text-align: center !important;
}

/* Order Summary */
.order-summary-card {
  position: sticky;
  top: 2rem;
}

.summary-title {
  color: #1e40af !important;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 2px solid #dbeafe !important;
}

.summary-content {
  margin-bottom: 1.5rem !important;
}

.summary-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 0.75rem 0 !important;
  color: #374151 !important;
}

.summary-value {
  font-weight: 600 !important;
  color: #059669 !important;
}

.free-shipping {
  color: #dc2626 !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  font-size: 0.9rem !important;
}

.summary-divider {
  height: 1px !important;
  background: linear-gradient(90deg, transparent, #93c5fd, transparent) !important;
  margin: 1rem 0 !important;
}

.total-row {
  padding: 1rem 0 !important;
  border-top: 2px solid #dbeafe !important;
  font-size: 1.1rem !important;
}

.vat-note {
  font-size: 0.8rem !important;
  color: #6b7280 !important;
  font-weight: normal !important;
}

.total-value {
  color: #1e40af !important;
  font-size: 1.3rem !important;
}

/* Enhanced Buttons */
.enhanced-btn {
  border: none !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

.enhanced-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.enhanced-btn:hover::before {
  left: 100%;
}

.enhanced-btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
}

.enhanced-btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
  color: white !important;
}

.enhanced-btn-block {
  width: 100% !important;
  padding: 1rem !important;
  font-size: 1.1rem !important;
}

.enhanced-btn-lg {
  padding: 1rem 2rem !important;
  font-size: 1.2rem !important;
}

.checkout-btn {
  margin-bottom: 0 !important;
}

/* Discount Card */
.discount-card {
  margin-top: 1rem !important;
}

.discount-title {
  color: #7c3aed !important;
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
}

.discount-form {
  display: flex !important;
  gap: 0.5rem !important;
}

.discount-input {
  flex: 1 !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 8px !important;
  padding: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.discount-input:focus {
  border-color: #7c3aed !important;
  box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25) !important;
}

.apply-btn {
  border-radius: 8px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
  transition: all 0.3s ease !important;
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%) !important;
  border-color: #7c3aed !important;
}

.apply-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3) !important;
  background: linear-gradient(135deg, #5b21b6 0%, #4c1d95 100%) !important;
  border-color: #5b21b6 !important;
}

/* Enhanced Alerts */
.enhanced-alert {
  border: none !important;
  border-radius: 12px !important;
  padding: 1rem 1.5rem !important;
  margin-bottom: 1.5rem !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
}

.success-alert {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  color: white !important;
}

.alert-content {
  display: flex !important;
  align-items: center !important;
}

.alert-icon {
  margin-right: 0.75rem !important;
  font-size: 1.2rem !important;
}

/* Loading States */
.loading-container {
  padding: 3rem 0 !important;
}

.loading-spinner {
  margin-bottom: 1rem !important;
}

.loading-text {
  color: #6b7280 !important;
  font-size: 1.1rem !important;
  margin-top: 1rem !important;
}

/* Empty Cart */
.empty-cart-container {
  padding: 4rem 2rem !important;
  text-align: center !important;
}

.empty-cart-icon {
  font-size: 4rem !important;
  color: #9ca3af !important;
  margin-bottom: 1.5rem !important;
}

.empty-cart-title {
  color: #1e40af !important;
  font-weight: 700 !important;
  margin-bottom: 1rem !important;
}

.empty-cart-subtitle {
  color: #6b7280 !important;
  font-size: 1.1rem !important;
  margin-bottom: 2rem !important;
}

/* Sidebar Sticky */
.sidebar-sticky {
  position: sticky;
  top: 2rem;
}

/* Responsive Design */
@media (max-width: 991.98px) {
  .cart-title {
    font-size: 2rem !important;
  }
  
  .sidebar-sticky {
    position: static !important;
    margin-top: 2rem !important;
  }
  
  .order-summary-card {
    position: static !important;
  }
}

@media (max-width: 767.98px) {
  .cart-header {
    padding: 1rem 0 !important;
  }
  
  .cart-title {
    font-size: 1.8rem !important;
  }
  
  .enhanced-card {
    margin: 0 -15px 1.5rem -15px !important;
    border-radius: 0 !important;
  }
  
  .product-name {
    font-size: 1.1rem !important;
  }
  
  .quantity-input {
    width: 70px !important;
  }
  
  .discount-form {
    flex-direction: column !important;
  }
  
  .apply-btn {
    margin-top: 0.5rem !important;
  }
}

/* Focus states for accessibility */
.enhanced-btn:focus,
.quantity-input:focus,
.discount-input:focus {
  outline: none !important;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.5) !important;
}

/* Enhanced shadows and depth */
@supports (backdrop-filter: blur(20px)) {
  .enhanced-card {
    background: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(20px);
  }
}
`;

const CartPage = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    loading: cartLoading,
    error: cartError,
    successMessage: cartSuccessMessage,
    removeItemFromCart,
    updateItemInCart,
    fetchCart,
    clearCartError,
    clearCartSuccessMessage
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const currencySymbol = 'rwf';

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    document.body.classList.add('cart-page-body');
    return () => {
      document.body.classList.remove('cart-page-body');
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
    } else {
      // Optionally force fetch cart data if needed, though CartContext might handle it
      // fetchCart(); 
    }
    if(clearCartError) clearCartError();
    if(clearCartSuccessMessage) clearCartSuccessMessage();
  }, [isAuthenticated, navigate, clearCartError, clearCartSuccessMessage]);

  const handleRemoveItem = async (productId) => {
    if (clearCartError) clearCartError();
    if (clearCartSuccessMessage) clearCartSuccessMessage();
    await removeItemFromCart(productId);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (clearCartError) clearCartError();
    if (clearCartSuccessMessage) clearCartSuccessMessage();
    const quantity = parseInt(newQuantity, 10);
    if (quantity >= 1 && quantity <= 100) {
      await updateItemInCart(productId, quantity);
    } else if (quantity < 1) {
      await removeItemFromCart(productId);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImageFromAssets;
  };

  if (!isAuthenticated) {
    return (
      <Container className="text-center mt-5">
        <div className="loading-container">
          <div className="loading-spinner">
            <Spinner animation="border" variant="primary" />
          </div>
          <p className="loading-text">Redirecting to login...</p>
        </div>
      </Container>
    );
  }

  if (cartLoading && !cart) {
    return (
      <Container className="text-center mt-5">
        <div className="loading-container">
          <div className="loading-spinner">
            <Spinner animation="border" variant="primary" />
          </div>
          <p className="loading-text">Loading your cart...</p>
        </div>
      </Container>
    );
  }

  if (cartError && !cartLoading) {
    return (
        <Container className="mt-5">
            <Alert variant="danger" onClose={clearCartError} dismissible className="enhanced-alert">
                <div className="alert-content">
                  <i className="fas fa-exclamation-triangle alert-icon"></i>
                  {cartError}
                </div>
            </Alert>
            <div className="text-center">
              <Button as={Link} to="/shop" className="enhanced-btn enhanced-btn-primary">
                <i className="fas fa-shopping-bag me-2"></i>
                Go Shopping
              </Button>
            </div>
        </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="text-center mt-5">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h4 className="empty-cart-title">Your Cart is Empty</h4>
          <p className="empty-cart-subtitle">Looks like you haven't added anything to your cart yet.</p>
          <Button as={Link} to="/shop" className="enhanced-btn enhanced-btn-primary enhanced-btn-lg">
            <i className="fas fa-shopping-bag me-2"></i>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-4 cart-container">
      <div className="cart-header">
        <h2 className="cart-title">
          <i className="fas fa-shopping-cart me-3"></i>
          Shopping Cart
        </h2>
        <div className="cart-subtitle">
          {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
        </div>
      </div>

      <section>
        {cartSuccessMessage && !cartLoading && (
            <Alert variant="success" onClose={clearCartSuccessMessage} dismissible className="enhanced-alert success-alert">
                <div className="alert-content">
                  <i className="fas fa-check-circle alert-icon"></i>
                  {cartSuccessMessage}
                </div>
            </Alert>
        )}
        {cartError && !cartLoading && cart && cart.items && cart.items.length > 0 && (
             <Alert variant="danger" onClose={clearCartError} dismissible className="enhanced-alert">
                <div className="alert-content">
                  <i className="fas fa-exclamation-triangle alert-icon"></i>
                  {cartError}
                </div>
            </Alert>
        )}

        <Row>
          <Col lg={8}>
            <Card className="cart-items-card enhanced-card">
              <Card.Body className="p-4">
                {cart.items.map((item, index) => (
                  <div key={item.productId} className={`cart-item ${index !== cart.items.length - 1 ? 'cart-item-border' : ''}`}>
                    <Row className="align-items-center">
                      <Col xs={4} sm={3} md={3} lg={2} xl={2}>
                        <div className="product-image-container">
                          <BootstrapImage
                            src={item.imageUrl || placeholderImageFromAssets}
                            alt={item.productName}
                            onError={handleImageError}
                            fluid
                            rounded
                            className="product-image"
                          />
                        </div>
                      </Col>
                      <Col xs={8} sm={9} md={9} lg={10} xl={10}>
                        <div className="product-details">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="product-info">
                              <h5 className="product-name">{item.productName}</h5>
                              <p className="unit-price">
                                Unit Price: <span className="price-value">{currencySymbol}{item.unitPrice?.toFixed(2)}</span>
                              </p>
                            </div>
                            <div className="quantity-controls">
                              <Form.Control
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                                min="1"
                                max="99"
                                size="sm"
                                className="quantity-input"
                                disabled={cartLoading}
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <Button
                              variant="link"
                              className="remove-btn"
                              onClick={() => handleRemoveItem(item.productId)}
                              disabled={cartLoading}
                            >
                              <i className="fas fa-trash-alt me-1"></i> Remove
                            </Button>
                            <div className="item-total">
                              <strong>{currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
                <div className="cart-notice">
                  <i className="fas fa-info-circle me-2"></i>
                  Adding items to your cart does not mean booking them.
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div className="sidebar-sticky">
              <Card className="order-summary-card enhanced-card">
                <Card.Body className="p-4">
                  <h5 className="summary-title">
                    <i className="fas fa-receipt me-2"></i>
                    Order Summary
                  </h5>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span className="summary-value">{currencySymbol}{cartTotal?.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="summary-value free-shipping">Free</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total-row">
                      <div>
                        <strong>Total Amount</strong>
                        <div className="vat-note">(including VAT)</div>
                      </div>
                      <span className="total-value">
                        <strong>{currencySymbol}{cartTotal?.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                  <Button 
                    as={Link} 
                    to="/checkout" 
                    className="checkout-btn enhanced-btn enhanced-btn-primary enhanced-btn-block"
                    disabled={cartLoading || cartCount === 0}
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>

              <Card className="discount-card enhanced-card">
                <Card.Body className="p-4">
                   <h6 className="discount-title">
                     <i className="fas fa-tag me-2"></i>
                     Discount Code
                   </h6>
                   <Form.Group className="discount-form">
                      <Form.Control 
                        type="text" 
                        placeholder="Enter discount code" 
                        className="discount-input"
                      />
                      <Button variant="outline-primary" className="apply-btn">
                        Apply
                      </Button>
                   </Form.Group>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default CartPage;