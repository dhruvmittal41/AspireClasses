import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
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
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./TestInterface.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const getOptionKey = (index) => String.fromCharCode(97 + index);

const KatexRenderer = ({ text }) => {
  if (typeof text !== "string" || !text) return null;
  const displayParts = text.split("$$");
  return (
    <>
      {displayParts.map((displayPart, displayIndex) =>
        displayIndex % 2 === 1 ? (
          <BlockMath key={displayIndex} math={displayPart} />
        ) : (
          <span key={displayIndex}>
            {displayPart
              .split("$")
              .map((inlinePart, inlineIndex) =>
                inlineIndex % 2 === 1 ? (
                  <InlineMath key={inlineIndex} math={inlinePart} />
                ) : (
                  <span key={inlineIndex}>{inlinePart}</span>
                )
              )}
          </span>
        )
      )}
    </>
  );
};

const TestInterface = ({ id, onBack }) => {
  const navigate = useNavigate();

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const [questionsRes, testDetailsRes] = await Promise.all([
          api.get(`/api/tests/${id}/questions`),
          api.get(`/api/tests/${id}`),
        ]);
        setTestData({ ...testDetailsRes.data, questions: questionsRes.data });
        setTimeLeft((testDetailsRes.data.duration_minutes || 0) * 60);
      } catch {
        setError("Failed to load the test.");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
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

        if (!isAutoSubmit) alert("✅ Test submitted successfully!");
        onBack();
      } catch {
        alert("⚠️ Error submitting test.");
        setIsSubmitting(false);
      }
    },
    [id, answers, onBack, isSubmitting]
  );

  useEffect(() => {
    if (timeLeft === null || isSubmitting) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setTimeout(
      () => setTimeLeft((t) => Math.max(t - 1, 0)),
      1000
    );
    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitting, handleSubmit]);

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
    localStorage.setItem(
      `test-${id}`,
      JSON.stringify({ answers, currentQuestionIndex, timeLeft })
    );
  }, [answers, currentQuestionIndex, timeLeft, id]);

  const requestNavigation = () => setShowNavBlocker(true);
  const confirmNavigation = async () => {
    await handleSubmit(true);
    navigate(-1);
  };
  const cancelNavigation = () => setShowNavBlocker(false);

  const handleAnswerChange = (qid, key) =>
    setAnswers((prev) => ({ ...prev, [qid]: key }));

  const handleMarkReview = () => {
    const qid = testData.questions[currentQuestionIndex].id;
    const copy = new Set(markedForReview);
    copy.has(qid) ? copy.delete(qid) : copy.add(qid);
    setMarkedForReview(copy);
  };

  const handleSaveAnswer = () => {
    const qid = testData.questions[currentQuestionIndex].id;
    if (markedForReview.has(qid)) {
      const copy = new Set(markedForReview);
      copy.delete(qid);
      setMarkedForReview(copy);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1)
      setCurrentQuestionIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
  };

  const goToQuestion = (i) => {
    setCurrentQuestionIndex(i);
    if (window.innerWidth < 992) setIsPaletteOpen(false);
  };

  if (loading)
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner />
      </Container>
    );

  if (error)
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  const questions = testData.questions;
  const currentQuestion = questions[currentQuestionIndex];

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
        <Row className="mb-3 align-items-center test-header-row bg-light p-2 rounded shadow-sm">
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
            </Button>
          </Col>
          <Col>
            <h4 className="mb-0">{testData.title}</h4>
          </Col>
          <Col xs="auto">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </Col>
        </Row>

        <Row className="g-3 main-row">
          <Col
            lg={3}
            md={4}
            className={`palette-sidebar ${isSidebarCollapsed ? "d-none" : ""}`}
          >
            <Card>
              <Card.Body>
                <Row xs={5} className="g-2">
                  {questions.map((q, i) => (
                    <Col key={q.id}>
                      <Button
                        variant={
                          answers[q.id]
                            ? markedForReview.has(q.id)
                              ? "warning"
                              : "success"
                            : "outline-secondary"
                        }
                        onClick={() => goToQuestion(i)}
                      >
                        {i + 1}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button variant="danger" onClick={() => handleSubmit(false)}>
                  Submit Test
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          <Col
            md={isSidebarCollapsed ? 12 : 8}
            lg={isSidebarCollapsed ? 12 : 9}
          >
            <Card>
              <Card.Body>
                <div className="lead">
                  <KatexRenderer text={currentQuestion.question_text} />
                </div>
                {currentQuestion.image_url && (
                  <Image fluid src={currentQuestion.image_url} />
                )}
                <Form className="mt-3">
                  {currentQuestion.options.map((opt, i) => {
                    const key = getOptionKey(i);
                    return (
                      <Form.Check
                        key={key}
                        type="radio"
                        label={<KatexRenderer text={opt} />}
                        checked={answers[currentQuestion.id] === key}
                        onChange={() =>
                          handleAnswerChange(currentQuestion.id, key)
                        }
                      />
                    );
                  })}
                </Form>
              </Card.Body>
              <Card.Footer>
                <Stack direction="horizontal" gap={2}>
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button variant="warning" onClick={handleMarkReview}>
                    Mark
                  </Button>
                  <Button variant="info" onClick={handleSaveAnswer}>
                    Save
                  </Button>
                  <Button
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

      <Modal show={showNavBlocker} onHide={cancelNavigation} centered>
        <Modal.Body>Leave and submit test?</Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelNavigation}>Stay</Button>
          <Button variant="danger" onClick={confirmNavigation}>
            Leave
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestInterface;
