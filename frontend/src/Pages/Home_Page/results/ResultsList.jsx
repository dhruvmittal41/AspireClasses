import { Card, Col, Row, ProgressBar, Badge } from "react-bootstrap";
import {
  clampScore,
  formatScore,
  getPerformanceFeedback,
} from "../../../utils/results.utils";

export default function ResultsList({ results, onSelect }) {
  return (
    <Row>
      {results.map((r) => {
        const fb = getPerformanceFeedback(r.score);
        return (
          <Col md={6} lg={4} key={r.id} className="mb-4">
            <Card className="h-100 shadow-sm" onClick={() => onSelect(r)}>
              <Card.Body>
                <Card.Title>{r.test_name}</Card.Title>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold fs-4">{formatScore(r.score)}</span>
                  <Badge bg={fb.variant}>{fb.text}</Badge>
                </div>
                <ProgressBar now={clampScore(r.score)} max={85} />
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
