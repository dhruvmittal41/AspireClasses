import React, { useEffect, useState } from "react";
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
  Alert,
  Form,
  Stack,
  Image,
} from "react-bootstrap";
import { InlineMath, BlockMath } from "react-katex";
import api from "../../api/axios";
import "./TestInterface.css";

const getOptionKey = (index) => String.fromCharCode(97 + index);

const KatexRenderer = ({ text }) => {
  if (!text) return null;
  const displayParts = text.split("$$");
  return (
    <>
      {displayParts.map((part, i) =>
        i % 2 ? <BlockMath key={i} math={part} /> : part
      )}
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

  useEffect(() => {
    const loadReview = async () => {
      try {
        const res = await api.get(`/api/tests/${id}/questions`);
        setQuestions(res.data || []);
        const saved = localStorage.getItem(`review-${id}`);
        setUserAnswers(saved ? JSON.parse(saved) : {});
      } catch {
        alert("Failed to load review");
      } finally {
        setLoading(false);
      }
    };
    loadReview();
  }, [id]);

  if (loading)
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner />
      </Container>
    );

  const currentQuestion = questions[currentQuestionIndex];

  const getOptionStatus = (qid, key) => {
    const user = userAnswers[qid];
    const correct = questions.find((q) => q.id === qid)?.correct_option;
    if (key === correct) return "option-correct";
    if (key === user && user !== correct) return "option-wrong";
    return "";
  };

  return (
    <Container
      as={motion.div}
      fluid
      className={`p-3 test-interface-container ${
        isPaletteOpen ? "sidebar-open" : ""
      }`}
    >
      <Button
        variant="primary"
        className="d-lg-none palette-toggle-btn"
        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
      >
        <FaArrowRight />
      </Button>

      {/* HEADER */}
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
          <h4 className="mb-0 text-center">Review Test</h4>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3 main-row">
        {/* PALETTE */}
        <Col
          lg={3}
          md={4}
          className={`palette-sidebar ${isPaletteOpen ? "open" : ""} ${
            isSidebarCollapsed ? "d-none" : ""
          }`}
        >
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Question Palette</Card.Header>
            <Card.Body>
              <Row xs={4} sm={5} md={4} lg={5} className="g-2 text-center">
                {questions.map((q, index) => (
                  <Col key={q.id}>
                    <Button
                      variant={
                        index === currentQuestionIndex
                          ? "primary"
                          : "outline-secondary"
                      }
                      onClick={() => setCurrentQuestionIndex(index)}
                      className="rounded-circle w-100"
                    >
                      {index + 1}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* QUESTION */}
        <Col md={isSidebarCollapsed ? 12 : 8} lg={isSidebarCollapsed ? 12 : 9}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Card.Header>
            <Card.Body className="scrollable-content">
              <div className="lead">
                <KatexRenderer text={currentQuestion.question_text} />
              </div>

              {currentQuestion.image_url && (
                <div className="text-center my-3">
                  <Image src={currentQuestion.image_url} fluid rounded />
                </div>
              )}

              <Form className="mt-3">
                <Stack gap={3}>
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
                          key
                        )}`}
                      />
                    );
                  })}
                </Stack>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Review_Test;
