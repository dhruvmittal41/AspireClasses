// src/components/admin/TestMonitorGrid.jsx

import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonitorTests,
  fetchTestMonitor,
  clearMonitorUsers,
} from "../../features/data/monitorSlice";


const statusVariant = {
  not_started: "secondary",
  started: "warning",
  completed: "success",
};

const TestMonitorGrid = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const dispatch = useDispatch();
  const {
  tests,
  users,
  loadingTests,
  loadingUsers,
  error,
} = useSelector((state) => state.monitor);

  useEffect(() => {
  dispatch(fetchMonitorTests());
}, [dispatch]);


  useEffect(() => {
  if (selectedTest) {
    dispatch(fetchTestMonitor(selectedTest.id));
  }

  return () => {
    dispatch(clearMonitorUsers());
  };
}, [dispatch, selectedTest]);


  if (loadingTests) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;


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
          {users.map((user) => (
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
