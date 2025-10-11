import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
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

// --- Animation Variants ---
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
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- Recent Results Table ---
const RecentResults = React.memo(({ results, loading, error }) => (
  <Card as={motion.div} variants={itemVariants} className="shadow-sm">
    <Card.Header as="h5" className="d-flex align-items-center">
      <FaChartLine className="me-2 icon-primary" />
      Recent Results
    </Card.Header>
    <Card.Body>
      {loading && (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          {results.length > 0 ? (
            <Table responsive striped hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Test Name</th>
                  {/* Changed header for clarity */}
                  <th>Score (/85)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.test_name}</td>
                    <td>
                      {/* UPDATED: Display score out of 85 */}
                      {typeof result.score === "number"
                        ? `${result.score} / 85`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted text-center mt-3">
              No recent results found.
            </p>
          )}
        </>
      )}
    </Card.Body>
  </Card>
));

RecentResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      test_name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      max_score: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

// --- Free Demo Tests ---
const FreeDemoTests = React.memo(() => {
  const demoTests = [
    { id: 1, title: "AMU 9th Entrance" },
    { id: 2, title: "JEE Mains Mock" },
    { id: 3, title: "NEET Biology Basics" },
    { id: 4, title: "Navodaya Practice" },
  ];

  return (
    <Card as={motion.div} variants={itemVariants} className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <FaBookOpen className="me-2 icon-success" />
        Try a Free Demo Test
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {demoTests.map((test) => (
            <Col key={test.id} xs={12} sm={6}>
              <motion.button
                className="test-card-custom w-100 p-3 rounded"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert(`Starting demo test: ${test.title}`)}
              >
                <h3 className="h6 mb-0 text-center">{test.title}</h3>
              </motion.button>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
});

// --- Daily Quote Section ---
const DailyQuote = React.memo(() => {
  const quotes = useMemo(
    () => [
      "Success is the sum of small efforts repeated day in and day out.",
      "Don’t watch the clock; do what it does. Keep going.",
      "Dream big. Work hard. Stay humble.",
      "Push yourself, because no one else is going to do it for you.",
      "Discipline beats motivation every single time.",
      "Every expert was once a beginner.",
      "Great things never come from comfort zones.",
    ],
    []
  );

  const quoteOfTheDay = useMemo(() => {
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  }, [quotes]);

  return (
    <motion.div
      className="quote-section text-center text-white mb-4 rounded shadow-sm p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <FaQuoteLeft className="quote-icon mb-2" />
      <h5 className="fw-normal fst-italic">"{quoteOfTheDay}"</h5>
    </motion.div>
  );
});

// --- Main Dashboard View ---
const DashboardView = ({ userName = "Learner" }) => {
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

        if (Array.isArray(response.data)) {
          const processedResults = response.data.map((result) => ({
            ...result,
            max_score: result.max_score || 100, // Keep default for data consistency
          }));
          setResults(processedResults.slice(0, 5));
        } else {
          console.error("API did not return an array:", response.data);
          setResults([]);
        }
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
    <>
      {/* This new wrapper contains the shapes and sits behind everything */}
      <div className="background-animation-wrapper">
        <div className="floating-shape shape1" />
        <div className="floating-shape shape2" />
        <div className="floating-shape shape3" />
      </div>

      {/* The main container no longer holds the shapes */}
      <Container
        as={motion.div}
        className="py-4 dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="dashboard-header text-center text-white mb-3 rounded shadow"
          variants={itemVariants}
        >
          <h1 className="fw-bold">Hey {userName} 👋</h1>
          <p className="lead mb-0">Here’s your learning progress today.</p>
        </motion.div>

        <DailyQuote />

        <Row className="g-4">
          <Col lg={8}>
            <RecentResults results={results} loading={loading} error={error} />
          </Col>
          <Col lg={4}>
            <FreeDemoTests />
          </Col>
        </Row>
      </Container>
    </>
  );
};

DashboardView.propTypes = {
  userName: PropTypes.string,
};

export default DashboardView;
