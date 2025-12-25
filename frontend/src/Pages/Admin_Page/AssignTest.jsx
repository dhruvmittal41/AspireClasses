// src/components/AssignTest.jsx

import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import api from "../../api/axios";

const AssignTest = () => {
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [usersResponse, testsResponse] = await Promise.all([
          api.get(`/api/user/all`),
          api.get(`/api/tests`),
        ]);

        setUsers(usersResponse.data || []);
        setTests(testsResponse.data || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedTest) {
      setError("Please select a user and a test.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("admin_token");
      const response = await api.post(`/api/user/assigntest`, {
        userId: selectedUser,
        testId: selectedTest,
        isPaid: isPaid,
      });
      setSuccessMessage(response.data.message || "Test assigned successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "An error occurred while assigning the test.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading Admin Dashboard...</span>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Assign Test to User</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="user-select">
                  <Form.Label>Select User</Form.Label>
                  <Form.Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose a user...
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.email_or_phone})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="test-select">
                  <Form.Label>Select Test</Form.Label>
                  <Form.Select
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose a test...
                    </option>
                    {tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.test_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Payment Status</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      id="paid-radio"
                      label="Paid"
                      name="isPaid"
                      checked={isPaid === true}
                      onChange={() => setIsPaid(true)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="not-paid-radio"
                      label="Not Paid"
                      name="isPaid"
                      checked={isPaid === false}
                      onChange={() => setIsPaid(false)}
                    />
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Assigning...</span>
                      </>
                    ) : (
                      "Assign Test"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AssignTest;
