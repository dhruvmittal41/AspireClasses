import React, { useMemo } from "react";
import { motion } from "framer-motion";
export const DailyQuote = React.memo(() => {
  const quotes = useMemo(
    () => [
      "Success is the sum of small efforts repeated day in and day out.",
      "Don’t watch the clock; do what it does. Keep going.",
      "Dream big. Work hard. Stay humble.",
      "Push yourself, because no one else is going to do it for you.",
      "Discipline beats motivation every single time.",
      "Every expert was once a beginner.",
      "Great things never come from comfort zones.",
    ],
    []
  );

  const quoteOfTheDay = useMemo(() => {
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  }, [quotes]);

  return (
    <motion.div
      className="quote-section text-center text-white mb-4 rounded shadow-sm p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <FaQuoteLeft className="quote-icon mb-2" />
      <h5 className="fw-normal fst-italic">"{quoteOfTheDay}"</h5>
    </motion.div>
  );
});

export default DailyQuote;
