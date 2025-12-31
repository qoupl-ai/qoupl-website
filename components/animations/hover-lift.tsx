"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverLiftProps {
  children: ReactNode;
  lift?: number;
  scale?: number;
  className?: string;
}

export function HoverLift({
  children,
  lift = -8,
  scale = 1.02,
  className = "",
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: lift, scale }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
