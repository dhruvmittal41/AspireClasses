import React from "react";
import PropTypes from "prop-types";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa";

import { itemVariants } from "./dashboard.animations";
import { TOTAL_QUESTIONS } from "./dashboard.constants";
import { clampScore } from "./dashboard.helpers";

const RecentResults = React.memo(({ results, loading, error }) => (
  <Card as={motion.div} variants={itemVariants} className="shadow-sm">
    <Card.Header as="h5" className="d-flex align-items-center">
      <FaChartLine className="me-2 icon-primary" />
      Recent Results
    </Card.Header>

    <Card.Body>
      {loading && (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner
            animation="border"
            role="status"
            aria-label="Loading results"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          {results.length > 0 ? (
            <Table responsive striped hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.test_name}</td>
                    <td>{`${clampScore(
                      result.score
                    )} / ${TOTAL_QUESTIONS}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted text-center mt-3">
              No recent results found.
            </p>
          )}
        </>
      )}
    </Card.Body>
  </Card>
));

RecentResults.displayName = "RecentResults";

RecentResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      test_name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      max_score: PropTypes.number,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default RecentResults;
