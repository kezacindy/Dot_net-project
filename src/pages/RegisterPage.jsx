import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { register } from "../services/authService"; // Import register API call
import { useAuth } from "../context/AuthContext"; // Check if user is already logged in

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // Added for validation
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Get auth state

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [isAuthenticated, navigate]);

  // Apply specific body class for styles
  // Note: This approach might have side effects if navigating quickly.
  // A better approach might be a wrapper component or applying class to the main div.
  useEffect(() => {
    document.body.classList.add("auth-page-body");
    return () => {
      document.body.classList.remove("auth-page-body");
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic Frontend Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const userData = { firstName, lastName, email, password };
      await register(userData); // Call the API service
      setSuccessMessage("Registration successful! Redirecting to login...");
      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2-second delay
    } catch (err) {
      const errorMsg =
        err.response?.data?.Errors?.[0] || // Backend validation errors
        err.response?.data?.message || // Other backend errors
        err.response?.data?.Message ||
        "Registration failed. Please try again."; // Default
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-gradient-container">
      {" "}
      {/* Wrapper for gradient */}
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={8} lg={6}>
            <div className="form-container">
              {" "}
              {/* Apply styling container */}
              <h3 className="text-center mb-3">Sign Up Now</h3>
              <p className="text-center">
                Please fill out this form to register
              </p>
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    placeholder="Your Firstname"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    placeholder="Your Lastname"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    disabled={loading}
                  />
                  <Form.Text muted>
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password (min. 6 characters)"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="registerConfirmPassword"
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  variant="primary" // Styled via CSS
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>

                <div className="text-center">
                  <span>Already have an account? </span>
                  <Link to="/login" className="linkControl">
                    Login here
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
