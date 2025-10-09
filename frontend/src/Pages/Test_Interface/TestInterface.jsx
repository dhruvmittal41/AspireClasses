import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useBlocker } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  Stack,
  Image,
  Modal,
} from "react-bootstrap";
import "katex/dist/katex.min.css"; // Added KaTeX CSS
import { InlineMath } from "react-katex"; // Added KaTeX Component
import "./TestInterface.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getOptionKey = (index) => String.fromCharCode(97 + index);

// Helper function to render text with inline math
const renderWithMath = (text) => {
  if (!text) return null;
  // Split the text by the math delimiter ($...$)
  const parts = text.split(/\$(.*?)\$/g);
  return parts.map((part, index) => {
    // Every odd-indexed part is a math expression
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    // Every even-indexed part is plain text
    return <span key={index}>{part}</span>;
  });
};

const TestInterface = ({ id, onBack }) => {
  // --- STATE ---
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [showNavBlocker, setShowNavBlocker] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const [questionsRes, testDetailsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/tests/${id}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/tests/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTestData({ ...testDetailsRes.data, questions: questionsRes.data });
        setTimeLeft(testDetailsRes.data.duration_minutes * 60);
      } catch (err) {
        setError("Failed to load the test.");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      try {
        const token = localStorage.getItem("token");
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, selectedOption]) => ({
            questionId: parseInt(questionId, 10),
            selectedOption,
          })
        );
        await axios.post(
          `${baseUrl}/api/tests/${id}/submit`,
          { answers: formattedAnswers, testId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!isAutoSubmit) {
          alert("✅ Test submitted successfully!");
        }
        onBack();
      } catch (error) {
        if (!isAutoSubmit) {
          alert("⚠️ There was an error submitting your test.");
        }
      }
    },
    [id, answers, onBack]
  );

  // --- TIMER ---
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      handleSubmit(true);
      return;
    }
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

  // --- NAVIGATION BLOCKER ---
  const blocker = useBlocker(!!testData && !loading);

  useEffect(() => {
    if (blocker && blocker.state === "blocked") {
      setShowNavBlocker(true);
    }
  }, [blocker]);

  const handleProceedNavigation = async () => {
    await handleSubmit(true);
    if (blocker) blocker.proceed();
  };

  const handleCancelNavigation = () => {
    setShowNavBlocker(false);
    if (blocker) blocker.reset();
  };

  // --- VISIBILITY / EXIT WARNINGS ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowLeaveWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Test will be submitted.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // --- HANDLERS ---
  const handleAnswerChange = (questionId, optionKey) =>
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));

  const handleMarkReview = () => {
    const questionId = testData.questions[currentQuestionIndex].id;
    const newMarked = new Set(markedForReview);
    newMarked.has(questionId)
      ? newMarked.delete(questionId)
      : newMarked.add(questionId);
    setMarkedForReview(newMarked);
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 992) setIsPaletteOpen(false);
  };

  // --- RENDER ---
  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading Test...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={onBack} variant="secondary">
          Go Back
        </Button>
      </Container>
    );
  }

  if (!testData?.questions?.length) {
    return (
      <Alert variant="warning">No questions available for this test.</Alert>
    );
  }

  const { questions } = testData;
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getStatusVariant = (q, index) => {
    const isAnswered = answers.hasOwnProperty(q.id);
    const isMarked = markedForReview.has(q.id);
    if (isAnswered && isMarked) return "answered-review";
    if (isMarked) return "warning";
    if (isAnswered) return "success";
    if (currentQuestionIndex === index) return "primary";
    return "outline-secondary";
  };

  return (
    <>
      <Container
        as={motion.div}
        fluid
        className={`p-3 test-interface-container ${
          // Removed 'scrollable-content' from here
          isPaletteOpen ? "sidebar-open" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Mobile Overlay */}
        {isPaletteOpen && (
          <div
            className="palette-overlay d-lg-none"
            onClick={() => setIsPaletteOpen(false)}
          />
        )}

        {/* Mobile Toggle Button */}
        <Button
          variant="primary"
          className="d-lg-none palette-toggle-btn"
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          aria-controls="question-palette"
          aria-expanded={isPaletteOpen}
        >
          <FaArrowRight />
        </Button>

        <Row className="g-3 main-row">
          {/* Left: Palette */}
          <Col
            lg={3}
            md={4}
            id="question-palette"
            className={`palette-sidebar ${isPaletteOpen ? "open" : ""}`}
          >
            <Card className="h-100 d-flex flex-column shadow-sm">
              <Card.Header
                as="h5"
                className="d-flex justify-content-between align-items-center"
              >
                <span>Question Palette</span>
                <Button
                  variant="close"
                  className="d-lg-none"
                  onClick={() => setIsPaletteOpen(false)}
                />
              </Card.Header>
              <Card.Body className="flex-grow-1 overflow-auto">
                <Row xs={4} sm={5} md={4} lg={5} className="g-2 text-center">
                  {questions.map((q, index) => (
                    <Col key={q.id}>
                      <Button
                        variant={getStatusVariant(q, index)}
                        className={`w-100 rounded-circle ${
                          getStatusVariant(q, index) === "answered-review"
                            ? "answered-review"
                            : ""
                        }`}
                        active={currentQuestionIndex === index}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Card.Footer className="bg-light small">
                <Stack gap={2}>
                  <div>
                    <span className="legend-box bg-success"></span> Answered
                  </div>
                  <div>
                    <span className="legend-box bg-warning"></span> Marked for
                    Review
                  </div>
                  <div>
                    <span className="legend-box answered-review-legend"></span>{" "}
                    Answered & Marked
                  </div>
                  <div>
                    <span className="legend-box border border-secondary"></span>{" "}
                    Not Visited
                  </div>
                </Stack>
              </Card.Footer>
            </Card>
          </Col>

          {/* Center: Question */}
          <Col lg={6} md={8}>
            <Card className="h-100 d-flex flex-column shadow-sm">
              <Card.Header>
                <Card.Title as="h5">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Card.Title>
              </Card.Header>
              {/* Added 'scrollable-content' class here for correct scrolling */}
              <Card.Body className="scrollable-content">
                <p className="lead">
                  {/* Used renderWithMath for question text */}
                  {renderWithMath(currentQuestion.question_text)}
                </p>
                {currentQuestion.image_url && (
                  <div className="text-center my-3">
                    <Image
                      src={currentQuestion.image_url}
                      fluid
                      rounded
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                  </div>
                )}
                <Form>
                  <Stack gap={3}>
                    {currentQuestion.options.map((optionText, index) => {
                      const optionKey = getOptionKey(index);
                      return (
                        <Form.Check
                          key={optionKey}
                          type="radio"
                          id={`q${currentQuestion.id}-opt${optionKey}`}
                          name={`question-${currentQuestion.id}`}
                          // Used renderWithMath for option labels
                          label={renderWithMath(optionText.trim())}
                          value={optionKey}
                          checked={answers[currentQuestion.id] === optionKey}
                          onChange={() =>
                            handleAnswerChange(currentQuestion.id, optionKey)
                          }
                        />
                      );
                    })}
                  </Stack>
                </Form>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between bg-light">
                <Button variant="warning" onClick={handleMarkReview}>
                  {markedForReview.has(currentQuestion.id)
                    ? "Unmark Review"
                    : "Mark for Review"}
                </Button>
                <Button variant="success" onClick={handleSaveAndNext}>
                  Save & Next
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          {/* Right: Timer & Submit */}
          <Col lg={3} className="d-none d-lg-block">
            <Card className="h-100 d-flex flex-column text-center shadow-sm">
              <Card.Header as="h5">Time Left</Card.Header>
              <Card.Body className="d-flex flex-column justify-content-center">
                <div className="display-4 fw-bold text-primary">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </div>
              </Card.Body>
              <Card.Footer className="bg-light">
                <div className="d-grid">
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleSubmit(false)}
                  >
                    Submit Test
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Leave Warning Modal */}
      <Modal
        show={showLeaveWarning}
        onHide={() => setShowLeaveWarning(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Warning: Test in Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You moved away from the test window. Switching tabs or leaving may
          auto-submit your test.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLeaveWarning(false)}
          >
            Resume Test
          </Button>
          <Button variant="danger" onClick={() => handleSubmit(true)}>
            Submit Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Navigation Blocker Modal */}
      <Modal
        show={showNavBlocker}
        onHide={handleCancelNavigation}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>✋ Confirm Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to leave? Your progress will be submitted
          automatically.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelNavigation}>
            Stay on Page
          </Button>
          <Button variant="danger" onClick={handleProceedNavigation}>
            Leave & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestInterface;
