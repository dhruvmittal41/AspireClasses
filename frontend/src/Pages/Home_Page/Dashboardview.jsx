import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaChartLine, FaBookOpen, FaQuoteLeft } from "react-icons/fa";
import "./DashboardView.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" } },
};

// --- Recent Results Table ---
const RecentResults = ({ results, loading, error }) => (
  <Card as={motion.div} variants={itemVariants} className="h-100 shadow-sm">
    <Card.Header as="h5">
      <FaChartLine className="me-2 text-primary" />
      Recent Results
    </Card.Header>
    <Card.Body>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">Error: {error}</Alert>}
      {!loading && !error && (
        <>
          {results.length > 0 ? (
            <Table responsive striped hover size="sm">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.test_name}</td>
                    <td>{`${Math.round((result.score / 85) * 100)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No recent results found.</p>
          )}
        </>
      )}
    </Card.Body>
  </Card>
);

// --- Free Demo Tests ---
const FreeDemoTests = () => {
  const demoTests = [
    { id: 1, title: "AMU 9th Entrance" },
    { id: 2, title: "JEE Mains Mock" },
    { id: 3, title: "NEET Biology Basics" },
    { id: 4, title: "Navodaya Practice" },
  ];

  return (
    <Card as={motion.div} variants={itemVariants} className="h-100 shadow-sm">
      <Card.Header as="h5">
        <FaBookOpen className="me-2 text-success" />
        Try a Free Demo Test
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {demoTests.map((test) => (
            <Col key={test.id} sm={6} lg={12} xl={6}>
              <motion.div
                className="test-card-custom p-3 rounded"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="h6 mb-0 text-center">{test.title}</h3>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

// --- Daily Quote Section ---
const DailyQuote = () => {
  const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Dream big. Work hard. Stay humble.",
    "Push yourself, because no one else is going to do it for you.",
    "Discipline beats motivation every single time.",
    "Every expert was once a beginner.",
    "Great things never come from comfort zones.",
  ];

  const today = new Date().getDate();
  const quoteOfTheDay = quotes[today % quotes.length];

  return (
    <motion.div
      className="quote-section text-center text-white mb-4 rounded shadow-sm p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <FaQuoteLeft className="quote-icon mb-2" />
      <h5 className="fw-normal fst-italic">"{quoteOfTheDay}"</h5>
    </motion.div>
  );
};

// --- Main Dashboard View ---
const DashboardView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(response.data.slice(0, 5));
      } catch (err) {
        setError("Failed to fetch results. Please try again later.");
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <Container
      as={motion.div}
      className="py-4 position-relative dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Floating Background Animation */}
      <div className="floating-shape shape1" />
      <div className="floating-shape shape2" />
      <div className="floating-shape shape3" />

      {/* Header + Daily Quote */}
      <motion.div
        className="dashboard-header text-center text-white mb-3 rounded shadow-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="fw-bold">Hey Dhruv 👋</h1>
        <p className="lead mb-0">Here’s your learning progress today.</p>
      </motion.div>

      <DailyQuote />

      {/* Main Dashboard Content */}
      <Row className="g-4">
        <Col lg={8}>
          <RecentResults results={results} loading={loading} error={error} />
        </Col>
        <Col lg={4}>
          <FreeDemoTests />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardView;
