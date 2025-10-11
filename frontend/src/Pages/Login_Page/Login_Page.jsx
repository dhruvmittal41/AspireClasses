import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  FloatingLabel,
  Row, // <-- Import Row
  Col, // <-- Import Col
} from "react-bootstrap";
import axios from "axios";
import "./Login_Page.css";
import LoginIllustration from "./undraw_login.svg"; // <-- Import your SVG

const baseUrl = import.meta.env.VITE_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email or Phone Number is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/login`, { email });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/home");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-background">
      <Container className="py-5">
        <Row className="d-flex justify-content-center align-items-center">
          {/* Column 1: Login Form */}
          <Col xs={12} md={7} lg={6} xl={5}>
            <Card className="login-card-custom shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-center fw-bold mb-2">Welcome Back!</h2>
                <p className="text-center text-muted mb-4">
                  Sign in to continue.
                </p>

                <Form onSubmit={handleLogin} noValidate>
                  <FloatingLabel
                    controlId="email"
                    label="Email or Phone"
                    className="mb-4"
                  >
                    <Form.Control
                      type="text"
                      placeholder="name@example.com or 9876543210"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                      disabled={loading}
                    />
                  </FloatingLabel>

                  {error && (
                    <Alert variant="danger" className="text-center small py-2">
                      {error}
                    </Alert>
                  )}

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
                          <span className="ms-2">Logging in...</span>
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>
                <p className="text-center text-muted mt-4 small">
                  Don't have an account? <Link to="/register">Sign up</Link>
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
              src={LoginIllustration}
              className="illustration-img"
              alt="Login Illustration"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
