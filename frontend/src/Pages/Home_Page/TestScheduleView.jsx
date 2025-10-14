// src/components/TestScheduleView.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Stack,
  Badge,
} from "react-bootstrap";
import { ClockIcon, CalendarIcon } from "./Icons";

const baseUrl = import.meta.env.VITE_BASE_URL;

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200 } },
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TestScheduleView = () => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingTests = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/upcoming-tests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUpcomingTests(response.data);
      } catch (err) {
        setError("Failed to fetch test schedule. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingTests();
  }, []);

  // --- Handlers navigate to the details page ---
  const handleViewDetails = (testId) => {
    navigate(`/details/test/${testId}`);
  };

  const handleViewBundle = () => {
    navigate(`/details/bundle/amu-9th-entrance-series`);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" style={{ color: "#4A3F28" }} />
        <p className="mt-3 text-muted">Loading Your Schedule...</p>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container
      as={motion.div}
      fluid
      key="test-schedule-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-md-4 py-5"
    >
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">Test Dashboard</h1>
        <p className="lead text-muted">
          Explore your scheduled tests and special offers below.
        </p>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
        {/* --- Featured Bundle Card --- */}
        <Col
          as={motion.div}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            className="h-100 shadow-lg border-0 rounded-4 overflow-hidden text-center"
            style={{
              background: "linear-gradient(135deg, #cbb47a 0%, #bfa362 100%)",
              color: "#4A3F28",
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div>
                <Badge
                  pill
                  bg="light"
                  text="dark"
                  className="mb-3"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    fontWeight: "600",
                  }}
                >
                  Special Offer
                </Badge>
                <Card.Title className="fw-bold h4 mb-3">
                  AMU 9th Entrance Test Series
                </Card.Title>
                <Card.Text className="fs-6">
                  10 Full-Length Mock Tests to boost your preparation.
                </Card.Text>
              </div>
              <div className="mt-3">
                <h3 className="fw-bolder mb-3">₹799</h3>
                <Button
                  variant="dark"
                  size="lg"
                  className="fw-bold px-4 py-2"
                  onClick={handleViewBundle}
                  style={{
                    backgroundColor: "#4A3F28",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  View Bundle
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Upcoming Tests --- */}
        <AnimatePresence>
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => (
              <Col
                key={test.id}
                as={motion.div}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="h-100 shadow-sm border-0 rounded-4 overflow-hidden"
                  role="button"
                  onClick={() => handleViewDetails(test.id)}
                  style={{
                    background: "#FBFAF5",
                    color: "#4A3F28",
                    cursor: "pointer",
                  }}
                >
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="fw-bold h5 mb-3">
                      {test.test_name}
                    </Card.Title>
                    <Stack gap={2} className="small mb-4 text-muted">
                      <div className="d-flex align-items-center">
                        <CalendarIcon />{" "}
                        <span className="ms-2">
                          {formatDate(test.date_scheduled)}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <ClockIcon />{" "}
                        <span className="ms-2">
                          {test.duration_minutes} minutes
                        </span>
                      </div>
                    </Stack>
                    <Button
                      variant="dark"
                      className="mt-auto fw-bold"
                      style={{
                        backgroundColor: "#4A3F28",
                        color: "#FFFFFF",
                        border: "none",
                      }}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-5"
              >
                <Alert variant="info" className="p-4 fs-5">
                  No upcoming tests have been scheduled. Check back soon!
                </Alert>
              </motion.div>
            </Col>
          )}
        </AnimatePresence>
      </Row>
    </Container>
  );
};

export default TestScheduleView;
