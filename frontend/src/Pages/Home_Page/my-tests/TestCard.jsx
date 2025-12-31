import { Card, Button, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { BookIcon, ArrowRightIcon } from "../icons/Icons";
import { formatRemainingTime } from "./myTests.helpers";

const TestCard = ({ test, status, onStart }) => (
  <Card as={motion.div} className="test-card" whileHover={{ scale: 1.03 }}>
    <div className="test-card-header">
      <BookIcon /> {test.subject_topic}
      <Badge bg="info">{test.difficulty || "Medium"}</Badge>
    </div>

    <Card.Body>
      <Card.Title>{test.test_name}</Card.Title>
      <Card.Text>{test.num_questions} Questions</Card.Text>

      {status.state === "scheduled" && (
        <Button disabled>Available later</Button>
      )}
      {status.state === "locked" && (
        <Button disabled>
          Locked ({formatRemainingTime(status.unlockAt)})
        </Button>
      )}
      {(status.state === "start" || status.state === "reattempt") && (
        <Button onClick={onStart}>
          {status.state === "reattempt" ? "Reattempt" : "Start"}{" "}
          <ArrowRightIcon />
        </Button>
      )}
    </Card.Body>
  </Card>
);

export default TestCard;
