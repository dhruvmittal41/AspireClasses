// src/components/CreateOrUpdateTest.jsx

import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestById,
  createTest,
  updateTest,
  clearTestState,
} from "../../features/data/testsSlice";

const CreateOrUpdateTest = () => {
  const { testId } = useParams(); // from route /tests/edit/:testId

  const isEditMode = Boolean(testId);
  const dispatch = useDispatch();

const { currentTest, loading, submitting, error, success } = useSelector(
  (state) => state.tests
);


  const [formData, setFormData] = useState({
    test_name: "",
    num_questions: "",
    duration_minutes: "",
    subject_topic: "",
    instructions: "",
    test_category: "standard",
    date_scheduled: "",
    has_negative_marking: false,
    negative_marks_per_question: "",
  });



 useEffect(() => {
  if (isEditMode) {
    dispatch(fetchTestById(testId));
  }

  return () => {
    dispatch(clearTestState());
  };
}, [dispatch, testId, isEditMode]);
useEffect(() => {
  if (currentTest && isEditMode) {
    setFormData(currentTest);
  }
}, [currentTest, isEditMode]);


  useEffect(() => {
    if (!formData.has_negative_marking) {
      setFormData((prev) => ({
        ...prev,
        negative_marks_per_question: "",
      }));
    }
  }, [formData.has_negative_marking]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();


  if (!formData.test_name || !formData.num_questions || !formData.duration_minutes) {
    return;
  }

  if (isEditMode) {
    dispatch(updateTest({ testId, formData }));
  } else {
    dispatch(createTest(formData));
  }
};


  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4">
                {isEditMode ? "Update Test" : "Create a New Test"}
              </h2>

              {success && (
                <Alert variant="success">{success}</Alert>
              )}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Test Name*</Form.Label>
                      <Form.Control
                        name="test_name"
                        value={formData.test_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Test Category</Form.Label>
                      <Form.Select
                        name="test_category"
                        value={formData.test_category}
                        onChange={handleChange}
                      >
                        <option value="standard">Standard</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="practice">Practice</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Number of Questions*</Form.Label>
                      <Form.Control
                        type="number"
                        name="num_questions"
                        value={formData.num_questions}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        label="Enable Negative Marking"
                        name="has_negative_marking"
                        checked={formData.has_negative_marking}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Negative Marks per Question</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="negative_marks_per_question"
                        value={formData.negative_marks_per_question}
                        onChange={handleChange}
                        disabled={!formData.has_negative_marking}
                        placeholder="e.g. 0.25"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Duration (minutes)*</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration_minutes"
                        value={formData.duration_minutes}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Subject / Topics</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="subject_topic"
                        value={formData.subject_topic}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Instructions</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Scheduled Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_scheduled"
                        value={formData.date_scheduled || ""}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button
                    variant="success"
                    size="lg"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : isEditMode
                        ? "Update Test"
                        : "Create Test"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOrUpdateTest;
