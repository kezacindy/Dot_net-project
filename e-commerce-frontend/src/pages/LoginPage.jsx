// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: loginUserContext, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
    document.body.classList.add("login-page-body");
    return () => {
      document.body.classList.remove("login-page-body");
    };
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("LoginPage: Attempting login with email:", email);

    try {
      const credentials = { email, password };
      const authData = await loginApi(credentials);
      console.log("LoginPage: Received authData from service:", authData);

      if (authData && authData.token) {
        loginUserContext(authData); // This updates AuthContext
        // Navigation is now handled by useEffect watching isAuthenticated
      } else {
        // This path should ideally not be hit if authService throws on non-2xx responses
        // or if authData.token is the primary check.
        setError("Login failed. Invalid response from server.");
        console.error("LoginPage: Login successful by API call, but authData or token is missing.", authData);
      }
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = "Login failed. Please check your credentials or try again later."; // Generic default

      if (errorData) {
        // Backend often returns { message: "details" } or { Message: "details" } for 401
        if (errorData.message) errorMsg = errorData.message;
        else if (errorData.Message) errorMsg = errorData.Message;
        // For 400 with ASP.NET Identity validation errors (less common on login)
        else if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMsg = errorData.errors.map(eDetail => typeof eDetail === 'string' ? eDetail : eDetail.description || "Validation error").join(". ");
        } else if (typeof errorData === 'string' && errorData.length < 200) { // Plain string error from backend
            errorMsg = errorData;
        } else if (err.response?.status === 401) {
            errorMsg = "Invalid email or password.";
        }
      } else if (err.message) { // Network error or other client-side issues
        errorMsg = `Login request failed: ${err.message}. Please check your network connection.`;
      }
      setError(errorMsg);
      console.error("LoginPage: Login handleSubmit caught error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => { /* ... placeholder ... */ };

  return (
    <Container> {/* Ensure className="login-page-body" is applied to body or a true root wrapper */}
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <div className="login-form-container p-4 rounded">
            <h2 className="text-center mb-4">Login</h2>
            <p className="text-center">Please fill out this form to login</p>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}/>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="mr-1"/> : 'Login'}
              </Button>
              <div className="text-center mb-3">
                <span>Don't have an account? </span><Link to="/register" className="linkControl">Register here</Link>
              </div>
              <div className="text-center">
                <Link to="/forgot-password" className="linkControl">Forgot your password?</Link>
              </div>
            </Form>
            <hr className="my-4" />
            <div className="text-center mb-3"><h3>OR</h3></div>
            <Button variant="danger" className="w-100 btn-google" onClick={handleGoogleSignIn} disabled={loading}>
              <i className="fab fa-google mr-2"></i> Sign-In with Google
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;