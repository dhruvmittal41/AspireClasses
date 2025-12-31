import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useMyTests } from "../../../hooks/useMyTests";
import { getLatestAttemptForTest, getTestStatus } from "./myTests.helpers";

import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import TestCard from "./TestCard";
import "./MyTestView.css";
const MyTestsView = () => {
  const { tests, attempts, loading } = useMyTests();
  const navigate = useNavigate();

  if (loading) return <LoadingState />;

  return (
    <Container as={motion.div} fluid className="my-tests-container">
      <h1 className="text-center mb-4">My Tests</h1>

      {tests.length ? (
        <Row className="g-4">
          {tests.map((test) => {
            const lastAttempt = getLatestAttemptForTest(test.id, attempts);
            const status = getTestStatus(test, lastAttempt);

            return (
              <Col key={test.id} xs={12} md={6} lg={4}>
                <TestCard
                  test={test}
                  status={status}
                  onStart={() => navigate(`/tests/${test.id}`)}
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <EmptyState
          onBrowse={() =>
            window.open(
              "https://aspireclasses.cloud/details/bundle/amu-9th-entrance-series",
              "_blank",
              "noopener,noreferrer"
            )
          }
        />
      )}
    </Container>
  );
};

export default MyTestsView;
