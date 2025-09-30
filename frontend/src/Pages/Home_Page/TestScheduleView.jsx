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
} from "react-bootstrap";
import { ClockIcon, CalendarIcon } from "./Icons"; // Assuming these are valid local components

const baseUrl = import.meta.env.VITE_BASE_URL;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" } },
};

// --- Main TestScheduleView Component ---
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
        setError("Failed to fetch the test schedule. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingTests();
  }, []);

  // This handler now calls the prop function passed down from HomePage
  const handleGoToProfile = () => {
    setShowProfileModal(false); // Close the modal
    onNavigateToProfile(); // Call the function to switch the view
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading Schedule...</p>
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
      >
        <h1 className="display-5 mb-4">Upcoming Test Schedule</h1>

        <AnimatePresence>
          {upcomingTests.length > 0 ? (
            <Stack gap={4}>
              {upcomingTests.map((test) => (
                <Card
                  as={motion.div}
                  key={test.id}
                  variants={itemVariants}
                  layout
                  className="shadow-sm bg-dark text-white"
                >
                  <Card.Header>
                    <Card.Title as="h5" className="mb-2">
                      {test.test_name}
                    </Card.Title>
                    <div className="d-flex flex-wrap gap-3 text-success small">
                      <span className="d-flex align-items-center">
                        <CalendarIcon />
                        <span className="ms-2">
                          {new Date(test.date_scheduled).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
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
                  </Card.Header>
                  <Card.Body>
                    <h6 className="text-success">Syllabus:</h6>
                    <p>{test.subject_topic}</p>
                  </Card.Body>
                  <Card.Footer className="text-end">
                    <Button
                      as={motion.button}
                      variant="primary"
                      onClick={() => setShowProfileModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join Test
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </Stack>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert variant="info" className="text-center">
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
