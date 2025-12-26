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
import { GoogleLogin } from "@react-oauth/google";
import "./Register_Page.css";
import SignUpIllustration from "./undraw_signup.svg";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateDetailsForm()) return;

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/send-otp`, { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setFieldErrors({ otp: "OTP must be 6 digits." });
      return;
    }

    setLoading(true);
    try {
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
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(`${baseUrl}/api/google`, { token });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Google signup failed.");
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

                  {error && <Alert variant="danger">{error}</Alert>}

                  <div className="d-flex justify-content-center mb-3">
                    <GoogleLogin
                      onSuccess={handleGoogleSignup}
                      onError={() => setError("Google login failed")}
                    />
                  </div>

                  <div className="text-center text-muted mb-3">OR</div>

                  {step === 1 ? (
                    <Form onSubmit={handleSendOtp}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          name="fullName"
                          value={fullName}
                          onChange={handleChange}
                          isInvalid={!!fieldErrors.fullName}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          value={email}
                          onChange={handleChange}
                          isInvalid={!!fieldErrors.email}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>School</Form.Label>
                        <Form.Control
                          name="school"
                          value={school}
                          onChange={handleChange}
                          isInvalid={!!fieldErrors.school}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-100"
                      >
                        {loading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </Form>
                  ) : (
                    <Form onSubmit={handleRegister}>
                      <Form.Group className="mb-3">
                        <Form.Label>OTP</Form.Label>
                        <Form.Control
                          name="otp"
                          value={otp}
                          onChange={handleChange}
                          maxLength={6}
                          isInvalid={!!fieldErrors.otp}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-100"
                      >
                        {loading ? "Verifying..." : "Verify & Register"}
                      </Button>

                      <Button variant="link" onClick={() => setStep(1)}>
                        Change Email
                      </Button>
                    </Form>
                  )}

                  <p className="text-center mt-3">
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5} className="d-none d-md-flex justify-content-center">
              <img
                src={SignUpIllustration}
                className="illustration-img"
                alt=""
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={showSuccessModal} centered backdrop="static">
        <Modal.Body className="text-center">
          <h4 className="text-success">🎉 Registration Successful</h4>
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Register;
