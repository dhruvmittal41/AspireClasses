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
import { ClockIcon, CalendarIcon, BookIcon } from "./Icons";

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

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalContentVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { scale: 0.95, opacity: 0 },
};

// --- Helper to format date ---
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// --- Main Component ---
const TestScheduleView = ({ onNavigateToProfile }) => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const handleViewBundle = () => {
    // This could navigate to a bundle purchase page or show another modal
    alert("Navigating to the AMU 9th Entrance Test bundle page!");
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
        <p className="mt-3 text-muted">Loading Your Schedule...</p>
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
        key="test-schedule-view"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-md-4"
      >
        <h1 className="display-5 fw-bold mb-3">Test Dashboard</h1>
        <p className="lead text-muted mb-5">
          Find all your tests and special offers in one place.
        </p>

        {/* --- Featured Bundle Section --- */}
        <h2 className="fw-bold mb-4">Featured Bundles</h2>
        <Row className="mb-5">
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            as={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className="h-100 shadow border-0 rounded-4 overflow-hidden text-white"
              style={{ background: "linear-gradient(45deg, #007bff, #6610f2)" }}
            >
              <Card.Body className="d-flex flex-column p-4">
                <Badge
                  pill
                  bg="warning"
                  text="dark"
                  className="align-self-start mb-3"
                >
                  Special Offer
                </Badge>
                <Card.Title className="fw-bold h4">
                  AMU 9th Entrance Test Series
                </Card.Title>
                <Card.Text>
                  10 Full-Length Mock Tests to ace your exam.
                </Card.Text>
                <div className="mt-auto">
                  <h3 className="fw-bolder mb-3">₹799</h3>
                  <Button
                    variant="light"
                    className="fw-bold"
                    onClick={handleViewBundle}
                  >
                    View Bundle
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- Upcoming Tests Section --- */}
        <h2 className="fw-bold mb-4">Upcoming Tests</h2>
        <AnimatePresence>
          {upcomingTests.length > 0 ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {upcomingTests.map((test) => (
                <Col
                  key={test.id}
                  as={motion.div}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="h-100 shadow-sm border-light rounded-4 overflow-hidden"
                    role="button"
                    onClick={() => handleViewDetails(test)}
                  >
                    <Card.Body className="d-flex flex-column p-4">
                      <Card.Title className="fw-bold h5 mb-3">
                        {test.test_name}
                      </Card.Title>
                      <Stack gap={2} className="text-muted small mb-4">
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
                        variant="outline-primary"
                        className="mt-auto align-self-start"
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
          <motion.div
            key="modal-backdrop"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          >
            <Modal
              show={showDetailsModal}
              onHide={handleCloseDetails}
              centered
              size="lg"
              as={motion.div}
              key="modal-content"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ backgroundColor: "transparent", border: "none" }}
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
                  <div className="d-flex flex-wrap justify-content-around text-center border rounded p-3 bg-light">
                    <div className="p-2">
                      <CalendarIcon />
                      <h6 className="mb-0 mt-2">Date</h6>
                      <p className="text-muted mb-0">
                        {formatDate(selectedTest.date_scheduled)}
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
                        {selectedTest.subject_topic.split(/[,.-]/).map(
                          (topic, idx) =>
                            topic.trim() && (
                              <Badge
                                key={idx}
                                pill
                                bg="secondary"
                                text="white"
                                className="px-3 py-2 fs-6 fw-normal"
                              >
                                {topic.trim()}
                              </Badge>
                            )
                        )}
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
          </motion.div>
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
          <p>
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
