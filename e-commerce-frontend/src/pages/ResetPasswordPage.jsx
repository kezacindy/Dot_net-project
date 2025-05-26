import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { resetPassword } from '../services/authService'; // Assuming this exists
import { useAuth } from '../context/AuthContext';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect home if already logged in
    }
    if (!token || !email) {
      setError('Invalid password reset link. Please request a new one.');
      // Consider redirecting to forgot password page or showing a more prominent error
    }
    // Optional: Add a page-specific body class for styling
    // document.body.classList.add('auth-form-page-body');
    // return () => document.body.classList.remove('auth-form-page-body');
  }, [isAuthenticated, navigate, token, email]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token || !email) {
      setError('Missing token or email. Cannot reset password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6 || !/\d/.test(password)) { // Match backend policy
        setError('Password must be at least 6 characters and include a digit.');
        return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ token, email, newPassword: password });
      setMessage(response.message || 'Password has been successfully reset. You can now log in.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after success
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = "Failed to reset password. The link might be invalid or expired.";
       if (errorData) {
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMsg = errorData.errors.map(eDetail => typeof eDetail === 'string' ? eDetail : eDetail.description).join(". ");
        } else if (errorData.message) {
            errorMsg = errorData.message;
        } else if (errorData.Message) {
             errorMsg = errorData.Message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      console.error("Reset Password Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
        <Container className="form-page-container">
            <Alert variant="danger">{error || "Invalid password reset link. Please request a new one."}</Alert>
            <div className="text-center mt-3">
                <Link to="/forgot-password">Request New Link</Link>
            </div>
        </Container>
    );
  }


  return (
    <Container className="form-page-container">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="resetPasswordNew">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
               <Form.Text muted>Password must be at least 6 characters and include a digit.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="resetPasswordConfirm">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="mr-1"/>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;