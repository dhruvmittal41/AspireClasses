import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import "./ParallaxBackground.css";

// --- Define all the floating elements here ---
// Velocities (vx, vy) have been reduced for a slower, calmer animation.
const initialItems = [
  {
    id: "e-mc2",
    x: 200,
    y: 180,
    vx: 0.15,
    vy: -0.15,
    w: 230,
    h: 60,
    component: (
      <svg viewBox="0 0 230 60">
        <text x="0" y="50" fontSize="60" fill="#0d47a1" fontFamily="monospace">
          E = mc²
        </text>
      </svg>
    ),
  },
  {
    id: "sum-f-ma",
    x: 1400,
    y: 300,
    vx: -0.1,
    vy: 0.1,
    w: 250,
    h: 55,
    component: (
      <svg viewBox="0 0 250 55">
        <text x="0" y="45" fontSize="55" fill="#1e40af" fontFamily="monospace">
          ∑ F = ma
        </text>
      </svg>
    ),
  },
  {
    id: "integral",
    x: 800,
    y: 600,
    vx: 0.1,
    vy: -0.15,
    w: 230,
    h: 45,
    component: (
      <svg viewBox="0 0 230 45">
        <text x="0" y="40" fontSize="45" fill="#1d3557" fontFamily="monospace">
          ∫ f(x) dx
        </text>
      </svg>
    ),
  },
  {
    id: "ohms-law",
    x: 300,
    y: 850,
    vx: -0.15,
    vy: -0.1,
    w: 200,
    h: 50,
    component: (
      <svg viewBox="0 0 200 50">
        <text x="0" y="40" fontSize="50" fill="#0f172a" fontFamily="monospace">
          ΔV = IR
        </text>
      </svg>
    ),
  },
  {
    id: "pythagorean",
    x: 1100,
    y: 400,
    vx: 0.05,
    vy: 0.1,
    w: 300,
    h: 60,
    component: (
      <svg viewBox="0 0 300 60">
        <text x="0" y="50" fontSize="60" fill="#2563eb" fontFamily="monospace">
          a² + b² = c²
        </text>
      </svg>
    ),
  },
  {
    id: "maxwell",
    x: 1000,
    y: 950,
    vx: -0.1,
    vy: -0.15,
    w: 280,
    h: 50,
    component: (
      <svg viewBox="0 0 280 50">
        <text x="0" y="40" fontSize="50" fill="#1e3a8a" fontFamily="monospace">
          ∇ · E = ρ/ε₀
        </text>
      </svg>
    ),
  },
  // --- NEW: Globe Vector ---
  {
    id: "globe",
    x: 1450,
    y: 150,
    vx: -0.05,
    vy: 0.08,
    w: 140,
    h: 140,
    component: (
      <svg viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r="68"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
        />
        <path
          d="M2,70 A68,68 0 0,0 138,70"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <path
          d="M70,2 A68,68 0 0,1 70,138"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  // --- NEW: Triangle Vector ---
  {
    id: "triangle",
    x: 150,
    y: 600,
    vx: 0.08,
    vy: -0.05,
    w: 100,
    h: 100,
    component: (
      <svg viewBox="0 0 100 100">
        <polygon
          points="50,10 90,90 10,90"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="3"
        />
      </svg>
    ),
  },
];

const ParallaxBackground = () => {
  const [items, setItems] = useState(initialItems);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;

    const updateAnimation = () => {
      const { width: containerWidth, height: containerHeight } =
        container.getBoundingClientRect();

      setItems((currentItems) => {
        const nextItems = currentItems.map((item) => ({ ...item }));

        nextItems.forEach((item) => {
          item.x += item.vx;
          item.y += item.vy;

          if (item.x <= 0 || item.x + item.w >= containerWidth) {
            item.vx *= -1;
            item.x = Math.max(0, Math.min(item.x, containerWidth - item.w));
          }
          if (item.y <= 0 || item.y + item.h >= containerHeight) {
            item.vy *= -1;
            item.y = Math.max(0, Math.min(item.y, containerHeight - item.h));
          }
        });

        for (let i = 0; i < nextItems.length; i++) {
          for (let j = i + 1; j < nextItems.length; j++) {
            const itemA = nextItems[i];
            const itemB = nextItems[j];

            if (
              itemA.x < itemB.x + itemB.w &&
              itemA.x + itemA.w > itemB.x &&
              itemA.y < itemB.y + itemB.h &&
              itemA.y + itemA.h > itemB.y
            ) {
              [itemA.vx, itemB.vx] = [itemB.vx, itemA.vx];
              [itemA.vy, itemB.vy] = [itemB.vy, itemA.vy];
            }
          }
        }
        return nextItems;
      });

      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    animationFrameId = requestAnimationFrame(updateAnimation);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="parallax-container" ref={containerRef}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="floating-item"
          initial={{ x: item.x, y: item.y }}
          animate={{ x: item.x, y: item.y }}
          transition={{ type: "tween", ease: "linear" }}
          style={{ width: item.w, height: item.h }}
        >
          {item.component}
        </motion.div>
      ))}
    </div>
  );
};

export default ParallaxBackground;
