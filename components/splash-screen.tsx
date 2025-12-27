"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { resolvedTheme } = useTheme();
  const [fillProgress, setFillProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Start animation after a brief moment
    const startDelay = setTimeout(() => {
      // Animate fill progress from 0 to 100 over 2.5 seconds
      const duration = 2500; // 2.5 seconds for smoother fill
      const steps = 60; // 60 frames for smooth animation
      const increment = 100 / steps;
      const interval = duration / steps;

      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          setFillProgress(100);
          clearInterval(timer);
          // Wait a bit longer before fading out to let the logo shine
          setTimeout(() => {
            onComplete();
          }, 800);
        } else {
          setFillProgress(currentProgress);
        }
      }, interval);

      return () => clearInterval(timer);
    }, 300);

    return () => clearTimeout(startDelay);
  }, [onComplete]);

  // Determine theme - default to dark if not mounted yet
  const isDark = mounted ? resolvedTheme === 'dark' : true;
  
  // Clean solid background based on theme
  const backgroundColor = isDark ? '#171717' : '#ffffff';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: backgroundColor,
      }}
    >

      {/* Logo Container - Much Bigger */}
      <div className="relative w-[600px] h-[300px] max-w-[90vw] z-10">
        {/* Base Grey Logo */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Grey version - using grayscale filter */}
          <div className={`relative w-full h-full ${isDark ? 'opacity-10' : 'opacity-25'}`}>
            <Image
              src="/images/quoupl.svg"
              alt="qoupl"
              fill
              className="object-contain"
              style={{
                filter: isDark ? 'grayscale(100%) brightness(0.3)' : 'grayscale(100%) brightness(0.6)',
              }}
              priority
            />
          </div>
        </motion.div>

        {/* Purple Filling Logo - BOTTOM TO TOP like liquid filling */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className="relative w-full h-full"
            style={{
              clipPath: `inset(${100 - fillProgress}% 0 0 0)`,
              transition: 'clip-path 0.04s ease-out',
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/quoupl.svg"
                alt="qoupl"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

    </motion.div>
  );
}
