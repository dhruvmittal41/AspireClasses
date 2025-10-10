// src/TestScheduleView.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  Badge,
  Row,
  Col,
  Stack,
} from "react-bootstrap";
import { ClockIcon, CalendarIcon, BookIcon } from "./Icons"; // Make sure you have a SyllabusIcon or similar

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
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" } },
};

// --- Main Component ---
const TestScheduleView = ({ onNavigateToProfile }) => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // State for the profile check modal
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchUpcomingTests = async () => {
      try {
        // Using the original API endpoint as requested
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

  // --- Handlers ---
  const handleViewDetails = (test) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedTest(null);
  };

  const handleJoinTest = () => {
    setShowDetailsModal(false);
    setShowProfileModal(true);
  };

  const handleGoToProfile = () => {
    setShowProfileModal(false);
    onNavigateToProfile();
  };

  // --- Render States ---
  if (isLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading Schedule...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // --- Main Render ---
  return (
    <>
      <Container
        as={motion.div}
        fluid
        key="test-series-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-md-4"
      >
        <h1 className="display-5 fw-bold mb-4 text-white">Upcoming Tests</h1>

        <AnimatePresence>
          {upcomingTests.length > 0 ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {upcomingTests.map((test) => (
                <Col key={test.id} as={motion.div} variants={itemVariants}>
                  <Card
                    className="h-100 shadow-lg border-0 rounded-4 overflow-hidden bg-dark text-light"
                    role="button"
                    onClick={() => handleViewDetails(test)}
                  >
                    <Card.Body className="d-flex flex-column p-4 justify-content-between">
                      <Card.Title className="fw-bold h5">
                        {test.test_name}
                      </Card.Title>
                      <Button
                        variant="outline-primary"
                        className="mt-3 align-self-start"
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-5"
            >
              <Alert variant="info" className="p-4 fs-5">
                No upcoming tests have been scheduled. Check back soon!
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedTest && (
          <Modal
            show={showDetailsModal}
            onHide={handleCloseDetails}
            centered
            size="lg"
          >
            <Modal.Header
              closeButton
              className="bg-primary text-white border-0"
            >
              <Modal.Title className="fw-bold">
                {selectedTest.test_name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Stack gap={4}>
                {/* Key Details Section */}
                <div className="d-flex flex-wrap justify-content-around text-center border rounded p-3">
                  <div className="p-2">
                    <CalendarIcon />
                    <h6 className="mb-0 mt-2">Date</h6>
                    <p className="text-muted mb-0">
                      {new Date(selectedTest.date_scheduled).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="p-2">
                    <ClockIcon />
                    <h6 className="mb-0 mt-2">Duration</h6>
                    <p className="text-muted mb-0">
                      {selectedTest.duration_minutes} mins
                    </p>
                  </div>
                </div>

                {/* Syllabus Section */}
                <div>
                  <h5 className="fw-semibold d-flex align-items-center mb-3">
                    <BookIcon /> <span className="ms-2">Syllabus</span>
                  </h5>
                  {selectedTest.subject_topic ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedTest.subject_topic
                        .split(/[,.-]/)
                        .map((topic, idx) => (
                          <Badge
                            key={idx}
                            pill
                            bg="light"
                            text="dark"
                            className="px-3 py-2 fs-6 fw-normal"
                          >
                            {topic.trim()}
                          </Badge>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted small">
                      No syllabus information available.
                    </p>
                  )}
                </div>
              </Stack>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={handleCloseDetails}>
                Close
              </Button>
              <Button variant="success" size="lg" onClick={handleJoinTest}>
                Join Test
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </AnimatePresence>

      {/* Profile Completion Modal (Unchanged) */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            To ensure the best experience and proper test assignment, please
            complete your profile before joining the test.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProfileModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGoToProfile}>
            Go to Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestScheduleView;
