import { Modal, Row, Col } from "react-bootstrap";
import ScoreComparisonChart from "./charts/ScoreComparisonChart";
import ScoreDoughnut from "./charts/ScoreDoughnut";

export default function ResultsModal({ result, onClose }) {
  return (
    <Modal show={!!result} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{result?.test_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8} style={{ height: 350 }}>
            <ScoreComparisonChart result={result} />
          </Col>
          <Col md={4}>
            <ScoreDoughnut result={result} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
