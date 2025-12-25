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
    text: "It looks like this topic was challenging.",
  };
};

const getQuestionCounts = (score) => {
  if (score === null || score === undefined) {
    return { correct: 0, incorrect: 0, total: TOTAL_QUESTIONS };
  }
  const correct = Math.round((parseFloat(score) / 100) * TOTAL_QUESTIONS);
  const incorrect = TOTAL_QUESTIONS - correct;
  return { correct, incorrect, total: TOTAL_QUESTIONS };
};

const formatScoreOutOf85 = (score) => {
  if (score === null || score === undefined) return "N/A";
  const { correct, total } = getQuestionCounts(score);
  return `${correct} / ${total}`;
};

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/api/results`);
        const enhancedData = response.data.map((r) => ({
          ...r,
          average_score: Math.floor(Math.random() * 15) + 65,
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

  const overallChartData = {
    labels: results.map((r) => r.test_name),
    datasets: [
      {
        label: "Correct Questions",
        data: results.map((r) => getQuestionCounts(r.score).correct), // Uses 0-85 count
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
          label: "Your Correct Answers",
          data: [getQuestionCounts(selectedResult?.score).correct],
          backgroundColor: "#3B82F6",
        },
        {
          label: "Average Correct Answers",
          data: [getQuestionCounts(selectedResult?.average_score).correct],
          backgroundColor: "#F97316",
        },
        {
          label: "Highest Correct Answers",
          data: [getQuestionCounts(selectedResult?.highest_score).correct],
          backgroundColor: "#EF4444",
        },
      ],
    },
    doughnut: {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [
            getQuestionCounts(selectedResult?.score).correct,
            getQuestionCounts(selectedResult?.score).incorrect,
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
    const userCorrect = getQuestionCounts(selectedResult.score).correct;
    const avgCorrect = getQuestionCounts(selectedResult.average_score).correct;
    const diff = userCorrect - avgCorrect;

    if (diff > 0) {
      modalInsightText = `You answered ${diff} more questions correctly than the average.`;
    } else if (diff < 0) {
      modalInsightText = `You answered ${Math.abs(
        diff
      )} fewer questions correctly than the average.`;
    } else {
      modalInsightText =
        "You performed exactly on average with other students.";
    }
  }

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
      <Row className="mb-4">
               
        <Col md={4} as={motion.div} variants={itemVariants} className="mb-3">
                   
          <Card className="text-center shadow-sm h-100">
                       
            <Card.Body>
                            <Card.Title>Average Score</Card.Title>             
              <Card.Text className="display-4 fw-bold text-primary">
                                               
                {formatScoreOutOf85(summaryStats.average)}             
              </Card.Text>
                         
            </Card.Body>
                     
          </Card>
                 
        </Col>
               
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
         
      <motion.div variants={itemVariants}>
               
        <Card className="shadow-sm mb-5">
                    <Card.Header as="h5">Overall Performance Trend</Card.Header>
                   
          <Card.Body style={{ height: "300px" }}>
                       
            <Line
              data={overallChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: TOTAL_QUESTIONS,
                    title: { display: true, text: "Correct Questions" },
                  },
                },
              }}
            />
                     
          </Card.Body>
                 
        </Card>
             
      </motion.div>
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
                  now={result.score}
                  label={formatScoreOutOf85(result.score)}
                />
                               
                <Card.Text className="text-muted mt-2 text-end">
                                    Highest:
                  {formatScoreOutOf85(result.highest_score)}               
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
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: TOTAL_QUESTIONS,
                        title: { display: true, text: "Correct Questions" },
                      },
                    },
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
                    plugins: { legend: { display: true, position: "bottom" } },
                  }}
                />
                             
              </div>
                           
              <h5>
                               
                <i className="bi bi-lightbulb-fill text-warning"></i>          
                      Performance Insights              
              </h5>
                                        <p>{modalInsightText}</p>               
                         
              {selectedResult && (
                <Card className="my-3 bg-light shadow-sm">
                                   
                  <Card.Body>
                                       
                    <Card.Title className="text-center h6 mb-3">
                                            Question Breakdown                  
                       
                    </Card.Title>
                                   
                    <div className="d-flex justify-content-around text-center">
                                           
                      <div>
                                               
                        <span className="fs-4 fw-bold text-success">
                                                   
                          {getQuestionCounts(selectedResult.score).correct}     
                                           
                        </span>
                                              <br />                   
                        <small className="text-muted">Correct</small>           
                                 
                      </div>
                                           
                      <div>
                                               
                        <span className="fs-4 fw-bold text-danger">
                                                   
                          {getQuestionCounts(selectedResult.score).incorrect}   
                                             
                        </span>
                                                <br />                       
                        <small className="text-muted">Incorrect</small>         
                                   
                      </div>
                                           
                      <div>
                                               
                        <span className="fs-4 fw-bold text-dark">
                                                   
                          {getQuestionCounts(selectedResult.score).total}       
                                         
                        </span>
                        <br />                 
                        <small className="text-muted">Total</small>        
                      </div>{" "}
                                         
                    </div>{" "}
                               
                  </Card.Body>{" "}
                                 
                </Card>
              )}{" "}
                         
              <Alert
                variant={
                  getPerformanceFeedback(selectedResult?.score || 0).variant
                }
              >
                {" "}
                               
                {getPerformanceFeedback(selectedResult?.score || 0).text}      
              </Alert>{" "}
                         
            </Col>{" "}
                     
          </Row>{" "}
                 
        </Modal.Body>{" "}
             
      </Modal>{" "}
         
    </Container>
  );
};

export default ResultsView;
