// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import axios from "axios";
import "./Login_Page.css"; // We'll link to our new, smaller CSS file

const baseUrl = import.meta.env.VITE_BASE_URL;

const LoginPage = () => {
  const [email, setEmailOrPhone] = useState("");
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
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="login-card-custom shadow-lg border-0">
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center fw-bold mb-2">Welcome Back!</h2>
            <p className="text-center text-muted mb-4">Sign in to continue.</p>

            <Form onSubmit={handleLogin} noValidate>
              <FloatingLabel
                controlId="emailOrPhone"
                label="Email or Phone"
                className="mb-4"
              >
                <Form.Control
                  type="text"
                  placeholder="name@example.com or 9876543210"
                  value={email}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
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
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
