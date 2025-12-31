import { motion } from "framer-motion";
import { Button } from "react-bootstrap";

const EmptyState = ({ onBrowse }) => (
  <motion.div
    className="empty-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h2>No Tests Here</h2>
    <p>You haven't bought any tests yet.</p>
    <Button onClick={onBrowse}>Browse All Tests</Button>
  </motion.div>
);

export default EmptyState;
