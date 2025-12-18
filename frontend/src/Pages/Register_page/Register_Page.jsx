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
  Row,
  Col,
} from "react-bootstrap";
import "./Register_Page.css";
import SignUpIllustration from "./undraw_signup.svg";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 for details, 2 for OTP
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
    otp: "", // Added OTP to the form data state
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const { fullName, email, school, otp } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const validateDetailsForm = () => {
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

  // Step 1: Send user details to get an OTP
  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError(null);
    if (!validateDetailsForm()) return;

    setLoading(true);
    try {
      // Call the new endpoint to send the OTP
      await axios.post(`${baseUrl}/api/send-otp`, { email });
      setStep(2); // Move to OTP entry step on success
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send all details plus OTP to register
  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    if (otp.trim().length !== 6) {
      setFieldErrors({ otp: "OTP must be 6 digits." });
      return;
    }

    setLoading(true);
    try {
      // Call the final register endpoint with all data
      await axios.post(`${baseUrl}/api/register`, {
        fullName,
        email,
        school,
        otp,
      });
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
            <Col xs={12} md={7} lg={6} xl={5}>
              <Card className="register-card-custom shadow-lg border-0">
                <Card.Body className="p-4 p-md-5">
                  <h1 className="text-center fw-bold mb-2">Create Account</h1>
                  <p className="text-center text-muted mb-4">
                    {step === 1
                      ? "Join our community to get started."
                      : `Enter the OTP sent to ${email}`}
                  </p>

                  {error && (
                    <Alert variant="danger" className="text-center small py-2">
                      {error}
                    </Alert>
                  )}

                  {/* Conditionally render the correct form based on the step */}
                  {step === 1 ? (
                    <Form noValidate onSubmit={handleSendOtp}>
                      {/* --- STEP 1: Details Form --- */}
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
                              <Spinner as="span" animation="border" size="sm" />{" "}
                              <span className="ms-2">Sending OTP...</span>
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <Form noValidate onSubmit={handleRegister}>
                      {/* --- STEP 2: OTP Form --- */}
                      <Form.Group className="mb-3" controlId="otp">
                        <Form.Label>One-Time Password (OTP)</Form.Label>
                        <Form.Control
                          type="text"
                          name="otp"
                          value={otp}
                          onChange={handleChange}
                          placeholder="Enter 6-digit OTP"
                          isInvalid={!!fieldErrors.otp}
                          required
                          maxLength={6}
                          autoFocus
                        />
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.otp}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-grid mt-4">
                        <Button
                          variant="success"
                          type="submit"
                          size="lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" />{" "}
                              <span className="ms-2">Verifying...</span>
                            </>
                          ) : (
                            "Verify & Register"
                          )}
                        </Button>
                      </div>
                      <div className="text-center mt-3">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setStep(1)}
                          disabled={loading}
                        >
                          Change Email
                        </Button>
                      </div>
                    </Form>
                  )}

                  <p className="text-center text-muted mt-4 small">
                    Already have an account? <Link to="/login">Login here</Link>
                  </p>
                </Card.Body>
              </Card>
            </Col>

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

      {/* Success Modal (no changes needed here) */}
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
