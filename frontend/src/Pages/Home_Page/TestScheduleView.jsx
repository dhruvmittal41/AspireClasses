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
  Stack,
  Modal,
  Badge,
} from "react-bootstrap";
import { ClockIcon, CalendarIcon } from "./Icons";

const baseUrl = import.meta.env.VITE_BASE_URL;

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

  return (
    <>
      <Container
        as={motion.div}
        fluid
        key="test-schedule"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-md-5"
      >
        <h1 className="display-5 fw-bold mb-4 text-white">
          Upcoming Test Schedule
        </h1>

        <AnimatePresence>
          {upcomingTests.length > 0 ? (
            <Stack gap={4}>
              {upcomingTests.map((test) => (
                <Card
                  as={motion.div}
                  key={test.id}
                  variants={itemVariants}
                  layout
                  className="shadow-lg border-0 rounded-4 overflow-hidden bg-dark text-light"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Header Section */}
                  <div
                    className="px-4 py-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
                    }}
                  >
                    <h4 className="fw-semibold mb-1 text-white">
                      {test.test_name}
                    </h4>
                    <div className="d-flex flex-wrap gap-3 text-white-50 small">
                      <span className="d-flex align-items-center">
                        <CalendarIcon />
                        <span className="ms-2">
                          {new Date(test.date_scheduled).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </span>
                      </span>
                      <span className="d-flex align-items-center">
                        <ClockIcon />
                        <span className="ms-2">
                          {test.duration_minutes} mins
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Body Section */}
                  <Card.Body className="p-4">
                    <h6 className="text-success text-uppercase mb-3">
                      Syllabus
                    </h6>
                    {test.subject_topic ? (
                      <div className="d-flex flex-wrap gap-2">
                        {test.subject_topic.split(/[,.-]/).map((topic, idx) => (
                          <Badge
                            key={idx}
                            bg="secondary"
                            className="px-3 py-2 text-light"
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
                  </Card.Body>

                  {/* Footer Section */}
                  <Card.Footer className="bg-transparent border-0 text-end pb-4 pe-4">
                    <Button
                      as={motion.button}
                      variant="outline-success"
                      size="lg"
                      onClick={() => setShowProfileModal(true)}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#28a745",
                        color: "#fff",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join Test
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </Stack>
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

      {/* Profile Completion Modal */}
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
