import { Modal, Button } from "react-bootstrap";

const ProfilePromptModal = ({ show, onClose, onConfirm }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Complete Your Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body>Please complete your profile before purchasing.</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button className="confirm-btn" onClick={onConfirm}>
        Go to Profile
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ProfilePromptModal;
