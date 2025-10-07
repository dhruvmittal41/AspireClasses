import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Stack,
  Row,
  Col,
  InputGroup,
  ListGroup,
  Image,
  Badge, // Import Badge component
} from "react-bootstrap";
import "./UpdateQuestions.css";

import "katex/dist/katex.min.css"; // Don't forget this stylesheet!
import { InlineMath } from "react-katex";
const baseUrl = import.meta.env.VITE_BASE_URL;

// --- Sub-component: QuestionImageUploader ---
const QuestionImageUploader = ({
  currentImageUrl,
  onUploadComplete,
  onRemoveImage,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChangeAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("questionImage", file);

    try {
      const response = await axios.post(
        `${baseUrl}/api/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      onUploadComplete(response.data.image_url);
    } catch (err) {
      setUploadError("Image upload failed.");
      setPreview(currentImageUrl); // Revert preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="text-center bg-light">
      <Card.Body>
        <div className="mb-2" style={{ height: "150px" }}>
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              thumbnail
              fluid
              style={{ height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              No Image
            </div>
          )}
        </div>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChangeAndUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <Stack
          direction="horizontal"
          gap={2}
          className="justify-content-center"
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Spinner size="sm" /> Uploading...
              </>
            ) : (
              "Change Image"
            )}
          </Button>
          {preview && onRemoveImage && (
            <Button variant="outline-danger" size="sm" onClick={onRemoveImage}>
              Remove
            </Button>
          )}
        </Stack>
        {uploadError && (
          <Alert variant="danger" className="mt-2 small py-1">
            {uploadError}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

// --- Sub-component: AddQuestionForm ---
const AddQuestionForm = ({ testId, onQuestionAdded, onCancel }) => {
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    options: ["", "", "", ""],
    marks: 1, // MODIFIED: Added marks with a default value of 1
  });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... your existing validation logic

    try {
      const token = localStorage.getItem("admin_token");
      // MODIFIED: The 'marks' field from the state is now automatically included in the payload
      const payload = {
        ...newQuestion,
        correct_option: correctAnswer,
        image_url: imageUrl,
      };
      const response = await axios.post(
        `${baseUrl}/api/tests/${testId}/questions`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onQuestionAdded({ ...response.data.question, ...payload });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question.");
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h4" className="text-center">
        Add New Question
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newQuestion.question_text}
              onChange={(e) =>
                setNewQuestion((p) => ({ ...p, question_text: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Question Image (Optional)</Form.Label>
            <QuestionImageUploader
              currentImageUrl={imageUrl}
              onUploadComplete={setImageUrl}
              onRemoveImage={() => setImageUrl("")}
            />
          </Form.Group>
          <Form.Label>Options</Form.Label>
          <Row xs={1} md={2} className="g-2 mb-3">
            {newQuestion.options.map((opt, index) => (
              <Col key={index}>
                <InputGroup>
                  <InputGroup.Text>
                    {String.fromCharCode(65 + index)}
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newQuestion.options];
                      updated[index] = e.target.value;
                      setNewQuestion((p) => ({ ...p, options: updated }));
                    }}
                    required
                  />
                </InputGroup>
              </Col>
            ))}
          </Row>

          {/* MODIFICATION START: Added Marks field alongside Correct Answer */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correct Answer</Form.Label>
                <Form.Select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select correct option
                  </option>
                  {["a", "b", "c", "d"].map((l) => (
                    <option key={l} value={l}>
                      Option {l.toUpperCase()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Marks</Form.Label>
                <Form.Control
                  type="number"
                  value={newQuestion.marks}
                  onChange={(e) =>
                    setNewQuestion((p) => ({
                      ...p,
                      marks: Number(e.target.value),
                    }))
                  }
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          {/* MODIFICATION END */}

          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Question
            </Button>
          </Stack>
        </Form>
      </Card.Body>
    </Card>
  );
};

// --- Main Component: UpdateQuestions ---
export const UpdateQuestions = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/tests`);
        setTests(res.data);
      } catch (err) {
        setError("Failed to fetch tests.");
      }
    };
    fetchTests();
  }, []);

  const handleFetchQuestions = async () => {
    if (!selectedTest) return;
    setLoading(true);
    setError("");
    setIsAdding(false);
    setQuestions([]);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.get(
        `${baseUrl}/api/tests/${selectedTest}/questions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // MODIFIED: Set a default 'marks' value of 1 if not provided by the API
      const parsed = res.data.map((q) => ({
        ...q,
        options:
          typeof q.options === "string"
            ? JSON.parse(q.options)
            : q.options || [],
        marks: q.marks || 1,
      }));
      setQuestions(parsed);
    } catch (err) {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      // MODIFIED: The editedData now contains the 'marks' field, which will be sent in the update
      await axios.put(`${baseUrl}/api/questions/${id}`, editedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((q) =>
        q.map((item) => (item.id === id ? { ...editedData, id } : item))
      );
      setEditingId(null);
    } catch (err) {
      setError("Failed to save.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`${baseUrl}/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((q) => q.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Update Test Questions</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <InputGroup>
            <Form.Select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
            >
              <option value="" disabled>
                Select a test to manage...
              </option>
              {tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.test_name}
                </option>
              ))}
            </Form.Select>
            <Button
              onClick={handleFetchQuestions}
              disabled={!selectedTest || loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Fetching...
                </>
              ) : (
                "Fetch Questions"
              )}
            </Button>
          </InputGroup>
        </Card.Body>
      </Card>

      {selectedTest && !isAdding && (
        <div className="d-grid mb-4">
          <Button
            variant="outline-primary"
            className="add-new-btn-custom"
            onClick={() => setIsAdding(true)}
          >
            + Add New Question
          </Button>
        </div>
      )}

      {isAdding && (
        <AddQuestionForm
          testId={selectedTest}
          onQuestionAdded={(q) => {
            setQuestions((p) => [...p, { ...q, marks: q.marks }]); // Ensure marks default is set
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <Stack gap={3}>
        {questions.map((q) => (
          <Card key={q.id}>
            <Card.Body>
              {editingId === q.id ? (
                // Editing View
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editedData.question_text}
                      onChange={(e) =>
                        setEditedData((p) => ({
                          ...p,
                          question_text: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <QuestionImageUploader
                      currentImageUrl={editedData.image_url}
                      onUploadComplete={(url) =>
                        setEditedData((p) => ({ ...p, image_url: url }))
                      }
                      onRemoveImage={() =>
                        setEditedData((p) => ({ ...p, image_url: null }))
                      }
                    />
                  </Form.Group>
                  <Row xs={1} md={2} className="g-2 mb-3">
                    {editedData.options.map((opt, index) => (
                      <Col key={index}>
                        <Form.Control
                          value={opt}
                          onChange={(e) => {
                            const updated = [...editedData.options];
                            updated[index] = e.target.value;
                            setEditedData((p) => ({ ...p, options: updated }));
                          }}
                        />
                      </Col>
                    ))}
                  </Row>

                  {/* MODIFICATION START: Added Marks field to Edit view */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Correct Answer</Form.Label>
                        <Form.Select
                          value={editedData.correct_option}
                          onChange={(e) =>
                            setEditedData((p) => ({
                              ...p,
                              correct_option: e.target.value,
                            }))
                          }
                        >
                          {["a", "b", "c", "d"].map((l) => (
                            <option key={l} value={l}>
                              Option {l.toUpperCase()}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Marks</Form.Label>
                        <Form.Control
                          type="number"
                          value={editedData.marks}
                          onChange={(e) =>
                            setEditedData((p) => ({
                              ...p,
                              marks: Number(e.target.value),
                            }))
                          }
                          min="1"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* MODIFICATION END */}

                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="justify-content-end mt-3"
                  >
                    <Button
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button variant="success" onClick={() => handleSave(q.id)}>
                      Save
                    </Button>
                  </Stack>
                </Form>
              ) : (
                // Display View
                <div>
                  {/* MODIFIED: Display question marks using a Badge */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">
                      <InlineMath math={q.question_text} />
                    </h5>
                    <Badge bg="secondary" pill>
                      {q.marks} {q.marks > 1 ? "marks" : "mark"}
                    </Badge>
                  </div>

                  {q.image_url && (
                    <Image
                      src={q.image_url}
                      thumbnail
                      fluid
                      className="my-2"
                      style={{ maxWidth: "300px" }}
                    />
                  )}
                  <ListGroup variant="flush">
                    {q.options.map((opt, index) => (
                      <ListGroup.Item
                        key={index}
                        className={
                          String.fromCharCode(97 + index) === q.correct_option
                            ? "correct-answer-item"
                            : ""
                        }
                      >
                        {String.fromCharCode(65 + index)}.{" "}
                        <InlineMath math={opt} />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="justify-content-end mt-3"
                  >
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setEditingId(q.id);
                        setEditedData(q);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(q.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};
