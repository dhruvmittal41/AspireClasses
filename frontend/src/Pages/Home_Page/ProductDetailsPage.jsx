// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import { motion } from "framer-motion";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ProductDetailsPage = ({ onNavigateToProfile, isProfileComplete }) => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchBundles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = "/api/test_bundles/";
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBundles(response.data);
      } catch (err) {
        setError("Could not load bundles. Please try again.");
        console.error("Error fetching bundles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBundles();
  }, []);

  const handleBuyNow = async (bundle) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const userProfileStat = response.data?.profilestat;

      if (userProfileStat === true) {
        navigate(`/payment/bundle/${bundle.slug || bundle.id}`, {
          state: { name: bundle.bundle_name, price: bundle.price },
        });
      } else {
        setShowProfileModal(true);
      }
    } catch (err) {
      console.error("Error fetching user profile status:", err);
      setShowProfileModal(true);
    }
  };

  const handleGoToProfile = () => {
    setShowProfileModal(false);
    onNavigateToProfile();
    navigate("/Home", { state: { openProfile: true } });
  };

  if (isLoading) {
    return (
      <div className="text-center" style={{ marginTop: "20%" }}>
        <Spinner animation="border" style={{ color: "#4A3F28" }} />
        <p>Loading Bundles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!bundles || bundles.length === 0) {
    return (
      <Container className="py-5 text-center">
        <p>No bundles are available at the moment.</p>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="display-5 fw-bold mb-5 text-center"
            style={{ color: "#4A3F28" }}
          >
            Our Test Bundles
          </h1>
          <Row className="g-4 justify-content-center">
            {bundles.map((bundle) => (
              <Col xs={12} md={10} lg={8} key={bundle.id}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <Card.Header
                    className="p-4 text-white"
                    style={{ background: "#4A3F28" }}
                  >
                    <h4 className="fw-bold mb-0">{bundle.bundle_name}</h4>
                    <Badge bg="light" text="dark" className="mt-2">
                      Bundle
                    </Badge>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Text className="flex-grow-1">
                      {bundle.description}
                    </Card.Text>
                    {bundle.features && bundle.features.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-semibold">What's Included:</h6>
                        <ul className="list-unstyled ps-3">
                          {bundle.features.map((item, idx) => (
                            <li key={idx}>✓ {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-auto">
                      <h3
                        className="fw-bolder mb-3"
                        style={{ color: "#4A3F28" }}
                      >
                        ₹{bundle.price}
                      </h3>
                      <div className="d-grid">
                        <Button
                          size="lg"
                          className="fw-bold"
                          onClick={() => handleBuyNow(bundle)}
                          style={{
                            background: "#4A3F28",
                            color: "#FFFFFF",
                            border: "none",
                          }}
                        >
                          Buy Bundle
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      {/* --- Profile Completion Modal --- */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please complete your profile before purchasing. This helps us
          personalize your experience.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProfileModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGoToProfile}
            style={{ background: "#4A3F28", color: "#FFFFFF", border: "none" }}
          >
            Go to Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductDetailsPage;
