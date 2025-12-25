// src/components/UserDetailForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import "./User_Detail.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const UserDetailForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email_or_phone: "",
    school_name: "",
    dob: "",
    gender: "",
    mobileNumber: "",
    city: "",
    state: "",
    country: "",
    selectedTestSeriesId: "",
  });
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");

  // --- Data fetching and form logic remains the same ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [userResponse, testSeriesResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/test-series`), // Assuming this endpoint exists
        ]);

        if (userResponse.data) {
          setFormData((prev) => ({ ...prev, ...userResponse.data }));
        }
        if (Array.isArray(testSeriesResponse.data)) {
          setTestSeriesList(testSeriesResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setFormError("Could not load your data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    // ... validation logic is unchanged
    const newErrors = {};
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.mobileNumber || !/^\d{10,15}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Valid mobile number is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.selectedTestSeriesId)
      newErrors.selectedTestSeriesId = "Please select a test series.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("/api/user-details", formData);
      navigate(`/payment/${formData.selectedTestSeriesId}`);
    } catch (error) {
      setFormError("Failed to save details. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center form-page-background">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="form-page-background py-5">
      <Container
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card
          as={motion.div}
          className="user-detail-card-custom"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
        >
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <h2>Complete Your Profile</h2>
              <p className="text-muted">
                Review your details and add required information to proceed.
              </p>
            </div>

            <Form noValidate onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* Pre-filled Details */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.full_name}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email / Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.email_or_phone}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>School Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.school_name}
                      readOnly
                    />
                  </Form.Group>
                </Col>

                {/* Additional Required Fields */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      isInvalid={!!errors.dob}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dob}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      isInvalid={!!errors.gender}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.gender}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="e.g., 9876543210"
                      isInvalid={!!errors.mobileNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobileNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., Aligarh"
                      isInvalid={!!errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g., Uttar Pradesh"
                      isInvalid={!!errors.state}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.state}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g., India"
                      isInvalid={!!errors.country}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.country}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Purchase Section */}
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Select Test Series</Form.Label>
                    <Form.Select
                      name="selectedTestSeriesId"
                      value={formData.selectedTestSeriesId}
                      onChange={handleChange}
                      isInvalid={!!errors.selectedTestSeriesId}
                    >
                      <option value="">Choose a test series to purchase</option>
                      {testSeriesList.map((series) => (
                        <option key={series.id} value={series.id}>
                          {series.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.selectedTestSeriesId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {formError && (
                <Alert variant="danger" className="mt-4 text-center">
                  {formError}
                </Alert>
              )}

              <div className="d-grid mt-4">
                <Button type="submit" variant="primary" size="lg">
                  Proceed to Payment
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserDetailForm;
