// src/components/AdminLogin.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../../auth/AuthProvider";
import api from "../../api/axios";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAccessToken, setUser, setAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setAuthLoading(true);

    try {
      const res = await api.post("/api/admin/login", { username, password });

      const token = res.data.token; // 👈 backend sends { token }

      setAccessToken(token);
      setUser({ username, role: "admin" });

      navigate("/admin/assign-test");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  return (
    <div className="admin-login-background">
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          className="login-card shadow-sm border-0"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Admin Login</h2>

            {error && (
              <Alert variant="danger" className="text-center small py-2">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" />
                      <span className="ms-2">Logging In...</span>
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

export default AdminLogin;
