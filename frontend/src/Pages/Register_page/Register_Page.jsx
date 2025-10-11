import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Modal,
  Row, // <-- Import Row
  Col, // <-- Import Col
} from "react-bootstrap";
import "./Register_Page.css";
import SignUpIllustration from "./undraw_signup.svg"; // <-- Import your SVG

const baseUrl = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { fullName, email, school } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!/^[A-Za-z\s]{3,}$/.test(fullName.trim())) {
      errors.fullName = "Full Name must be at least 3 letters.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (school.trim().length < 3) {
      errors.school = "School Name must be at least 3 characters.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newUser = { fullName, email, school };
      await axios.post(`${baseUrl}/api/register`, newUser);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/login");
      }, 2500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-page-background">
        <Container className="py-5">
          <Row className="d-flex justify-content-center align-items-center">
            {/* Column 1: Registration Form */}
            <Col xs={12} md={7} lg={6} xl={5}>
              <Card className="register-card-custom shadow-lg border-0">
                <Card.Body className="p-4 p-md-5">
                  <h1 className="text-center fw-bold mb-2">Create Account</h1>
                  <p className="text-center text-muted mb-4">
                    Join our community to get started.
                  </p>

                  <Form noValidate onSubmit={handleSubmit}>
                    {error && (
                      <Alert
                        variant="danger"
                        className="text-center small py-2"
                      >
                        {error}
                      </Alert>
                    )}

                    <Form.Group className="mb-3" controlId="fullName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={handleChange}
                        placeholder="e.g., Arjun Sharma"
                        isInvalid={!!fieldErrors.fullName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        isInvalid={!!fieldErrors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="school">
                      <Form.Label>School</Form.Label>
                      <Form.Control
                        type="text"
                        name="school"
                        value={school}
                        onChange={handleChange}
                        placeholder="e.g., Aligarh Muslim University"
                        isInvalid={!!fieldErrors.school}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.school}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span className="ms-2">Registering...</span>
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </Form>

                  <p className="text-center text-muted mt-4 small">
                    Already have an account? <Link to="/login">Login here</Link>
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Column 2: SVG Illustration */}
            <Col
              md={5}
              lg={6}
              xl={7}
              className="d-none d-md-flex align-items-center justify-content-center"
            >
              <img
                src={SignUpIllustration}
                className="illustration-img"
                alt="Sign Up Illustration"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center p-4">
          <h2 className="text-success mb-3">🎉 Registration Successful!</h2>
          <p className="text-muted">
            You will be redirected to the login page shortly.
          </p>
          <Spinner animation="border" variant="success" className="mt-2" />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Register;
