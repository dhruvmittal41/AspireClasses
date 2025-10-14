// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  Alert,
} from "react-bootstrap";
import { motion } from "framer-motion";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [profileData, setProfileData] = useState({
    full_name: "",
    email_or_phone: "",
    school_name: "",
    dob: "",
    gender: "",
    mobile_number: "",
    city: "",
    state: "",
    country: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        if (userData.dob) {
          userData.dob = new Date(userData.dob).toISOString().split("T")[0];
        }

        setProfileData(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setNotification({
          show: true,
          type: "danger",
          message: "Could not load your profile. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileData.full_name) newErrors.full_name = "Full Name is required.";
    if (!profileData.dob) newErrors.dob = "Date of Birth is required.";
    if (!profileData.gender) newErrors.gender = "Gender is required.";
    if (
      !profileData.mobile_number ||
      !/^\d{10,15}$/.test(profileData.mobile_number)
    )
      newErrors.mobile_number = "A valid mobile number is required.";
    if (!profileData.city) newErrors.city = "City is required.";
    if (!profileData.state) newErrors.state = "State is required.";
    if (!profileData.country) newErrors.country = "Country is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseUrl}/api/user/details`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotification({
        show: true,
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to save details. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={9}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-sm">
              <Card.Header as="h4" className="p-3">
                My Profile
              </Card.Header>
              <Card.Body className="p-4">
                {notification.show && (
                  <Alert
                    variant={notification.type}
                    onClose={() => setNotification({ show: false })}
                    dismissible
                  >
                    {notification.message}
                  </Alert>
                )}
                <Row>
                  <Col
                    md={4}
                    className="d-flex flex-column align-items-center text-center mb-4 mb-md-0"
                  >
                    <Image
                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${profileData.full_name}`}
                      roundedCircle
                      style={{ width: "150px", height: "150px" }}
                      className="mb-3 border p-1"
                    />
                    <h5 className="mb-1">{profileData.full_name}</h5>
                    <p className="text-muted">{profileData.email_or_phone}</p>
                  </Col>

                  <Col md={8}>
                    <h5>Personal Information</h5>
                    <hr />
                    <Form noValidate onSubmit={handleProfileSubmit}>
                      <Row className="g-3">
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="full_name"
                              value={profileData.full_name}
                              onChange={handleChange}
                              isInvalid={!!errors.full_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.full_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email_or_phone"
                              value={profileData.email_or_phone}
                              readOnly
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>School Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="school_name"
                              value={profileData.school_name}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="mobile_number"
                              value={profileData.mobile_number}
                              onChange={handleChange}
                              isInvalid={!!errors.mobile_number}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mobile_number}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                              type="date"
                              name="dob"
                              value={profileData.dob}
                              onChange={handleChange}
                              isInvalid={!!errors.dob}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.dob}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              name="gender"
                              value={profileData.gender}
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
                        <Col sm={4}>
                          <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={profileData.city}
                              onChange={handleChange}
                              isInvalid={!!errors.city}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.city}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              value={profileData.state}
                              onChange={handleChange}
                              isInvalid={!!errors.state}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.state}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group>
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                              type="text"
                              name="country"
                              value={profileData.country}
                              onChange={handleChange}
                              isInvalid={!!errors.country}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.country}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        type="submit"
                        className="mt-4 float-end"
                      >
                        Save Changes
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
