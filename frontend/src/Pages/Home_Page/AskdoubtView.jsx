// src/AskADoubtView.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Card, Button } from "react-bootstrap";
import { EmailIcon, WhatsAppIcon } from "./Icons"; // Assuming these are valid local components
import "./AskdoubtView.css"; // We will use a much smaller CSS file

// Framer Motion variants remain the same
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.15 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AskADoubtView = () => {
  const [username, setUserName] = useState("");

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name);
    }
  }, []);

  const contactEmail = "support@yourplatform.com";
  const contactPhone = "911234567890"; // Your WhatsApp number with country code
  const emailSubject = `Doubt from ${username || "a user"}`;

  return (
    <Container
      as={motion.div} // Use Container as the motion component
      key="ask-doubt-contact"
      className="py-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 className="display-5 text-center mb-4" variants={itemVariants}>
        Have a Question?
      </motion.h1>

      <Card
        as={motion.div} // Use Card as the motion component
        className="text-center shadow-lg border-0 mx-auto"
        style={{ maxWidth: "700px" }}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card.Body className="p-4 p-md-5">
          <Card.Text className="lead text-muted mb-4">
            For immediate assistance or to get your doubts cleared by our
            experts, please reach out to us directly using one of the options
            below.
          </Card.Text>

          {/* Buttons container with Bootstrap flex utilities */}
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Button
              as={motion.a} // Use Button as the motion component
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                emailSubject
              )}`}
              className="contact-button-email" // Custom class for gradient
              size="lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <EmailIcon />
              <span className="ms-2">Contact via Email</span>
            </Button>

            <Button
              as={motion.a} // Use Button as the motion component
              href={`https://wa.me/${contactPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-button-whatsapp" // Custom class for gradient
              size="lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <WhatsAppIcon />
              <span className="ms-2">Chat on WhatsApp</span>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AskADoubtView;
