"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

// Women images from the women folder
const womenImages = [
  "/images/women/rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg",
  "/images/women/caique-nascimento-Ij24Uq1sMwM-unsplash.jpg",
  "/images/women/Gemini_Generated_Image_1hrhq01hrhq01hrh.png",
  "/images/women/Gemini_Generated_Image_34su0h34su0h34su.png",
  "/images/women/Gemini_Generated_Image_6cx31l6cx31l6cx3.png",
  "/images/women/Gemini_Generated_Image_civ506civ506civ5.png",
  "/images/women/Gemini_Generated_Image_fe6txtfe6txtfe6t.png",
  "/images/women/Gemini_Generated_Image_l957byl957byl957.png",
];

// Men images from the men folder
const menImages = [
  "/images/men/amir-esrafili-eWa7clMsowo-unsplash.jpg",
  "/images/men/arrul-lin-sYhUhse5uT8-unsplash.jpg",
  "/images/men/dollar-gill-LmtUqlYRJO4-unsplash.jpg",
  "/images/men/indian-student-goes-first-lesson.jpg",
  "/images/men/medium-shot-man-with-paperwork.jpg",
  "/images/men/mitchell-luo-ymo_yC_N_2o-unsplash.jpg",
];

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Left Half - Women with Smooth Crossfade */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden">
        {womenImages.map((image, index) => (
          <motion.div
            key={`woman-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0, 0.7, 0.7, 0, 0],
            }}
            transition={{
              duration: 3,
              delay: index * 0.4,
              repeat: Infinity,
              repeatDelay: (womenImages.length - 1) * 0.4,
              ease: "easeInOut",
            }}
          >
            <Image
              src={image}
              alt={`Woman ${index + 1}`}
              fill
              className="object-cover"
              sizes="50vw"
            />
            {/* Gradient fade to center */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white" />
            {/* Subtle color overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Right Half - Men with Smooth Crossfade */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
        {menImages.map((image, index) => (
          <motion.div
            key={`man-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0, 0.7, 0.7, 0, 0],
            }}
            transition={{
              duration: 3,
              delay: index * 0.4,
              repeat: Infinity,
              repeatDelay: (menImages.length - 1) * 0.4,
              ease: "easeInOut",
            }}
          >
            <Image
              src={image}
              alt={`Man ${index + 1}`}
              fill
              className="object-cover"
              sizes="50vw"
            />
            {/* Gradient fade to center */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white" />
            {/* Subtle color overlay */}
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Center White Fade Overlay - Creates clean separation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" style={{ width: '100%' }} />

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
              // Changed to fill from bottom to top
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

        {/* Subtle wave/ripple effect as it fills */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{
            y: `${100 - fillProgress}%`,
            opacity: fillProgress > 10 && fillProgress < 95 ? 0.4 : 0
          }}
          transition={{ duration: 0.05 }}
          className="absolute inset-0 h-8 bg-gradient-to-b from-white/40 to-transparent blur-sm"
        />

        {/* Subtle shimmer effect overlay */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{ mixBlendMode: 'overlay' }}
        />
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
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
