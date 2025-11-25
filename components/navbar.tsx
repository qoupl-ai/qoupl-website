"use client";

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      // Show navbar only after user starts scrolling
      if (latest > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-background/90 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/images/quoupl.svg"
            alt="qoupl"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
