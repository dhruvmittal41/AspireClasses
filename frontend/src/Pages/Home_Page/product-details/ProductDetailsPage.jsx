import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useProductBundles } from "./productDetails.hook";
import { fetchUserProfileStatus } from "./productDetails.service";
import BundleCard from "./BundleCard";
import ProfilePromptModal from "./ProfilePromptModal";

const ProductDetailsPage = () => {
  const { bundles, loading, error } = useProductBundles();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const navigate = useNavigate();

  const handleBuy = async (bundle) => {
    const isComplete = await fetchUserProfileStatus();
    if (isComplete) {
      navigate(`/payment/bundle/${bundle.slug || bundle.id}`, {
        state: { name: bundle.bundle_name, price: bundle.price },
      });
    } else {
      setSelectedBundle(bundle);
      setShowProfileModal(true);
    }
  };

  if (loading)
    return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <Container fluid className="py-5">
        <motion.h1 className="text-center mb-5">Our Test Bundles</motion.h1>

        <Row className="g-4 justify-content-center">
          {bundles.map((bundle) => (
            <Col xs={12} md={10} lg={8} key={bundle.id}>
              <BundleCard bundle={bundle} onBuy={handleBuy} />
            </Col>
          ))}
        </Row>
      </Container>

      <ProfilePromptModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onConfirm={() => navigate("/Home", { state: { openProfile: true } })}
      />
    </>
  );
};

export default ProductDetailsPage;
