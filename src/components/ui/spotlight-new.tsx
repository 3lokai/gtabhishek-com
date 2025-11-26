"use client";

import { motion } from "motion/react";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export const Spotlight = ({
  gradientFirst,
  gradientSecond,
  gradientThird,
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  // Use theme colors with color-mix for gradients
  // Primary (indigo) for main spotlight, accent (lilac) for subtle highlights
  const defaultGradientFirst =
    "radial-gradient(68.54% 68.72% at 55.02% 31.46%, color-mix(in oklch, var(--primary) 8%, transparent) 0, color-mix(in oklch, var(--primary) 2%, transparent) 50%, transparent 80%)";
  const defaultGradientSecond =
    "radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--accent) 6%, transparent) 0, color-mix(in oklch, var(--primary) 2%, transparent) 80%, transparent 100%)";
  const defaultGradientThird =
    "radial-gradient(50% 50% at 50% 50%, color-mix(in oklch, var(--accent) 4%, transparent) 0, color-mix(in oklch, var(--primary) 2%, transparent) 80%, transparent 100%)";

  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      className="pointer-events-none absolute inset-0 h-full w-full"
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 1.5,
      }}
    >
      <motion.div
        animate={{
          x: [0, xOffset, 0],
        }}
        className="pointer-events-none absolute top-0 left-0 z-40 h-screen w-screen"
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst ?? defaultGradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
        />

        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond ?? defaultGradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
        />

        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird ?? defaultGradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [0, -xOffset, 0],
        }}
        className="pointer-events-none absolute top-0 right-0 z-40 h-screen w-screen"
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <div
          className="absolute top-0 right-0"
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst ?? defaultGradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
        />

        <div
          className="absolute top-0 right-0 origin-top-right"
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond ?? defaultGradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
        />

        <div
          className="absolute top-0 right-0 origin-top-right"
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird ?? defaultGradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
        />
      </motion.div>
    </motion.div>
  );
};
