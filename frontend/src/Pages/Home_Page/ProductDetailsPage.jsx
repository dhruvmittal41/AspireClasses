// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Stack,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { BookIcon, CalendarIcon, ClockIcon } from "./Icons.jsx";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ProductDetailsPage = ({ onNavigateToProfile, isProfileComplete }) => {
  const { productType, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let productData;

        const authHeaders = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        if (productType === "test") {
          // This logic remains the same for fetching a single test
          const endpoint = `/api/tests/${id}`;
          const response = await axios.get(
            `${baseUrl}${endpoint}`,
            authHeaders
          );
          productData = response.data;
        } else if (productType === "bundle") {
          // --- NEW LOGIC FOR BUNDLES ---
          // 1. Fetch the entire list of bundles from the single endpoint
          const endpoint = `/test_bundles`; // CHANGED: Fetching the list
          const response = await axios.get(
            `${baseUrl}${endpoint}`,
            authHeaders
          );
          const allBundles = response.data;

          // 2. Find the specific bundle from the list using its slug (the 'id' from the URL)
          const specificBundle = allBundles.find(
            (bundle) => bundle.slug === id
          );

          if (specificBundle) {
            productData = specificBundle;
          } else {
            // If no bundle with that slug is found, throw an error.
            throw new Error("Bundle not found.");
          }
        } else {
          throw new Error("Invalid product type.");
        }

        // Add a 'type' property for consistent rendering logic
        setProduct({
          ...productData,
          type: productType.charAt(0).toUpperCase() + productType.slice(1),
        });
      } catch (err) {
        setError(
          err.message || "Could not load product details. Please try again."
        );
        console.error("Error fetching product details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [productType, id]);

  const handleBuyNow = () => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
    } else {
      const productName = product.bundle_name || product.test_name;
      navigate(`/payment/${productType}/${id}`, {
        state: { name: productName, price: product.price },
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
        <p>Loading Details...</p>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!product) return null;

  return (
    <>
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Header
              className="p-4 text-white"
              style={{ background: "#4A3F28" }}
            >
              <h1 className="display-6 fw-bold mb-0">
                {product.bundle_name || product.test_name}
              </h1>
              <Badge bg="light" text="dark" className="mt-2">
                {product.type}
              </Badge>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              <Row>
                <Col md={8}>
                  <p className="lead">{product.description}</p>
                  {product.type === "Test" && product.subject_topic && (
                    <div className="mt-4">
                      <h5 className="fw-semibold d-flex align-items-center mb-3">
                        <BookIcon /> <span className="ms-2">Syllabus</span>
                      </h5>
                      <div className="d-flex flex-wrap gap-2">
                        {product.subject_topic.split(/[,.-]/).map(
                          (topic, idx) =>
                            topic.trim() && (
                              <Badge
                                key={idx}
                                pill
                                text="dark"
                                className="px-3 py-2 fs-6 fw-normal"
                                style={{
                                  backgroundColor: "rgba(74, 63, 40, 0.1)",
                                }}
                              >
                                {topic.trim()}
                              </Badge>
                            )
                        )}
                      </div>
                    </div>
                  )}
                  {product.type === "Bundle" && product.features && (
                    <div className="mt-4">
                      <h5 className="fw-semibold">What's Included:</h5>
                      <ul>
                        {product.features.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Col>
                <Col md={4} className="mt-4 mt-md-0">
                  <div
                    className="p-4 rounded-3"
                    style={{ background: "#FBFAF5" }}
                  >
                    <h2
                      className="text-center fw-bolder"
                      style={{ color: "#4A3F28" }}
                    >
                      ₹{product.price}
                    </h2>
                    {product.type === "Test" && (
                      <Stack gap={3} className="my-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <CalendarIcon />
                          <span className="ms-2">
                            {new Date(
                              product.date_scheduled
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                          <ClockIcon />
                          <span className="ms-2">
                            {product.duration_minutes} minutes
                          </span>
                        </div>
                      </Stack>
                    )}
                    <div className="d-grid mt-4">
                      <Button
                        size="lg"
                        className="fw-bold"
                        onClick={handleBuyNow}
                        style={{
                          background: "#4A3F28",
                          color: "#FFFFFF",
                          border: "none",
                        }}
                      >
                        {product.type === "Test" ? "Enroll Now" : "Buy Bundle"}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
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
