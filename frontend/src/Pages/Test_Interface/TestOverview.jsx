// src/components/TestOverview.jsx

import React from "react";
import { motion } from "framer-motion";
import { Card, Button, Stack, ListGroup } from "react-bootstrap";

const TestOverview = ({ testData, onStartTest }) => {
  const { test_name, subject_topic, num_questions, duration_minutes } =
    testData;

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <Card
      as={motion.div}
      className="shadow-lg border-0"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <Card.Body className="p-4 p-md-5 text-center">
        <Card.Title as="h1" className="display-5 mb-2">
          {test_name}
        </Card.Title>
        <Card.Subtitle className="mb-4 text-muted">
          {subject_topic}
        </Card.Subtitle>

        {/* Details Section */}
        <Stack
          direction="horizontal"
          gap={5}
          className="justify-content-center border-top border-bottom py-3 my-4"
        >
          <div className="text-center">
            <small className="text-muted">Questions</small>
            <strong className="d-block h4 text-primary">{num_questions}</strong>
          </div>
          <div className="text-center">
            <small className="text-muted">Duration</small>
            <strong className="d-block h4 text-primary">
              {duration_minutes} mins
            </strong>
          </div>
        </Stack>

        {/* Instructions Section */}
        <div className="text-start my-4">
          <h4 className="mb-3">Instructions</h4>
          <ListGroup variant="flush">
            <ListGroup.Item>
              Ensure you have a stable internet connection.
            </ListGroup.Item>
            <ListGroup.Item>
              Do not refresh the page during the test.
            </ListGroup.Item>
            <ListGroup.Item>
              The timer will start as soon as you click the button below.
            </ListGroup.Item>
          </ListGroup>
        </div>

        {/* Start Button */}
        <div className="d-grid">
          <Button onClick={onStartTest} size="lg" variant="primary">
            Start Test
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TestOverview;
