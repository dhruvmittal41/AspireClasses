// src/ResultsView.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
import api from "../../api/axios";

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

const TOTAL_QUESTIONS = 85;

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

const clampScore = (score) => {
  const s = Number(score);
  if (Number.isNaN(s) || s < 0) return 0;
  return Math.min(s, TOTAL_QUESTIONS);
};

const getQuestionCounts = (score) => {
  const correct = clampScore(score);
  return {
    correct,
    incorrect: TOTAL_QUESTIONS - correct,
    total: TOTAL_QUESTIONS,
  };
};

const formatScoreOutOf85 = (score) => {
  return `${clampScore(score)} / ${TOTAL_QUESTIONS}`;
};

const getPerformanceFeedback = (score) => {
  const s = clampScore(score);
  if (s >= 75)
    return {
      variant: "success",
      text: "Excellent work! You have mastered this topic.",
    };
  if (s >= 60)
    return {
      variant: "info",
      text: "Great job! A solid performance with a strong understanding.",
    };
  if (s >= 40)
    return {
      variant: "warning",
      text: "Good effort. There are some areas where you can improve.",
    };
  return {
    variant: "danger",
    text: "It looks like this topic was challenging.",
  };
};

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/api/results");
        setResults(response.data || []);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Unable to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const summaryStats = useMemo(() => {
    if (!results.length) return { average: 0, best: null, total: 0 };

    const totalScore = results.reduce((sum, r) => sum + clampScore(r.score), 0);
    const best = results.reduce(
      (max, r) => (clampScore(r.score) > clampScore(max.score) ? r : max),
      results[0]
    );

    return {
      average: Math.round(totalScore / results.length),
      best,
      total: results.length,
    };
  }, [results]);

  const overallChartData = {
    labels: results.map((r) => r.test_name),
    datasets: [
      {
        label: "Correct Questions",
        data: results.map((r) => clampScore(r.score)),
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
          data: [clampScore(selectedResult?.score)],
          backgroundColor: "#3B82F6",
        },
        {
          label: "Highest Score",
          data: [clampScore(selectedResult?.highest_score)],
          backgroundColor: "#EF4444",
        },
      ],
    },
    doughnut: {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [
            clampScore(selectedResult?.score),
            TOTAL_QUESTIONS - clampScore(selectedResult?.score),
          ],
          backgroundColor: ["#3B82F6", "#E5E7EB"],
          borderColor: ["#FFFFFF", "#FFFFFF"],
          borderWidth: 2,
        },
      ],
    },
  };

  let modalInsightText = "";
  if (selectedResult) {
    const diff =
      clampScore(selectedResult.score) -
      clampScore(selectedResult.average_score);
    if (diff > 0)
      modalInsightText = `You answered ${diff} more questions correctly than the average.`;
    else if (diff < 0)
      modalInsightText = `You answered ${Math.abs(
        diff
      )} fewer questions correctly than the average.`;
    else
      modalInsightText =
        "You performed exactly on average with other students.";
  }

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <h4 className="ms-3">Loading your results...</h4>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container
      fluid
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="display-5 mb-4">Results Dashboard</h1>

      <Row className="mb-4">
        <Col md={4} as={motion.div} variants={itemVariants} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Best Performance</Card.Title>
              <Card.Text className="display-4 fw-bold text-success">
                {summaryStats.best
                  ? formatScoreOutOf85(summaryStats.best.score)
                  : "N/A"}
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

      <Card className="shadow-sm mb-5">
        <Card.Header as="h5">Overall Performance Trend</Card.Header>
        <Card.Body style={{ height: "300px" }}>
          <Line
            data={overallChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true, max: TOTAL_QUESTIONS } },
            }}
          />
        </Card.Body>
      </Card>

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
                  <span className="fw-bold fs-4">
                    {formatScoreOutOf85(result.score)}
                  </span>
                  <Badge bg={getPerformanceFeedback(result.score).variant}>
                    {getPerformanceFeedback(result.score).text.split("!")[0]}
                  </Badge>
                </div>
                <ProgressBar
                  now={clampScore(result.score)}
                  max={TOTAL_QUESTIONS}
                  label={formatScoreOutOf85(result.score)}
                />
                <Card.Text className="text-muted mt-2 text-end">
                  Highest: {formatScoreOutOf85(result.highest_score)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

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
                  data={modalChartData.bar}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, max: TOTAL_QUESTIONS } },
                  }}
                />
              </div>
            </Col>
            <Col md={4}>
              <div style={{ height: "180px" }} className="mb-4">
                <Doughnut data={modalChartData.doughnut} />
              </div>
              <h5>Performance Insights</h5>
              <p>{modalInsightText}</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ResultsView;
