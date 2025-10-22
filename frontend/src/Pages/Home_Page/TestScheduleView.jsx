// src/components/TestScheduleView.jsx

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
// Note: Removed Icons, Stack, Spinner, Alert as they are no longer used.
// Note: Removed useState, useEffect, axios as the API call is no longer needed.

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200 } },
};

// Note: Removed formatDate function as it's no longer used.

const TestScheduleView = () => {
  // Note: Removed all state (upcomingTests, isLoading, error)
  const navigate = useNavigate();

  // Note: Removed useEffect hook that fetched upcoming tests

  // Note: Removed handleViewDetails handler
  const handleViewBundle = () => {
    navigate(`/details/bundle/amu-9th-entrance-series`);
  };

  // Note: Removed isLoading and error conditional returns

  return (
    <Container
      as={motion.div}
      fluid
      key="test-schedule-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-md-4 py-5"
    >
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">Test Dashboard</h1>
        <p className="lead text-muted">
          Explore your scheduled tests and special offers below.
        </p>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
        {/* --- Featured Bundle Card --- */}
        <Col
          as={motion.div}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            className="h-100 shadow-lg border-0 rounded-4 overflow-hidden text-center"
            style={{
              background: "linear-gradient(135deg, #cbb47a 0%, #bfa362 100%)",
              color: "#4A3F28",
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div>
                <Badge
                  pill
                  bg="light"
                  text="dark"
                  className="mb-3"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    fontWeight: "600",
                  }}
                >
                  Special Offer
                </Badge>
                <Card.Title className="fw-bold h4 mb-3">
                  AMU 9th Entrance Test Series
                </Card.Title>
                <Card.Text className="fs-6">
                  10 Full-Length Mock Tests to boost your preparation.
                </Card.Text>
              </div>
              <div className="mt-3">
                <h3 className="fw-bolder mb-3">₹799</h3>
                <Button
                  variant="dark"
                  size="lg"
                  className="fw-bold px-4 py-2"
                  onClick={handleViewBundle}
                  style={{
                    backgroundColor: "#4A3F28",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  View Bundle
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Upcoming Tests Section Removed --- */}
        {/* The <AnimatePresence> and upcomingTests.map(...) block has been deleted. */}
      </Row>
    </Container>
  );
};

export default TestScheduleView;