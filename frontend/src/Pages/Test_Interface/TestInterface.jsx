import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa"; // Added FaBars, FaTimes
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
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import "./TestInterface.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getOptionKey = (index) => String.fromCharCode(97 + index);

const KatexRenderer = ({ text }) => {
  if (typeof text !== "string" || !text) {
    return null;
  }
  const displayParts = text.split("$$");
  return (
    <>
      {displayParts.map((displayPart, displayIndex) => {
        if (displayIndex % 2 === 1) {
          return <BlockMath key={displayIndex} math={displayPart} />;
        } else {
          const inlineParts = displayPart.split("$");
          return (
            <span key={displayIndex}>
              {inlineParts.map((inlinePart, inlineIndex) => {
                if (inlineIndex % 2 === 1) {
                  return <InlineMath key={inlineIndex} math={inlinePart} />;
                } else {
                  return <span key={inlineIndex}>{inlinePart}</span>;
                }
              })}
            </span>
          );
        }
      })}
    </>
  );
};

const TestInterface = ({ id, onBack }) => {
  const navigate = useNavigate();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // <-- NEW: For desktop sidebar toggle

  // --- LOGIC ---
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const [questionsRes, testDetailsRes] = await Promise.all([
          api.get(`/api/tests/${id}/questions`),
          api.get(`/api/tests/${id}`),
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

  const handleBeforeUnload = useCallback((e) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave? Test will be submitted.";
  }, []);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      setIsSubmitting(true);
      try {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, selectedOption]) => ({
            questionId: parseInt(questionId, 10),
            selectedOption,
          })
        );
        localStorage.removeItem(`test-${id}`);

        await api.post(`/api/tests/${id}/submit`, {
          answers: formattedAnswers,
          testId: id,
        });
        if (!isAutoSubmit) {
          alert("✅ Test submitted successfully!");
        }
        onBack();
      } catch (error) {
        if (!isAutoSubmit) {
          alert("⚠️ There was an error submitting your test.");
        }
        setIsSubmitting(false);
      }
    },
    [id, answers, onBack, handleBeforeUnload]
  );

  useEffect(() => {
    if (timeLeft === null || isSubmitting) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, handleSubmit, isSubmitting]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isSubmitting) {
        setShowLeaveWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isSubmitting]);

  useEffect(() => {
    const saved = localStorage.getItem(`test-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
      setTimeLeft(parsed.timeLeft || null);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    localStorage.setItem(
      `test-${id}`,
      JSON.stringify({
        answers,
        currentQuestionIndex,
        timeLeft,
      })
    );
  }, [answers, currentQuestionIndex, timeLeft, id]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentQuestionIndex, testData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Test will be submitted.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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

  // ---- UPDATED NAVIGATION ----
  const requestNavigation = () => setShowNavBlocker(true);

  const confirmNavigation = async () => {
    await handleSubmit(true);
    navigate(-1);
  };

  const cancelNavigation = () => setShowNavBlocker(false);
  // ----------------------------

  const handleSaveAnswer = () => {
    const questionId = testData.questions[currentQuestionIndex].id;
    if (markedForReview.has(questionId)) {
      const newMarked = new Set(markedForReview);
      newMarked.delete(questionId);
      setMarkedForReview(newMarked);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 992) setIsPaletteOpen(false);
  };

  // --- RENDER SECTION ---
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

  const questions = testData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex] || null;

  if (!currentQuestion) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
        <p className="mt-2">Preparing questions…</p>
      </Container>
    );
  }

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
          isPaletteOpen ? "sidebar-open" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isPaletteOpen && (
          <div
            className="palette-overlay d-lg-none"
            onClick={() => setIsPaletteOpen(false)}
          />
        )}
        <Button
          variant="primary"
          className="d-lg-none palette-toggle-btn"
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          aria-controls="question-palette"
          aria-expanded={isPaletteOpen}
        >
          <FaArrowRight />
        </Button>

        {/* --- HEADER --- */}
        <Row className="mb-3 align-items-center test-header-row bg-light p-2 rounded shadow-sm">
          <Col xs="auto" className="d-none d-lg-block">
            <Button
              variant="outline-secondary"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title="Toggle Question Palette"
            >
              {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
            </Button>
          </Col>
          <Col>
            <h4 className="test-title mb-0 text-center text-md-start">
              {testData?.title}
            </h4>
          </Col>
          <Col xs="auto">
            <div className="d-flex align-items-center">
              <span className="fw-bold me-2 d-none d-sm-inline">
                Time Left:
              </span>
              <span className="h4 fw-bold text-primary mb-0">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>
          </Col>
        </Row>

        {/* --- MAIN CONTENT --- */}
        <Row className="g-3 main-row">
          {/* --- LEFT: PALETTE --- */}
          <Col
            lg={3}
            md={4}
            id="question-palette"
            className={`palette-sidebar ${isPaletteOpen ? "open" : ""} ${
              isSidebarCollapsed ? "d-none" : ""
            }`}
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
              <Card.Body className="overflow-auto">
                <Row xs={4} sm={5} md={4} lg={5} className="g-2 text-center">
                  {questions.map((q, index) => (
                    <Col key={q.id}>
                      <Button
                        variant={getStatusVariant(q, index)}
                        className="w-150 rounded-circle"
                        active={currentQuestionIndex === index}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Card.Footer className="bg-light p-3">
                <Stack gap={2} className="small mb-3">
                  <div>
                    <span className="legend-box bg-success"></span> Answered
                  </div>
                  <div>
                    <span className="legend-box bg-warning"></span> Marked
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

          {/* --- CENTER: QUESTION --- */}
          <Col
            md={isSidebarCollapsed ? 12 : 8}
            lg={isSidebarCollapsed ? 12 : 9}
          >
            <Card className="h-100 d-flex flex-column shadow-sm">
              <Card.Header>
                <Card.Title as="h5">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Card.Title>
              </Card.Header>
              <Card.Body className="d-flex flex-column scrollable-content">
                <div className="overflow-auto p-2">
                  <div className="lead">
                    <KatexRenderer text={currentQuestion.question_text} />
                  </div>
                  {currentQuestion.image_url && (
                    <div className="text-center my-3">
                      <Image
                        src={currentQuestion.image_url}
                        fluid
                        rounded
                        style={{ maxHeight: "25vh", objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <Form>
                    <Stack gap={3} className="mt-3">
                      {Array.isArray(currentQuestion.options) &&
                        currentQuestion.options.map((optionText, index) => {
                          const optionKey = getOptionKey(index);
                          return (
                            <Form.Check
                              key={optionKey}
                              type="radio"
                              id={`q${currentQuestion.id}-opt${optionKey}`}
                              name={`question-${currentQuestion.id}`}
                              label={<KatexRenderer text={optionText.trim()} />}
                              value={optionKey}
                              checked={
                                answers[currentQuestion.id] === optionKey
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  currentQuestion.id,
                                  optionKey
                                )
                              }
                              className="option-label"
                            />
                          );
                        })}
                    </Stack>
                  </Form>
                </div>
              </Card.Body>
              <Card.Footer className="bg-light p-3">
                <Stack
                  direction="horizontal"
                  gap={2}
                  className="flex-wrap justify-content-between"
                >
                  <Button
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button variant="warning" onClick={handleMarkReview}>
                    {markedForReview.has(currentQuestion.id)
                      ? "Unmark Review"
                      : "Mark for Review"}
                  </Button>
                  <Button variant="info" onClick={handleSaveAnswer}>
                    Save Answer
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </Button>
                </Stack>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* --- MODALS --- */}
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

      <Modal
        show={showNavBlocker}
        onHide={cancelNavigation}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>✋ Confirm Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to leave? Your test will be submitted
          automatically.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelNavigation}>
            Stay on Page
          </Button>
          <Button variant="danger" onClick={confirmNavigation}>
            Leave & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestInterface;
