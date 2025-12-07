"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fillProgress, setFillProgress] = useState(0);

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

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 25%, #fff 50%, #fdf4ff 75%, #faf5ff 100%)',
      }}
    >
      {/* 3D Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(102, 45, 145, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 45, 145, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Diagonal lines for 3D effect */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(102, 45, 145, 0.02) 40px, rgba(102, 45, 145, 0.02) 80px),
              repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(102, 45, 145, 0.02) 40px, rgba(102, 45, 145, 0.02) 80px)
            `,
          }}
        />
      </div>

      {/* Animated floating orbs for depth */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(102, 45, 145, 0.3) 0%, transparent 70%)',
        }}
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(102, 45, 145, 0.3) 0%, transparent 70%)',
        }}
      />

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
          <div className="relative w-full h-full opacity-25">
            <Image
              src="/images/quoupl.svg"
              alt="qoupl"
              fill
              className="object-contain"
              style={{
                filter: 'grayscale(100%) brightness(0.6)',
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

      {/* Subtle glow effect behind logo when filled */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fillProgress > 50 ? 0.3 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[700px] h-[400px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(102, 45, 145, 0.15) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
