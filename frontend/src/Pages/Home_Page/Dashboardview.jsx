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
import "./DashboardView.css"; // We'll link to our new, smaller CSS file

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

// --- Child Components for the Dashboard ---

// Component to display recent test results in a table
const RecentResults = ({ results, loading, error }) => {
  return (
    <Card as={motion.div} variants={itemVariants} className="h-100 shadow-sm">
      <Card.Header as="h5">Recent Results</Card.Header>
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
};

// Component to display cards for free demo tests
const FreeDemoTests = () => {
  const demoTests = [
    { id: 1, title: "AMU 9th Entrance" },
    { id: 2, title: "JEE Mains Mock" },
    { id: 3, title: "NEET Biology Basics" },
    { id: 4, title: "Navodaya Practice" },
  ];

  return (
    <Card as={motion.div} variants={itemVariants} className="h-100 shadow-sm">
      <Card.Header as="h5">Try a Free Demo Test</Card.Header>
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
        setResults(response.data.slice(0, 5)); // Get top 5 recent results
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
      className="py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="display-5 text-center mb-4">Your Dashboard</h1>
      <Row className="g-4">
        {/* Main Content: Recent Results Table */}
        <Col lg={8}>
          <RecentResults results={results} loading={loading} error={error} />
        </Col>

        {/* Sidebar Content: Free Demo Tests */}
        <Col lg={4}>
          <FreeDemoTests />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardView;
