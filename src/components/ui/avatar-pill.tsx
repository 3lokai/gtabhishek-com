"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  label?: string;
  alt?: string;
  wave?: string; // emoji
};

export function AvatarWavePill({
  src,
  label = "GT Abhishek",
  alt = "GT Abhishek",
  wave = "👋",
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/90 shadow-lg ring-1 ring-white/10 backdrop-blur"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* avatar */}
      <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/15">
        <Image
          alt={alt}
          className="h-8 w-8 object-cover"
          height={32}
          priority
          src={src}
          width={32}
        />
      </span>
      <span className="font-medium text-sm">{label}</span>

      {/* waving emoji that peeks in from the left edge over the avatar */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            animate={{
              x: -2, // sits slightly over the avatar edge
              opacity: 1,
              scale: 1,
              rotate: [0, 18, -10, 12, -6, 0],
            }}
            aria-hidden
            className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-1 text-2xl"
            exit={{ x: -18, opacity: 0, scale: 0.9 }}
            initial={{ x: -18, opacity: 0, scale: 0.9 }}
            key="wave"
            transition={{
              x: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
              opacity: {
                duration: 0.2,
              },
              scale: {
                duration: 0.2,
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 0.8,
                ease: "easeInOut",
              },
            }}
          >
            {wave}
          </motion.span>
        )}
      </AnimatePresence>

      {/* soft highlight on hover */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0 }}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-white/10"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
    </motion.button>
  );
}
