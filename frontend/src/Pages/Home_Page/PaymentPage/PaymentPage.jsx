// src/pages/PaymentPage.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const productName = state?.name || "the selected item";
  const productPrice = state?.price || "the specified amount";

  return (
    <Container
      className="py-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header
            className="p-4 text-center text-white"
            style={{ background: "#4A3F28" }}
          >
            <h2 className="fw-bold mb-0">Complete Your Payment</h2>
          </Card.Header>
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <p className="mb-1">You are paying for:</p>
              <h4 className="fw-bold">{productName}</h4>
              <h1
                className="display-4 fw-bolder my-3"
                style={{ color: "#4A3F28" }}
              >
                ₹{productPrice}
              </h1>
            </div>

            <Row className="align-items-center g-4">
              <Col xs={12} md={6} className="text-center">
                <p className="mt-2 fw-bold">Scan to Pay</p>
              </Col>
              <Col xs={12} md={6}>
                <div
                  className="p-3 rounded-3"
                  style={{ background: "#f8f9fa" }}
                >
                  <p className="mb-2 small text-muted">Or use UPI ID:</p>
                  <h5 className="fw-bold text-break">
                    mittaldhruv41@okhdfcbank
                  </h5>
                  <hr />
                  <p className="mb-2 small text-muted">
                    For confirmation, contact:
                  </p>
                  <h5 className="fw-bold">+91 8439468693</h5>
                </div>
              </Col>
            </Row>

            <Alert variant="info" className="mt-4 small">
              <Alert.Heading as="h6">Important!</Alert.Heading>
              After completing the payment, please send a screenshot to the
              contact number above for faster confirmation.
            </Alert>

            <div className="d-grid mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/home")}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default PaymentPage;
