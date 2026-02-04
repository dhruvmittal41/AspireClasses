import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import api from "../../api/axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 180 },
  },
};

const TestBundles = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await api.get("/api/test_bundles/");
        setBundles(res.data);
      } catch (err) {
        setError("Failed to load test bundles.");
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const handleBuyNow = async (bundle) => {
    try {
      const res = await api.get("/api/user");
      if (res.data?.profilestat === true) {
        navigate(`/payment/bundle/${bundle.slug}`, {
          state: { name: bundle.bundle_name, price: bundle.price },
        });
      } else {
        setSelectedBundle(bundle);
        setShowProfileModal(true);
      }
    } catch {
      setSelectedBundle(bundle);
      setShowProfileModal(true);
    }
  };

  const handleGoToProfile = () => {
    setShowProfileModal(false);
    navigate("/Home", { state: { openProfile: true } });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" style={{ color: "#4A3F28" }} />
        <p className="mt-3">Loading Test Bundles...</p>
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

  return (
    <>
      <Container
        as={motion.div}
        fluid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-md-5 py-5"
        id="get-tests"
      >
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-2">Test Bundles</h1>
          <p className="lead text-muted fs-5">
            Choose the right test series and start your preparation today.
          </p>
        </div>

        {/* Bigger cards: fewer columns */}
        <Row xs={1} md={2} lg={2} xl={3} className="g-5 justify-content-center">
          {bundles.map((bundle) => (
            <Col
              key={bundle.id}
              as={motion.div}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card
                className="h-100 shadow-lg border-0 rounded-4 overflow-hidden text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #cbb47a 0%, #bfa362 100%)",
                  color: "#4A3F28",
                  minHeight: "420px",
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-between p-5">
                  <div>
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="mb-4 px-3 py-2"
                      style={{ fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      Entrance Exam
                    </Badge>

                    <Card.Title className="fw-bold h4 mb-4">
                      {bundle.bundle_name}
                    </Card.Title>

                    <Card.Text className="fs-6 lh-lg">
                      {bundle.description}
                    </Card.Text>
                  </div>

                  <div className="mt-4">
                    <h3 className="fw-bolder mb-4">₹{bundle.price}</h3>
                    <Button
                      size="lg"
                      className="fw-bold px-5 py-3"
                      onClick={() => handleBuyNow(bundle)}
                      style={{
                        backgroundColor: "#4A3F28",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Buy Bundle
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Profile Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fs-6">
          Please complete your profile before purchasing a test bundle. This
          helps us personalize your experience.
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
            style={{
              background: "#4A3F28",
              color: "#fff",
              border: "none",
            }}
          >
            Go to Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestBundles;
