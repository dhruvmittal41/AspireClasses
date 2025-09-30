// src/components/TestPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Container, Spinner, Alert, Stack } from "react-bootstrap";
import TestOverview from "./TestOverview";
import TestInterface from "./TestInterface";

const baseUrl = import.meta.env.VITE_BASE_URL;

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // --- MODIFIED: Add token to fetchAllTests ---
    const fetchAllTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token"); // Get token
        const res = await axios.get(`${baseUrl}/api/tests`, {
          headers: { Authorization: `Bearer ${token}` }, // Add token to header
        });
        setTests(res.data || []);
      } catch (err) {
        setError("Failed to load tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // --- MODIFIED: Add token to fetchSingleTest ---
    const fetchSingleTest = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsTestStarted(false);
        const token = localStorage.getItem("token"); // Get token
        const res = await axios.get(`${baseUrl}/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Add token to header
        });
        setSelectedTest(res.data);
      } catch (err) {
        setError(
          "Could not find the requested test or you may not have access."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSingleTest();
    } else {
      fetchAllTests();
    }
  }, [id]);

  // --- A SUGGESTION for better user experience after test submission ---
  const handleTestFinish = () => {
    // Navigate user back to the home page after they finish a test
    navigate("/Home");
  };

  console.log("--- DEBUGGING TestPage STATE ---");
  console.log({
    id: id,
    loading: loading,
    error: error,
    isTestStarted: isTestStarted,
    selectedTest: selectedTest,
    testsArrayLength: tests.length,
  });
  console.log("---------------------------------");

  // --- All rendering logic below remains the same ---

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (id && selectedTest) {
    return (
      <AnimatePresence mode="wait">
        {isTestStarted ? (
          <TestInterface
            key={`interface-${id}`}
            id={id}
            // MODIFIED: Use the new handler to navigate away after submission
            onBack={handleTestFinish}
          />
        ) : (
          <Container className="py-3 py-md-5" style={{ maxWidth: "900px" }}>
            <TestOverview
              key={`overview-${id}`}
              testData={selectedTest}
              onStartTest={() => setIsTestStarted(true)}
            />
          </Container>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Container className="py-3 py-md-5" style={{ maxWidth: "900px" }}>
      <h1 className="display-5 text-center mb-4">Available Tests</h1>
      <AnimatePresence>
        {tests.length === 0 ? (
          <Alert variant="info" className="text-center">
            No tests are available at the moment.
          </Alert>
        ) : (
          <Stack gap={4}>
            {tests.map((test) => (
              <TestOverview
                key={test.id}
                testData={test}
                onStartTest={() => navigate(`/tests/${test.id}`)}
              />
            ))}
          </Stack>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default TestPage;
