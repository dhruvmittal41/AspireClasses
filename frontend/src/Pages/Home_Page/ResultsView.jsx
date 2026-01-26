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
import { Bar, Doughnut } from "react-chartjs-2";
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
  Legend,
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

const getPerformanceFeedback = (score, total) => {
  if (total === 0) return { variant: "secondary", text: "Loading..." };
  const pct = score / total;
  if (pct >= 0.88) return { variant: "success", text: "Excellent work!" };
  if (pct >= 0.7) return { variant: "info", text: "Great job!" };
  if (pct >= 0.5) return { variant: "warning", text: "Good effort." };
  return { variant: "danger", text: "Needs improvement." };
};

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [testMetaById, setTestMetaById] = useState({});

  useEffect(() => {
    const fetchResultsAndTests = async () => {
      try {
        const res = await api.get("/api/results");
        const resultsData = res.data || [];
        setResults(resultsData);

        const testIds = [...new Set(resultsData.map((r) => r.test_id))];

        const requests = testIds.map((id) =>
          api.get(`/api/tests/${id}`).then((res) => ({
            id,
            totalQuestions: Number(res.data.num_questions) || 0,
            hasNegativeMarking: Boolean(res.data.has_negative_marking),
            negativeMarksPerQuestion:
              Number(res.data.negative_marks_per_question) || 0,
          })),
        );

        const meta = await Promise.all(requests);
        const metaMap = {};
        meta.forEach((m) => {
          metaMap[m.id] = m;
        });

        setTestMetaById(metaMap);
      } catch (err) {
        console.error(err);
        setError("Unable to load results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResultsAndTests();
  }, []);

  const getTestMeta = (testId) =>
    testMetaById[testId] || {
      totalQuestions: 0,
      hasNegativeMarking: false,
      negativeMarksPerQuestion: 0,
    };

  const getFinalScoreDetails = (result) => {
    const meta = getTestMeta(result.test_id);
    const total = meta.totalQuestions;

    const correct = clampScore(result.score, total);
    const unattempted = Number(result.unattempted_count || 0);
    const incorrect = Math.max(total - correct - unattempted, 0);

    const penalty = meta.hasNegativeMarking
      ? incorrect * meta.negativeMarksPerQuestion
      : 0;

    const finalScore = Math.max(correct - penalty, 0);

    return { correct, incorrect, unattempted, penalty, finalScore, total };
  };

  const summaryStats = useMemo(() => {
    if (!results.length) return { best: null, total: 0 };

    const best = results.reduce((max, r) => {
      const a = getFinalScoreDetails(r).finalScore;
      const b = getFinalScoreDetails(max).finalScore;
      return a > b ? r : max;
    }, results[0]);

    return { best, total: results.length };
  }, [results, testMetaById]);

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

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Best Performance</Card.Title>
              <Card.Text className="display-4 fw-bold text-success">
                {summaryStats.best
                  ? `${getFinalScoreDetails(
                      summaryStats.best,
                    ).finalScore.toFixed(
                      2,
                    )} / ${getTestMeta(summaryStats.best.test_id).totalQuestions}`
                  : "N/A"}
              </Card.Text>
              <Card.Subtitle className="text-muted">
                {summaryStats.best?.test_name}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
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

      <Row>
        {results.map((result) => {
          const details = getFinalScoreDetails(result);
          return (
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
                onClick={() => setSelectedResult(result)}
              >
                <Card.Body>
                  <Card.Title>{result.test_name}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center my-3">
                    <span className="fw-bold fs-4">
                      {details.finalScore.toFixed(2)} / {details.total || "—"}
                    </span>
                    <Badge
                      bg={
                        getPerformanceFeedback(
                          details.finalScore,
                          details.total,
                        ).variant
                      }
                    >
                      {
                        getPerformanceFeedback(
                          details.finalScore,
                          details.total,
                        ).text
                      }
                    </Badge>
                  </div>
                  <ProgressBar now={details.finalScore} max={details.total} />
                </Card.Body>
              </Card>
            </Col>
          );
        })}
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
          {selectedResult &&
            (() => {
              const d = getFinalScoreDetails(selectedResult);
              return (
                <Row>
                  <Col md={8}>
                    <div style={{ height: "350px" }}>
                      <Bar
                        data={{
                          labels: [selectedResult.test_name],
                          datasets: [
                            {
                              label: "Your Final Score",
                              data: [d.finalScore],
                              backgroundColor: "#3B82F6",
                            },
                            {
                              label: "Topper's Score",
                              data: [
                                clampScore(
                                  selectedResult.highest_score,
                                  d.total,
                                ),
                              ],
                              backgroundColor: "#EF4444",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: { y: { beginAtZero: true, max: d.total } },
                        }}
                      />
                    </div>
                  </Col>

                  <Col md={4}>
                    <p>
                      <strong>Correct:</strong> {d.correct}
                    </p>
                    <p>
                      <strong>Incorrect:</strong> {d.incorrect}
                    </p>
                    <p>
                      <strong>Unattempted:</strong> {d.unattempted}
                    </p>

                    {d.penalty > 0 && (
                      <p className="text-danger">
                        <strong>Negative Marks:</strong> -{d.penalty.toFixed(2)}
                      </p>
                    )}

                    <p>
                      <strong>Final Score:</strong> {d.finalScore.toFixed(2)}
                    </p>

                    <Doughnut
                      data={{
                        labels: ["Correct", "Incorrect", "Unattempted"],
                        datasets: [
                          {
                            data: [d.correct, d.incorrect, d.unattempted],
                            backgroundColor: ["#3B82F6", "#EF4444", "#FBBF24"],
                          },
                        ],
                      }}
                    />
                  </Col>
                </Row>
              );
            })()}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ResultsView;
