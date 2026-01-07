import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  return displayParts.map((part, i) =>
    i % 2 ? <BlockMath key={i} math={part} /> : part
  );
};

const Review_Test = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Spinner />;

  const getOptionStatus = (qid, key) => {
    const user = userAnswers[qid];
    const correct = questions.find((q) => q.id === qid)?.correct_option;

    if (key === correct) return "option-correct";
    if (key === user && user !== correct) return "option-wrong";
    return "";
  };

  return (
    <Container fluid className="p-3">
      <Button onClick={() => navigate(-1)}>Back</Button>

      {questions.map((q, idx) => (
        <Card key={q.id} className="my-3 shadow-sm">
          <Card.Header>Question {idx + 1}</Card.Header>
          <Card.Body>
            <div className="lead">
              <KatexRenderer text={q.question_text} />
            </div>

            <Form className="mt-3">
              <Stack gap={2}>
                {q.options.map((opt, i) => {
                  const key = getOptionKey(i);
                  return (
                    <Form.Check
                      key={key}
                      type="radio"
                      disabled
                      checked={userAnswers[q.id] === key}
                      label={<KatexRenderer text={opt} />}
                      className={`option-label ${getOptionStatus(q.id, key)}`}
                    />
                  );
                })}
              </Stack>
            </Form>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Review_Test;
