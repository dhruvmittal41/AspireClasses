import { Card, Col, Row } from "react-bootstrap";
import { formatScore } from "../../../utils/results.utils";

export default function ResultsSummary({ results }) {
  if (!results.length) return null;

  const best = results.reduce((a, b) => (a.score > b.score ? a : b));

  return (
    <Row className="mb-4">
      <Col md={4}>
        <Card className="text-center shadow-sm">
          <Card.Body>
            <Card.Title>Best Performance</Card.Title>
            <Card.Text className="display-4 fw-bold text-success">
              {formatScore(best.score)}
            </Card.Text>
            <Card.Subtitle>{best.test_name}</Card.Subtitle>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
