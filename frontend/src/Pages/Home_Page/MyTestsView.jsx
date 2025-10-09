import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { BookIcon, ArrowRightIcon } from "./Icons";
import "./MyTestView.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

// --- Loading Component ---
const LoadingState = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "50vh" }}
  >
    <Spinner animation="border" variant="primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

// --- Empty State Component ---
const EmptyState = ({ onBrowse }) => (
  <motion.div
    className="text-center p-4 p-md-5 bg-light rounded border-dashed"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <h2 className="h1 mb-3">No Tests Here!</h2>
    <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: "500px" }}>
      It looks like you haven't purchased any tests yet. Browse our library to
      find the perfect test to kickstart your preparation.
    </p>
    <Button
      as={motion.button}
      variant="success"
      size="lg"
      onClick={onBrowse}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Browse All Tests
    </Button>
  </motion.div>
);

// --- Main MyTestsView Component ---
const MyTestsView = () => {
  const [boughtTests, setBoughtTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoughtTests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/user/mytests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBoughtTests(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setBoughtTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBoughtTests();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <Container as={motion.div} fluid className="my-tests-container">
      <h1 className="display-5 mb-4">My Tests</h1>
      {boughtTests.length > 0 ? (
        <Row className="g-4">
          {boughtTests.map((test) => (
            <Col key={test.id} md={6} lg={4}>
              <Card
                as={motion.div}
                className="h-100 test-card shadow-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="test-card-header d-flex align-items-center justify-content-between p-3">
                  <div className="d-flex align-items-center">
                    <BookIcon className="me-2" />
                    <span className="subject-text">{test.subject_topic}</span>
                  </div>
                  <Badge bg="info" className="level-badge">
                    {test.difficulty || "Medium"}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="h5 fw-bold mb-2">
                    {test.test_name}
                  </Card.Title>
                  <Card.Text className="text-muted mb-3">
                    {test.num_questions} Questions
                  </Card.Text>
                  <div className="syllabus-text mb-3">
                    {test.syllabus
                      ? test.syllabus.slice(0, 100) + "..."
                      : "No syllabus info"}
                  </div>
                  <Button
                    as={motion.button}
                    variant="primary"
                    className="mt-auto d-flex align-items-center justify-content-center start-btn"
                    onClick={() => navigate(`/tests/${test.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="me-2">Start Test</span>
                    <ArrowRightIcon />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <EmptyState onBrowse={() => navigate("/shop")} />
      )}
    </Container>
  );
};

export default MyTestsView;
