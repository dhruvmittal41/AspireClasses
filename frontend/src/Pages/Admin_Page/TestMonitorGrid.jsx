// src/components/admin/TestMonitorGrid.jsx

import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col, Spinner, Alert } from "react-bootstrap";

const statusVariant = {
  not_started: "secondary",
  started: "warning",
  completed: "success",
};

const TestMonitorGrid = ({ testId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/tests/${testId}/monitor`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load data");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
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
  );
};

export default TestMonitorGrid;
