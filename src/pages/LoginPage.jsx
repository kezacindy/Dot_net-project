import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import { login } from "../services/authService"; // Import login API call

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: loginUser, isAuthenticated } = useAuth(); // Get login function and auth state from context
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home or dashboard
    }
    // Apply specific body class for styles
    document.body.classList.add("login-page-body");
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove("login-page-body");
    };
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default HTML form submission
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const credentials = { email, password };
      const authData = await login(credentials); // Call the API service

      if (authData && authData.token) {
        loginUser(authData); // Update AuthContext state
        navigate("/"); // Redirect to home page on successful login
      } else {
        // This case might not happen if service throws error
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      // Handle errors thrown by the authService
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.response?.data?.Errors?.[0] ||
        "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Handle Google Sign-In Click (Placeholder - Requires Backend Setup)
  const handleGoogleSignIn = () => {
    // Option 1: Redirect to backend endpoint that initiates Google OAuth
    // window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google-login`; // Example

    // Option 2: Use a library like react-google-login (more complex setup)
    console.log("Google Sign-In clicked - requires backend integration");
    setError("Google Sign-In not implemented yet.");
  };

  return (
    // Container takes care of margin-top from App.js 'main'
    // Apply styles via className added to body
    <Container>
      <Row className="justify-content-md-center">
        {" "}
        {/* Center the column */}
        <Col xs={12} md={8} lg={6}>
          {" "}
          {/* Adjust column width */}
          <div className="login-form-container p-4 rounded">
            {" "}
            {/* Optional wrapper */}
            <h2 className="text-center mb-4">Login</h2>
            <p className="text-center">Please fill out this form to login</p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Button
                variant="primary" // Uses the Bootstrap variant, styled by our CSS override
                type="submit"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center mb-3">
                <span>Don't have an account? </span>
                <Link to="/register" className="linkControl">
                  Register here
                </Link>
              </div>
              <div className="text-center">
                <Link to="/forgot-password" className="linkControl">
                  Forgot your password?
                </Link>
              </div>
            </Form>
            <hr className="my-4" /> {/* Separator */}
            <div className="text-center mb-3">
              <h3>OR</h3>
            </div>
            <Button
              variant="danger" // Use Bootstrap's danger for Google red
              className="w-100 btn-google" // Apply specific class if needed
              onClick={handleGoogleSignIn}
              disabled={loading} // Disable while logging in normally too
            >
              <i className="fab fa-google mr-2"></i> Sign-In with Google
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
