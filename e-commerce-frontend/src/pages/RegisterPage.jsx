// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { register as registerApi } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    document.body.classList.add("auth-page-body");
    return () => {
      document.body.classList.remove("auth-page-body");
    };
  }, [isAuthenticated, navigate]);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Add other frontend validations to match backend policy if desired
    // For example, to provide immediate feedback:
    // if (password.length < 6 || !/\d/.test(password)) {
    //   setError("Password must be at least 6 characters and include a digit.");
    //   return;
    // }

    setLoading(true);
    const userData = { firstName, lastName, email, password };
    console.log("RegisterPage: Submitting registration data:", userData);

    try {
      const response = await registerApi(userData);
      console.log("RegisterPage: Registration API response:", response);
      setSuccessMessage(response.message || "Registration successful! Redirecting to login...");
      setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = "Registration failed. Please try again."; // Default

      if (errorData) {
        // ASP.NET Core Identity validation errors are often in errorData.errors
        // which is an array of objects like { code: "...", description: "..." }
        // Or sometimes it's a flatter structure like ProblemDetails with errorData.title
        // and errorData.errors being an object where keys are field names.
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMsg = errorData.errors.map(errDetail =>
                typeof errDetail === 'string' ? errDetail : errDetail.description || errDetail.errorMessage || "A validation error occurred."
            ).join(". ");
        } else if (errorData.title && errorData.status === 400 && errorData.errors) { // ASP.NET Core ProblemDetails for validation
            let validationErrors = [];
            for(const field in errorData.errors){
                if(Array.isArray(errorData.errors[field])){
                    validationErrors.push(...errorData.errors[field]);
                }
            }
            errorMsg = validationErrors.length > 0 ? validationErrors.join(". ") : errorData.title;
        }
         else if (errorData.message) { // Custom message from backend
            errorMsg = errorData.message;
        } else if (errorData.Message) { // Another common casing for message
             errorMsg = errorData.Message;
        } else if (typeof errorData === 'string' && errorData.length < 200) { // Plain string error
            errorMsg = errorData;
        }
      } else if (err.message) { // Network error or client-side issue
        errorMsg = `Registration request failed: ${err.message}. Please check your network.`;
      }
      setError(errorMsg);
      console.error("RegisterPage: Registration handleSubmit caught error:", errorMsg, "Full error object:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-gradient-container">
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={8} lg={6}>
            <div className="form-container p-4 rounded">
              <h3 className="text-center mb-3">Sign Up Now</h3>
              <p className="text-center">Please fill out this form to register</p>
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="firstName" value={firstName} onChange={handleChange} placeholder="Your Firstname" required disabled={loading}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastName" value={lastName} onChange={handleChange} placeholder="Your Lastname" required disabled={loading}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required disabled={loading}/>
                  <Form.Text muted>We'll never share your email with anyone else.</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={password} onChange={handleChange} placeholder="Password (min. 6 chars, 1 digit)" required disabled={loading}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} placeholder="Confirm Password" required disabled={loading}/>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? <><Spinner as="span" animation="border" size="sm" className="mr-1"/> Registering...</> : "Register"}
                </Button>
                <div className="text-center">
                  <span>Already have an account? </span>
                  <Link to="/login" className="linkControl">Login here</Link>
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