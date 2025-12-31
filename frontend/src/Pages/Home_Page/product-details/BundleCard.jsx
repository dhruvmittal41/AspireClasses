import { Card, Button, Badge } from "react-bootstrap";

const BundleCard = ({ bundle, onBuy }) => (
  <Card className="bundle-card shadow-sm h-100">
    <Card.Header className="bundle-card-header">
      <h4>{bundle.bundle_name}</h4>
      <Badge bg="light" text="dark">
        Bundle
      </Badge>
    </Card.Header>

    <Card.Body className="d-flex flex-column">
      <p>{bundle.description}</p>

      {bundle.features?.length > 0 && (
        <ul>
          {bundle.features.map((item, idx) => (
            <li key={idx}>✓ {item}</li>
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <h3>₹{bundle.price}</h3>
        <Button onClick={() => onBuy(bundle)} className="buy-btn">
          Buy Bundle
        </Button>
      </div>
    </Card.Body>
  </Card>
);

export default BundleCard;
