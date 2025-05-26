import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { forgotPassword } from '../services/authService'; // Assuming this exists
import { useAuth } from '../context/AuthContext'; // To prevent access if logged in

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); // For potential redirection if needed

   useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect home if already logged in
    }
     // Optional: Add a page-specific body class for styling
     // document.body.classList.add('auth-form-page-body');
     // return () => document.body.classList.remove('auth-form-page-body');
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await forgotPassword(email); // API call
      setMessage(response.message || 'If an account with that email exists, a password reset link has been sent.');
      setEmail(''); // Clear email field on success
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
      setError(errorMsg);
      console.error("Forgot Password Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="form-page-container">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Forgot Password</h2>
          <p className="text-center text-muted mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="forgotPasswordEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="mr-1"/>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/login">Back to Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;