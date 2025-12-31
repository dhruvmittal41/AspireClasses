import { Spinner } from "react-bootstrap";

const LoadingState = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-50">
    <Spinner animation="border" />
  </div>
);

export default LoadingState;
