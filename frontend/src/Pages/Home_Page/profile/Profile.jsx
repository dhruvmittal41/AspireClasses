import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

import { useProfile } from "./profile.hook";
import { updateProfile } from "./profile.service";
import { validateProfile } from "./profile.validation";
import ProfileSidebar from "./ProfileSidebar";
import ProfileForm from "./ProfileForm";

const ProfilePage = () => {
  const { data, setData, loading } = useProfile();
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  if (loading)
    return <Spinner animation="border" className="mt-5 d-block mx-auto" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProfile(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      await updateProfile(data);
      setNotification({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch {
      setNotification({ type: "danger", message: "Failed to save details." });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="shadow-sm">
              <Card.Header>My Profile</Card.Header>
              <Card.Body>
                {notification && (
                  <Alert variant={notification.type}>
                    {notification.message}
                  </Alert>
                )}
                <Row>
                  <Col md={4}>
                    <ProfileSidebar profile={data} />
                  </Col>
                  <Col md={8}>
                    <ProfileForm
                      data={data}
                      errors={errors}
                      onChange={setData}
                      onSubmit={handleSubmit}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
