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

const clampScore = (score, total) => {
  const s = Number(score);
  if (Number.isNaN(s) || s < 0) return 0;
  return Math.min(s, total);
};

const getCounts = (result, total) => {
  const correct = clampScore(result?.score || 0, total);
  const unattempted = Number(result?.unattempted_count || 0);
  const incorrect = Math.max(total - correct - unattempted, 0);
  return { correct, incorrect, unattempted, total };
};

const getPerformanceFeedback = (score, total) => {
  const s = clampScore(score, total);
  if (s >= total * 0.88) return { variant: "success", text: "Excellent work!" };
  if (s >= total * 0.7) return { variant: "info", text: "Great job!" };
  if (s >= total * 0.5) return { variant: "warning", text: "Good effort." };
  return { variant: "danger", text: "Needs improvement." };
};

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/api/results");
        setResults(response.data || []);
      } catch (err) {
        setError("Unable to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleSelectResult = async (result) => {
    try {
      const res = await api.get(`/api/tests/${result.test_id}`);
      setTotalQuestions(res.data.num_questions);
      setSelectedResult(result);
    } catch (err) {
      console.error("Failed to load test info", err);
    }
  };

  const summaryStats = useMemo(() => {
    if (!results.length) return { average: 0, best: null, total: 0 };

    const totalScore = results.reduce(
      (sum, r) => sum + clampScore(r.score, totalQuestions),
      0
    );

    const best = results.reduce(
      (max, r) =>
        clampScore(r.score, totalQuestions) >
        clampScore(max.score, totalQuestions)
          ? r
          : max,
      results[0]
    );

    return {
      average: Math.round(totalScore / results.length),
      best,
      total: results.length,
    };
  }, [results, totalQuestions]);

  const overallChartData = {
    labels: results.map((r) => r.test_name),
    datasets: [
      {
        label: "Correct Questions",
        data: results.map((r) => clampScore(r.score, totalQuestions)),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.3,
      },
    ],
  };

  const counts = getCounts(selectedResult, totalQuestions);

  const modalChartData = {
    bar: {
      labels: [selectedResult?.test_name],
      datasets: [
        {
          label: "Your Score",
          data: [clampScore(selectedResult?.score, totalQuestions)],
          backgroundColor: "#3B82F6",
        },
        {
          label: "Topper's Score",
          data: [clampScore(selectedResult?.highest_score, totalQuestions)],
          backgroundColor: "#EF4444",
        },
      ],
    },
    doughnut: {
      labels: ["Correct", "Incorrect", "Unattempted"],
      datasets: [
        {
          data: [counts.correct, counts.incorrect, counts.unattempted],
          backgroundColor: ["#3B82F6", "#EF4444", "#FBBF24"],
          borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
          borderWidth: 2,
        },
      ],
    },
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
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
              className="h-100 shadow-sm"
              onClick={() => handleSelectResult(result)}
            >
              <Card.Body>
                <Card.Title>{result.test_name}</Card.Title>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <span className="fw-bold fs-4">
                    {clampScore(result.score, totalQuestions)} /{" "}
                    {totalQuestions}
                  </span>
                  <Badge
                    bg={
                      getPerformanceFeedback(result.score, totalQuestions)
                        .variant
                    }
                  >
                    {getPerformanceFeedback(result.score, totalQuestions).text}
                  </Badge>
                </div>
                <ProgressBar
                  now={clampScore(result.score, totalQuestions)}
                  max={totalQuestions}
                />
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
              <div style={{ height: "350px" }}>
                <Bar
                  data={modalChartData.bar}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, max: totalQuestions } },
                  }}
                />
              </div>
            </Col>
            <Col md={4}>
              <p>
                <strong>Correct:</strong> {counts.correct}
              </p>
              <p>
                <strong>Incorrect:</strong> {counts.incorrect}
              </p>
              <p>
                <strong>Unattempted:</strong> {counts.unattempted}
              </p>
              <p>
                <strong>Total:</strong> {counts.total}
              </p>
              <Doughnut data={modalChartData.doughnut} />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ResultsView;
