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
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200 } },
};

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalContentVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 250, damping: 25 },
  },
  exit: { scale: 0.9, opacity: 0 },
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TestScheduleView = ({ onNavigateToProfile }) => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);

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
    setShowBundleModal(true);
  };

  const handleCloseBundleModal = () => {
    setShowBundleModal(false);
  };

  const handleBuyBundle = () => {
    // Instead of redirecting, trigger the profile completion modal
    setShowBundleModal(false);
    setShowProfileModal(true);
  };

  const handleGoToProfile = () => {
    setShowProfileModal(false);
    onNavigateToProfile();
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
    <>
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
                    onClick={() => handleViewDetails(test)}
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

      {/* --- Details Modal --- */}
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
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(3px)",
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
            >
              <Modal.Header
                closeButton
                className="text-white border-0"
                style={{ background: "#4A3F28" }}
              >
                <Modal.Title className="fw-bold">
                  {selectedTest.test_name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-4 bg-light">
                <Stack gap={4}>
                  <div className="d-flex flex-wrap justify-content-around text-center border rounded p-3 bg-white shadow-sm">
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
                                text="dark"
                                className="px-3 py-2 fs-6 fw-normal"
                                style={{
                                  backgroundColor: "rgba(74, 63, 40, 0.1)",
                                }}
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
              <Modal.Footer className="border-0 bg-light">
                <Button variant="secondary" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button
                  size="lg"
                  onClick={handleJoinTest}
                  style={{
                    background: "#4A3F28",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  Join Test
                </Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Bundle Modal --- */}
      <AnimatePresence>
        {showBundleModal && (
          <motion.div
            key="bundle-modal-backdrop"
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
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(3px)",
              zIndex: 1051,
            }}
          >
            <Modal
              show={showBundleModal}
              onHide={handleCloseBundleModal}
              centered
              as={motion.div}
              key="bundle-modal-content"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Modal.Header
                closeButton
                className="text-white border-0"
                style={{ background: "#4A3F28" }}
              >
                <Modal.Title className="fw-bold">
                  AMU 9th Entrance Test Series
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-light rounded-bottom">
                <p>
                  This bundle offers 10 carefully curated full-length tests for
                  the AMU 9th entrance exam — designed to strengthen every
                  concept and track your progress.
                </p>
                <h4 className="text-end fw-bold mt-4">Price: ₹799</h4>
              </Modal.Body>
              <Modal.Footer className="bg-light rounded-bottom border-0">
                <Button variant="secondary" onClick={handleCloseBundleModal}>
                  Close
                </Button>
                <Button
                  size="lg"
                  onClick={handleBuyBundle}
                  style={{
                    background: "#4A3F28",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  Buy Bundle
                </Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Profile Completion Modal --- */}
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
            Please complete your profile before proceeding to the test or
            purchasing bundles. This helps us personalize your experience and
            assign tests properly.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProfileModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGoToProfile}
            style={{ background: "#4A3F28", color: "#FFFFFF", border: "none" }}
          >
            Go to Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestScheduleView;
