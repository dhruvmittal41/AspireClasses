// src/ResultsView.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Container,
  Card,
  Modal,
  Spinner,
  Alert,
  Row,
  Col,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// --- ChartJS Registration ---
// Register all necessary components for Bar, Line, and Doughnut charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const baseUrl = import.meta.env.VITE_BASE_URL;

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- Helper Function for Feedback ---
const getPerformanceFeedback = (score) => {
  if (score >= 90)
    return {
      variant: "success",
      text: "Excellent work! You have mastered this topic.",
    };
  if (score >= 75)
    return {
      variant: "info",
      text: "Great job! A solid performance with a strong understanding.",
    };
  if (score >= 50)
    return {
      variant: "warning",
      text: "Good effort. There are some areas where you can improve.",
    };
  return {
    variant: "danger",
    text: "It looks like this topic was challenging. Consider reviewing the material.",
  };
};

// --- Main ResultsView Component ---
const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/results`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // For demonstration, let's add an average_score to each result.
        // Ideally, this would come from your API.
        const enhancedData = response.data.map((r) => ({
          ...r,
          average_score: Math.floor(Math.random() * 15) + 65, // Random average between 65-80
        }));
        setResults(enhancedData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // --- Memoized Calculations for Performance ---
  const summaryStats = useMemo(() => {
    if (results.length === 0) {
      return { average: 0, best: null, total: 0 };
    }
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const average = totalScore / results.length;
    const best = results.reduce(
      (max, r) => (r.score > max.score ? r : max),
      results[0]
    );
    return {
      average: average.toFixed(1),
      best,
      total: results.length,
    };
  }, [results]);

  // --- Chart Data Configurations ---
  const overallChartData = {
    labels: results.map((r) => r.test_name),
    datasets: [
      {
        label: "Score History",
        data: results.map((r) => r.score),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.3,
      },
    ],
  };

  const modalChartData = {
    bar: {
      labels: [selectedResult?.test_name],
      datasets: [
        {
          label: "Your Score",
          data: [selectedResult?.score],
          backgroundColor: "#3B82F6",
        },
        {
          label: "Average Score",
          data: [selectedResult?.average_score],
          backgroundColor: "#F97316",
        },
        {
          label: "Highest Score",
          data: [selectedResult?.highest_score],
          backgroundColor: "#EF4444",
        },
      ],
    },
    doughnut: {
      labels: ["Your Score", "Points Missed"],
      datasets: [
        {
          data: [selectedResult?.score, 100 - (selectedResult?.score || 0)],
          backgroundColor: ["#3B82F6", "#E5E7EB"],
          borderColor: ["#FFFFFF", "#FFFFFF"],
          borderWidth: 2,
        },
      ],
    },
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <h4 className="ms-3">Loading your results...</h4>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error fetching results: {error}</Alert>;
  }

  return (
    <Container
      as={motion.div}
      fluid
      key="results"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="display-5 mb-4">Results Dashboard</h1>

      {/* --- Summary Cards --- */}
      <Row className="mb-4">
        <Col md={4} as={motion.div} variants={itemVariants} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Average Score</Card.Title>
              <Card.Text className="display-4 fw-bold text-primary">
                {summaryStats.average}%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} as={motion.div} variants={itemVariants} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Best Performance</Card.Title>
              <Card.Text className="display-4 fw-bold text-success">
                {summaryStats.best ? `${summaryStats.best.score}%` : "N/A"}
              </Card.Text>
              <Card.Subtitle className="text-muted">
                {summaryStats.best?.test_name}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} as={motion.div} variants={itemVariants} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Total Tests Taken</Card.Title>
              <Card.Text className="display-4 fw-bold text-info">
                {summaryStats.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Overall Performance Chart --- */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm mb-5">
          <Card.Header as="h5">Overall Performance Trend</Card.Header>
          <Card.Body style={{ height: "300px" }}>
            <Line
              data={overallChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Card.Body>
        </Card>
      </motion.div>

      {/* --- Individual Result Cards --- */}
      <h2 className="mb-3">All Test Results</h2>
      <Row>
        {results.map((result) => (
          <Col
            md={6}
            lg={4}
            key={result.id}
            className="mb-4"
            as={motion.div}
            variants={itemVariants}
          >
            <Card
              className="h-100 shadow-sm result-card"
              onClick={() => setSelectedResult(result)}
            >
              <Card.Body>
                <Card.Title>{result.test_name}</Card.Title>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <span className="fw-bold fs-4">{result.score}%</span>
                  <Badge bg={getPerformanceFeedback(result.score).variant}>
                    {getPerformanceFeedback(result.score).text.split("!")[0]}
                  </Badge>
                </div>
                <ProgressBar now={result.score} label={`${result.score}%`} />
                <Card.Text className="text-muted mt-2 text-end">
                  Highest: {result.highest_score}%
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* --- Enhanced Analysis Modal --- */}
      <Modal
        show={!!selectedResult}
        onHide={() => setSelectedResult(null)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Analysis for: {selectedResult?.test_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h5 className="text-center mb-3">Score Comparison</h5>
              <div style={{ height: "350px" }}>
                <Bar
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { max: 100 } },
                  }}
                  data={modalChartData.bar}
                />
              </div>
            </Col>
            <Col md={4} className="d-flex flex-column justify-content-center">
              <div style={{ height: "180px" }} className="mb-4">
                <Doughnut
                  data={modalChartData.doughnut}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
              <h5>
                <i className="bi bi-lightbulb-fill text-warning"></i>{" "}
                Performance Insights
              </h5>
              <p>
                Your score is in the{" "}
                <strong>
                  {(
                    (selectedResult?.score / selectedResult?.highest_score) *
                    100
                  ).toFixed(1)}
                  th percentile
                </strong>{" "}
                of the top score.
              </p>
              <Alert
                variant={
                  getPerformanceFeedback(selectedResult?.score || 0).variant
                }
              >
                {getPerformanceFeedback(selectedResult?.score || 0).text}
              </Alert>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ResultsView;
