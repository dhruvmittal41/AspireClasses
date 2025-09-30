// src/pages/Shopping_Page.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Spinner,
  Alert,
  Badge,
  Stack,
} from "react-bootstrap";
import "./Shopping_Page.css"; // We'll link to our new, smaller CSS file

// --- Mock Data (for demonstration) ---
const mockTestSeries = [
  {
    id: 1,
    name: "JEE Advanced 2025 Test Series",
    price: 499,
    subject: "Physics, Chemistry, Mathematics",
    short_description:
      "Comprehensive tests for JEE Advanced preparation designed by top educators to simulate the real exam environment.",
    full_description:
      "This series includes 20 full-length mock tests meticulously crafted to cover the entire JEE Advanced syllabus. Each test comes with detailed performance analysis, percentile scores, and video solutions for every question.",
    num_tests: 20,
    test_duration: "3 hours",
  },
  {
    id: 2,
    name: "NEET UG 2025 Full Syllabus Pack",
    price: 449,
    subject: "Biology, Physics, Chemistry",
    short_description:
      "Master the NEET syllabus with our extensive test series, including chapter-wise and full-length mock exams.",
    full_description:
      "Prepare for NEET UG with 50+ tests designed to mirror the latest exam pattern. This pack offers a structured approach, starting with foundational chapter tests and progressing to full-scale simulations.",
    num_tests: 50,
    test_duration: "3 hours 20 minutes",
  },
  {
    id: 3,
    name: "UPSC Prelims 2025 GS + CSAT",
    price: 999,
    subject: "General Studies & CSAT",
    short_description:
      "A complete test series for the UPSC Civil Services Preliminary exam, covering both GS Paper 1 and CSAT Paper 2.",
    full_description:
      "Our flagship UPSC Prelims series features 35 high-quality tests. Questions are framed based on current trends and the official syllabus. Includes detailed answer explanations from our expert faculty.",
    num_tests: 35,
    test_duration: "2 hours",
  },
];

const ShoppingPage = () => {
  const navigate = useNavigate();
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null); // Use object for modal

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        // Using Mock Data
        setTimeout(() => {
          // Simulate network delay
          setTestSeries(mockTestSeries);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to fetch test series. Please try again later.");
        setLoading(false);
      }
    };
    fetchTestSeries();
  }, []);

  const handleCardClick = (test) => setSelectedTest(test);
  const handleCloseModal = () => setSelectedTest(null);

  if (loading) {
    return (
      <div className="state-container">
        <Spinner animation="border" variant="light" />
        <p className="mt-3 text-light">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <>
      <div className="shopping-page-background">
        <Container className="py-5">
          <h1 className="display-4 text-center text-white mb-5">
            Available Test Series
          </h1>
          <Row xs={1} md={2} lg={3} className="g-4">
            {testSeries.map((item) => (
              <Col key={item.id}>
                <motion.div whileHover={{ y: -5, scale: 1.02 }}>
                  <Card
                    className="h-100 card-glassmorphism"
                    onClick={() => handleCardClick(item)}
                  >
                    <Card.Body className="d-flex flex-column">
                      <Card.Title as="h4" className="mb-2">
                        {item.name}
                      </Card.Title>
                      <Badge
                        pill
                        bg="primary"
                        className="align-self-start mb-3"
                      >
                        {item.subject}
                      </Badge>
                      <Card.Text className="text-muted flex-grow-1">
                        {item.short_description}
                      </Card.Text>
                      <h3 className="text-success text-end fw-bold mt-3">
                        {item.price ? `₹${item.price}` : "Free"}
                      </h3>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Details Modal */}
      <Modal show={!!selectedTest} onHide={handleCloseModal} centered size="lg">
        {selectedTest && (
          <>
            <Modal.Header closeButton className="modal-glassmorphism">
              <Modal.Title>{selectedTest.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-glassmorphism">
              <p className="lead text-muted mb-4">
                {selectedTest.full_description}
              </p>
              <Stack
                direction="horizontal"
                gap={3}
                className="p-3 bg-dark rounded mb-3 text-light"
              >
                <div>
                  <strong>Tests Included:</strong> {selectedTest.num_tests}
                </div>
                <div className="ms-auto">
                  <strong>Duration:</strong> {selectedTest.test_duration}
                </div>
              </Stack>
              <Badge pill bg="primary">
                {selectedTest.subject}
              </Badge>
            </Modal.Body>
            <Modal.Footer className="modal-glassmorphism">
              <h3 className="text-success fw-bold me-auto">
                {selectedTest.price ? `₹${selectedTest.price}` : "Free"}
              </h3>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/UserDetails")}
              >
                Buy Now
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default ShoppingPage;
