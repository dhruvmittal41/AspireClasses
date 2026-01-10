// src/components/admin/TestMonitorGrid.jsx

import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col, Spinner, Alert, Button } from "react-bootstrap";

const statusVariant = {
  not_started: "secondary",
  started: "warning",
  completed: "success",
};

const TestMonitorGrid = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [data, setData] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tests on load
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/api/admin/tests", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load tests");
        const json = await res.json();
        setTests(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTests();
  }, []);

  // Fetch users when a test is selected
  useEffect(() => {
    if (!selectedTest) return;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(`/api/admin/tests/${selectedTest.id}/monitor`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load test monitor");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [selectedTest]);

  if (loadingTests) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  // 🧩 Step 1: Show test list
  if (!selectedTest) {
    return (
      <>
        <h3 className="mb-4">Select a Test to Monitor</h3>
        <Row className="g-4">
          {tests.map((test) => (
            <Col key={test.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="h-100 shadow-sm border-0 cursor-pointer"
                onClick={() => setSelectedTest(test)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title className="h6">{test.test_name}</Card.Title>
                  <small className="text-muted">{test.subject_topic}</small>
                  <div className="mt-3 small text-muted">
                    {test.num_questions} questions · {test.duration_minutes} min
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  }

  // 🧩 Step 2: Show monitor grid
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Monitoring: {selectedTest.test_name}</h3>
        <Button
          variant="outline-secondary"
          onClick={() => setSelectedTest(null)}
        >
          ← Back to tests
        </Button>
      </div>

      {loadingUsers ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">
          {data.map((user) => (
            <Col key={user.user_id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <Card.Title className="h6 mb-0">{user.name}</Card.Title>
                      <small className="text-muted">{user.email}</small>
                    </div>
                    <Badge bg={statusVariant[user.status]}>
                      {user.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="mt-3 small text-muted">
                    <div>
                      <strong>User ID:</strong> {user.user_id}
                    </div>
                    <div>
                      <strong>Started:</strong>{" "}
                      {user.started_at
                        ? new Date(user.started_at).toLocaleString()
                        : "—"}
                    </div>
                    <div>
                      <strong>Completed:</strong>{" "}
                      {user.completed_at
                        ? new Date(user.completed_at).toLocaleString()
                        : "—"}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default TestMonitorGrid;
