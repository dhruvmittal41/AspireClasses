import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
  Stack,
  Image,
} from "react-bootstrap";
import { InlineMath, BlockMath } from "react-katex";
import api from "../../api/axios";
import "./TestInterface.css";
import { AuthContext } from "../../context/AuthContext";
import "katex/dist/katex.min.css";

const getOptionKey = (index) => String.fromCharCode(97 + index);

const KatexRenderer = ({ text }) => {
  if (!text) return null;

  const regex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return <BlockMath key={index} math={part.slice(2, -2)} />;
        }

        if (part.startsWith("$") && part.endsWith("$")) {
          return <InlineMath key={index} math={part.slice(1, -1)} />;
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

const Review_Test = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { user, authLoading, accessToken } = useContext(AuthContext);

  if (authLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </Container>
    );
  }

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const q = await api.get(`/api/tests/${id}/questions`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuestions(q.data || []);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [id, accessToken]);

  useEffect(() => {
    if (!user?.id || !id) return;

    const loadProgress = async () => {
      try {
        const res = await api.get("/api/test-progress/load", {
          params: { userId: user.id, testId: id },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const restored = {};
        res.data.forEach((row) => {
          restored[row.question_id] = row.selected_option;
        });

        setUserAnswers(restored);
      } catch (err) {
        console.error("Failed to load progress:", err);
      }
    };

    loadProgress();
  }, [id, user?.id, accessToken]);

  if (loading)
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner />
      </Container>
    );

  const currentQuestion = questions[currentQuestionIndex];

  const getOptionStatus = (qid, key) => {
    const userAnswer = userAnswers[qid];
    const correct = questions.find((q) => q.id === qid)?.correct_option;
    if (key === correct) return "option-correct";
    if (key === userAnswer && userAnswer !== correct) return "option-wrong";
    return "";
  };

  return (
    <>
      <Container
        as={motion.div}
        fluid
        className={`p-3 test-interface-container ${
          isPaletteOpen ? "sidebar-open" : ""
        }`}
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
        >
          <FaArrowRight />
        </Button>

        <Row className="mb-3 align-items-center test-header-row bg-light p-2 rounded shadow-sm">
          <Col xs="auto" className="d-none d-lg-block">
            <Button
              variant="outline-secondary"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
            </Button>
          </Col>
          <Col>
            <h4 className="test-title mb-0 text-center">Review Test</h4>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Col>
        </Row>

        <Row className="g-3 main-row">
          <Col
            lg={3}
            md={4}
            id="question-palette"
            className={`palette-sidebar ${isPaletteOpen ? "open" : ""} ${
              isSidebarCollapsed ? "d-none" : ""
            }`}
          >
            <Card className="h-100 d-flex flex-column shadow-sm">
              <Card.Header as="h5">Question Palette</Card.Header>
              <Card.Body className="overflow-auto">
                <Row xs={4} sm={5} md={4} lg={5} className="g-2 text-center">
                  {questions.map((q, index) => (
                    <Col key={q.id}>
                      <Button
                        variant={
                          index === currentQuestionIndex
                            ? "primary"
                            : "outline-secondary"
                        }
                        className="w-150 rounded-circle"
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col
            md={isSidebarCollapsed ? 12 : 8}
            lg={isSidebarCollapsed ? 12 : 9}
          >
            <Card className="h-100 d-flex flex-column shadow-sm">
              <Card.Header>
                Question {currentQuestionIndex + 1} of {questions.length}
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
                      {currentQuestion.options.map((opt, i) => {
                        const key = getOptionKey(i);
                        return (
                          <Form.Check
                            key={key}
                            type="radio"
                            disabled
                            checked={userAnswers[currentQuestion.id] === key}
                            label={<KatexRenderer text={opt} />}
                            className={`option-label ${getOptionStatus(
                              currentQuestion.id,
                              key,
                            )}`}
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
                  className="justify-content-between"
                >
                  <Button
                    variant="secondary"
                    disabled={currentQuestionIndex === 0}
                    onClick={() =>
                      setCurrentQuestionIndex((i) => Math.max(i - 1, 0))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() =>
                      setCurrentQuestionIndex((i) =>
                        Math.min(i + 1, questions.length - 1),
                      )
                    }
                  >
                    Next
                  </Button>
                </Stack>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Review_Test;
