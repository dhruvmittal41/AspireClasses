import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./DashboardView.css";

import { containerVariants, itemVariants } from "./dashboard.animations";
import RecentResults from "./RecentResults";
import FreeDemoTests from "./FreeDemoTests";
import DailyQuote from "./DailyQuote";
import { useDashboardResults } from "../../../hooks/useDashboardResults";

const DashboardView = ({ userName = "Learner" }) => {
  const { results, loading, error } = useDashboardResults();

  return (
    <Container
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="dashboard-header" variants={itemVariants}>
        <h1>Hey {userName} 👋</h1>
        <p>Here’s your learning progress today.</p>
      </motion.div>

      <DailyQuote />

      <Row className="g-4">
        <Col lg={8}>
          <RecentResults results={results} loading={loading} error={error} />
        </Col>
        <Col lg={4}>
          <FreeDemoTests />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardView;
