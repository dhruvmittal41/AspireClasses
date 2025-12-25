// src/components/CreateNewTest.jsx

import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

const baseUrl = import.meta.env.VITE_BASE_URL;

const CreateNewTest = () => {
  const [formData, setFormData] = useState({
    test_name: "",
    num_questions: "",
    duration_minutes: "",
    subject_topic: "",
    instructions: "",
    test_category: "standard",
    date_scheduled: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !formData.test_name ||
      !formData.num_questions ||
      !formData.duration_minutes
    ) {
      setError("Test Name, Number of Questions, and Duration are required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`/api/tests`, formData);

      setSuccessMessage(response.data.message || "Test created successfully!");
      setFormData({
        test_name: "",
        num_questions: "",
        duration_minutes: "",
        subject_topic: "",
        instructions: "",
        test_category: "standard",
        date_scheduled: "",
      });
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to create the test. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4">Create a New Test</h2>

              {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
              )}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="test_name">
                      <Form.Label>Test Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="test_name"
                        value={formData.test_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="test_category">
                      <Form.Label>Test Category</Form.Label>
                      <Form.Select
                        name="test_category"
                        value={formData.test_category}
                        onChange={handleChange}
                      >
                        <option value="standard">Standard</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="practice">Practice</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="num_questions">
                      <Form.Label>Number of Questions*</Form.Label>
                      <Form.Control
                        type="number"
                        name="num_questions"
                        value={formData.num_questions}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="duration_minutes">
                      <Form.Label>Duration (in minutes)*</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration_minutes"
                        value={formData.duration_minutes}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="subject_topic">
                      <Form.Label>Subject / Topics</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="subject_topic"
                        value={formData.subject_topic}
                        onChange={handleChange}
                        placeholder="e.g., Ch-1 Rational Numbers, Ch-2 Linear Equations..."
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="instructions">
                      <Form.Label>Instructions</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="e.g., All questions are compulsory."
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="date_scheduled">
                      <Form.Label>Scheduled Date (Optional)</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_scheduled"
                        value={formData.date_scheduled}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button
                    variant="success"
                    type="submit"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Creating Test...</span>
                      </>
                    ) : (
                      "Create Test"
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

export default CreateNewTest;
