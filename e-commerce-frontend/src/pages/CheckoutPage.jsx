import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderFromCart } from '../services/orderService';

const CheckoutPage = () => {
  const {
    cart,
    cartTotal,
    loading: cartContextInitialLoading,
    operationLoading: cartContextOperationLoading,
    clearCart: clearCartInContext,
    error: cartContextError,
    clearCartError,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pageReady, setPageReady] = useState(false);
  
  // Payment popup states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('processing'); // 'processing', 'success'

  const currencySymbol = 'rwf';

  // Pre-fill form with user details from AuthContext
  useEffect(() => {
    if (user) {
      setBillingDetails(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Handle authentication and cart status
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!cartContextInitialLoading) {
      if (!cart || !cart.items || cart.items.length === 0) {
        navigate('/cart');
      } else {
        setPageReady(true);
      }
    }
    if (clearCartError) clearCartError();

  }, [isAuthenticated, cart, cartContextInitialLoading, navigate, clearCartError]);

  const handleBillingChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    if (clearCartError) clearCartError();

    // Show payment modal immediately
    setPaymentStep('processing');
    setShowPaymentModal(true);

    if (!billingDetails.firstName.trim() || !billingDetails.lastName.trim() ||
        !billingDetails.addressLine1.trim() || !billingDetails.city.trim() ||
        !billingDetails.phone.trim() || !billingDetails.email.trim()) {
      setSubmitError('Please fill in all required billing fields: First Name, Last Name, Address Line 1, City, Phone, and Email.');
      setIsSubmitting(false);
      setShowPaymentModal(false);
      return;
    }

    const shippingAddressString = `${billingDetails.firstName} ${billingDetails.lastName}, ${billingDetails.addressLine1}${billingDetails.addressLine2 ? ', ' + billingDetails.addressLine2 : ''}, ${billingDetails.city}, ${billingDetails.postcode || 'N/A'}, Rwanda. Phone: ${billingDetails.phone}. Email: ${billingDetails.email}. Notes: ${billingDetails.additionalInfo || 'None'}`;
    const orderDataPayload = { shippingAddress: shippingAddressString };

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const createdOrder = await createOrderFromCart(orderDataPayload);

      if (createdOrder && createdOrder.id) {
        // Show success step
        setPaymentStep('success');
        
        // Wait for success animation, then proceed
        setTimeout(async () => {
          await clearCartInContext();
          setShowPaymentModal(false);
          navigate('/order-receipt', { state: { order: createdOrder, total: cartTotal } });
        }, 2000);
      } else {
        throw new Error("Order placed, but confirmation data was not received correctly from the server.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
      setSubmitError(errMsg);
      setShowPaymentModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment Modal Component
  const PaymentModal = () => (
    <Modal 
      show={showPaymentModal} 
      onHide={() => {}} 
      centered 
      backdrop="static" 
      keyboard={false}
      size="sm"
    >
      <Modal.Body className="text-center p-4">
        {paymentStep === 'processing' && (
          <div>
            <div className="mb-4">
              <div style={{
                width: '80px',
                height: '50px',
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                borderRadius: '8px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                VISA
              </div>
            </div>
            <div className="mb-3">
              <Spinner animation="border" variant="primary" style={{ width: '2rem', height: '2rem' }} />
            </div>
            <h5 className="mb-2">Processing Payment</h5>
            <p className="text-muted mb-0">Please wait while we process your payment...</p>
            <p className="text-muted small mt-2">Amount: {currencySymbol}{cartTotal?.toFixed(2)}</p>
          </div>
        )}
        
        {paymentStep === 'success' && (
          <div>
            <div className="mb-4">
              <div style={{
                width: '80px',
                height: '50px',
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                borderRadius: '8px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                VISA
              </div>
            </div>
            <div className="mb-3">
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#28a745',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                animation: 'pulse 1s ease-in-out'
              }}>
                <i className="fas fa-check" style={{ color: 'white', fontSize: '24px' }}></i>
              </div>
            </div>
            <h5 className="mb-2 text-success">Payment Successful!</h5>
            <p className="text-muted mb-0">Your payment has been processed successfully.</p>
            <p className="text-muted small mt-2">Amount: {currencySymbol}{cartTotal?.toFixed(2)}</p>
            <p className="text-muted small">Redirecting to order confirmation...</p>
          </div>
        )}
      </Modal.Body>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Modal>
  );

  // --- Conditional Rendering for Page States ---
  if (!isAuthenticated) {
    return <Container className="text-center mt-5"><p>Redirecting to login...</p><Spinner animation="border" /></Container>;
  }

  if (!pageReady || (cartContextInitialLoading && (!cart || !cart.items))) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Preparing your checkout...</p>
      </Container>
    );
  }

  if (cartContextError && (!cart || !cart.items || cart.items.length === 0)) {
    return (
        <Container className="mt-5">
            <Alert variant="danger" onClose={clearCartError ? () => clearCartError() : undefined} dismissible>
                Error loading cart details: {cartContextError}
            </Alert>
            <Button as={Link} to="/shop">Go Shopping</Button>
        </Container>
    );
  }

  if ((!cart || !cart.items || cart.items.length === 0) && !cartContextInitialLoading) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">Your cart is empty. Cannot proceed to checkout.</Alert>
        <Button as={Link} to="/shop">Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <section>
        <h2 className="mb-4 text-center">Checkout</h2>
        <Row>
          <Col lg={8} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Billing Details</h5>
                {submitError && <Alert variant="danger" onClose={() => setSubmitError('')} dismissible>{submitError}</Alert>}
                <Form onSubmit={handleSubmitOrder} id="checkoutForm">
                  <Row>
                    <Col md={6}><Form.Group className="mb-3" controlId="checkoutFirstName"><Form.Label>First Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="firstName" value={billingDetails.firstName} onChange={handleBillingChange} required disabled={isSubmitting}/></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="checkoutLastName"><Form.Label>Last Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="lastName" value={billingDetails.lastName} onChange={handleBillingChange} required disabled={isSubmitting}/></Form.Group></Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="checkoutCountry"><Form.Label>Country</Form.Label><Form.Control type="text" value="Rwanda" readOnly disabled /></Form.Group>
                  <Form.Group className="mb-3" controlId="checkoutAddress1"><Form.Label>Address (Line 1) <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="addressLine1" value={billingDetails.addressLine1} onChange={handleBillingChange} placeholder="House number and street name" required disabled={isSubmitting}/></Form.Group>
                  <Form.Group className="mb-3" controlId="checkoutAddress2"><Form.Label>Address (Line 2) <span className="text-muted">(Opt)</span></Form.Label><Form.Control type="text" name="addressLine2" value={billingDetails.addressLine2} onChange={handleBillingChange} placeholder="Apartment, suite, unit etc." disabled={isSubmitting}/></Form.Group>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3" controlId="checkoutPostcode"><Form.Label>Postcode <span className="text-muted">(Opt)</span></Form.Label><Form.Control type="text" name="postcode" value={billingDetails.postcode} onChange={handleBillingChange} maxLength={10} disabled={isSubmitting}/></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3" controlId="checkoutCity"><Form.Label>Town/City <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="city" value={billingDetails.city} onChange={handleBillingChange} required disabled={isSubmitting}/></Form.Group></Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="checkoutPhone"><Form.Label>Phone <span className="text-danger">*</span></Form.Label><Form.Control type="tel" name="phone" value={billingDetails.phone} onChange={handleBillingChange} required disabled={isSubmitting}/></Form.Group>
                  <Form.Group className="mb-3" controlId="checkoutEmail"><Form.Label>Email <span className="text-danger">*</span></Form.Label><Form.Control type="email" name="email" value={billingDetails.email} onChange={handleBillingChange} required disabled={isSubmitting}/></Form.Group>
                  <Form.Group className="mb-3" controlId="checkoutAdditionalInfo"><Form.Label>Additional Info <span className="text-muted">(Opt)</span></Form.Label><Form.Control as="textarea" name="additionalInfo" rows={3} value={billingDetails.additionalInfo} onChange={handleBillingChange} disabled={isSubmitting}/></Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Order Summary</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">Subtotal<span>{currencySymbol}{cartTotal?.toFixed(2)}</span></ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">Shipping<span>Gratis</span></ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div><strong>Total Amount</strong><p className="mb-0 small">(inc. VAT)</p></div>
                    <span><strong>{currencySymbol}{cartTotal?.toFixed(2)}</strong></span>
                  </ListGroup.Item>
                </ListGroup>
                <Button variant="primary" type="submit" form="checkoutForm" className="btn-block"
                  disabled={isSubmitting || cartContextOperationLoading || !pageReady || !cart || !cart.items || cart.items.length === 0}>
                  {isSubmitting ? <Spinner as="span" animation="border" size="sm" className="mr-2" /> : <i className="fas fa-credit-card mr-2"></i>}
                  Place Order & Pay
                </Button>
              </Card.Body>
            </Card>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                 <Form.Label htmlFor="discount-code-input">Add a discount code (optional)</Form.Label>
                 <Form.Group controlId="discount-code-input" className="d-flex">
                    <Form.Control type="text" placeholder="Enter discount code" className="font-weight-light mr-2" disabled={isSubmitting}/>
                    <Button variant="outline-secondary" size="sm" disabled={isSubmitting}>Apply</Button>
                 </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      
      {/* Payment Modal */}
      <PaymentModal />
    </Container>
  );
};

export default CheckoutPage;