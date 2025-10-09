// src/DashboardView.jsx

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
import {
  FaTrophy,
  FaChartLine,
  FaBookOpen,
  FaClock,
  FaStar,
} from "react-icons/fa";
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

// --- Stat Card Component ---
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="stat-card text-center text-white rounded shadow-sm p-3"
    style={{ background: color }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon size={32} className="mb-2" />
    <h5>{label}</h5>
    <h3 className="fw-bold">{value}</h3>
  </motion.div>
);

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

  // Dummy data for stat cards
  const stats = [
    {
      label: "Total Tests",
      value: results.length || 12,
      icon: FaClock,
      color: "linear-gradient(135deg, #6f42c1, #9b59b6)",
    },
    {
      label: "Avg Score",
      value: results.length
        ? `${Math.round(
            results.reduce((a, r) => a + (r.score / 85) * 100, 0) /
              results.length
          )}%`
        : "84%",
      icon: FaStar,
      color: "linear-gradient(135deg, #28a745, #20c997)",
    },
  ];

  return (
    <Container
      as={motion.div}
      className="py-4 position-relative dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* --- Floating Background Animation --- */}
      <div className="floating-shape shape1" />
      <div className="floating-shape shape2" />
      <div className="floating-shape shape3" />

      {/* Greeting Section */}
      <motion.div
        className="dashboard-header text-center text-white mb-4 rounded shadow-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="fw-bold">Hey Dhruv 👋</h1>
        <p className="lead mb-0">Here’s your learning progress today.</p>
      </motion.div>

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        {stats.map((stat, index) => (
          <Col xs={6} md={3} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

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
