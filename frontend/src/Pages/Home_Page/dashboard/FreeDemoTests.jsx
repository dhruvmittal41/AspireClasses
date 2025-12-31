import React from "react";
import { Card } from "react-bootstrap";
const FreeDemoTests = React.memo(() => {
  const demoTests = [
    {
      id: 1,
      title: "AMU 9th Entrance",
      url: "https://aspireclasses.cloud/tests/1",
    },
    { id: 2, title: "JEE Mains Mock", comingSoon: true },
    { id: 3, title: "NEET Biology Basics", comingSoon: true },
    { id: 4, title: "Navodaya Practice", comingSoon: true },
  ];

  const handleClick = (test) => {
    if (test.url) {
      window.location.href = test.url;
    } else {
      alert("Coming soon!");
    }
  };

  return (
    <Card as={motion.div} variants={itemVariants} className="shadow-sm">
      <Card.Header as="h5" className="d-flex align-items-center">
        <FaBookOpen className="me-2 icon-success" />
        Try a Free Demo Test
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {demoTests.map((test) => (
            <Col key={test.id} xs={12} sm={6}>
              <motion.button
                className="test-card-custom w-100 p-3 rounded"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(test)}
              >
                <h3 className="h6 mb-0 text-center">{test.title}</h3>
              </motion.button>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
});

export default FreeDemoTests;
