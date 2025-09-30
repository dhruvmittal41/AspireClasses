// src/ResultsView.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Container, Card, Table, Modal, Spinner, Alert } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const baseUrl = import.meta.env.VITE_BASE_URL;

// ChartJS registration remains the same
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Animation Variants (simplified, as Modal handles its own animation)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- Main ResultsView Component ---
const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null); // This will control the modal

  useEffect(() => {
    // ... (API fetching logic remains exactly the same) ...
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/results`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setResults(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // --- Chart Data & Options (logic remains the same) ---
  const chartData = {
    labels: [selectedResult?.test_name],
    datasets: [
      {
        label: "Your Score",
        data: [selectedResult?.score],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
      {
        label: "Highest Score",
        data: [selectedResult?.highest_score],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Score Analysis`, font: { size: 16 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Score (%)" },
      },
    },
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
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
      <h1 className="display-5 mb-4">All Results</h1>

      <Card as={motion.div} variants={itemVariants} className="shadow-sm">
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Test Name</th>
                <th>Your Score</th>
                <th>Highest Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  style={{ cursor: "pointer" }}
                  title="Click to see analysis"
                >
                  <td>{result.test_name}</td>
                  <td>{result.score}%</td>
                  <td>{result.highest_score}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* React-Bootstrap Modal for Result Analysis */}
      <Modal
        show={!!selectedResult}
        onHide={() => setSelectedResult(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Result Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "400px" }}>
            {selectedResult && <Bar options={chartOptions} data={chartData} />}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ResultsView;
