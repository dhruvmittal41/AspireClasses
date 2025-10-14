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

  const handleBuyNow = (bundle) => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
    } else {
      navigate(`/payment/bundle/${bundle.slug || bundle.id}`, {
        state: { name: bundle.bundle_name, price: bundle.price },
      });
    }
  };

  const handleGoToProfile = () => {
    setShowProfileModal(false);
    onNavigateToProfile();
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
      <Container fluid className="py-5 px-lg-5">
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

          <div className="d-flex flex-column gap-4">
            {bundles.map((bundle) => (
              <Card
                key={bundle.id}
                className="border-0 shadow-sm rounded-4 overflow-hidden flex-md-row flex-column align-items-stretch w-100"
                style={{ minHeight: "250px" }}
              >
                {/* Header Section (Left) */}
                <div
                  className="d-flex flex-column justify-content-between p-4 text-white"
                  style={{
                    background: "#4A3F28",
                    minWidth: "300px",
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <h4 className="fw-bold mb-0">{bundle.bundle_name}</h4>
                    <Badge bg="light" text="dark" className="mt-2">
                      Bundle
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="fw-bolder mb-0 text-light">
                      ₹{bundle.price}
                    </h3>
                  </div>
                </div>

                {/* Content Section (Right) */}
                <Card.Body className="d-flex flex-column justify-content-between p-4 bg-light">
                  <div>
                    <Card.Text className="mb-3">{bundle.description}</Card.Text>
                    {bundle.features && bundle.features.length > 0 && (
                      <div>
                        <h6 className="fw-semibold">What's Included:</h6>
                        <ul className="list-unstyled ps-3">
                          {bundle.features.map((item, idx) => (
                            <li key={idx}>✓ {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-end">
                    <Button
                      size="lg"
                      className="fw-bold px-5 py-2"
                      onClick={() => handleBuyNow(bundle)}
                      style={{
                        background: "#4A3F28",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "10px",
                      }}
                    >
                      Buy Bundle
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
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
