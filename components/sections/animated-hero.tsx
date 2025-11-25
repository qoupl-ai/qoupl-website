"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import WaitlistModal from "@/components/waitlist-modal";

export default function AnimatedHero() {
  const [animationStage, setAnimationStage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showThemeToggle, setShowThemeToggle] = useState(true);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  useEffect(() => {
    // Stage 0: Cards float in (0-0.4s)
    const timer1 = setTimeout(() => setAnimationStage(1), 400);
    // Stage 1: Cards settle (0.4-0.6s)
    const timer2 = setTimeout(() => setAnimationStage(2), 600);
    // Stage 2: Text appears (0.6-0.8s)
    const timer3 = setTimeout(() => setAnimationStage(3), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    // Hide theme toggle when navbar appears (after scrolling 50px)
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowThemeToggle(false);
      } else {
        setShowThemeToggle(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePosition({
      x: (clientX - centerX) / 50,
      y: (clientY - centerY) / 50,
    });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FFF5F7] dark:bg-[#0F0A1A]"
      onMouseMove={handleMouseMove}
    >
      {/* Modern Gradient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs - Light Mode */}
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-70 dark:opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 129, 0.4) 0%, rgba(255, 107, 129, 0) 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-60 dark:opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(165, 89, 209, 0.4) 0%, rgba(165, 89, 209, 0) 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full opacity-50 dark:opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(255, 154, 141, 0.35) 0%, rgba(255, 154, 141, 0) 70%)',
            filter: 'blur(70px)',
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Animated Gradient Orbs - Dark Mode */}
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-0 dark:opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(233, 30, 99, 0.3) 0%, rgba(233, 30, 99, 0) 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-0 dark:opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(156, 39, 176, 0.35) 0%, rgba(156, 39, 176, 0) 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full opacity-0 dark:opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(103, 58, 183, 0.3) 0%, rgba(103, 58, 183, 0) 70%)',
            filter: 'blur(90px)',
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      {/* Theme Toggle - Fixed in top right, hides when navbar appears */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showThemeToggle ? 1 : 0,
          scale: showThemeToggle ? 1 : 0,
          y: showThemeToggle ? 0 : -20
        }}
        transition={{
          delay: showThemeToggle ? 0.3 : 0,
          type: "spring",
          stiffness: 200
        }}
        className="fixed top-6 right-6 z-50"
      >
        <ThemeToggle />
      </motion.div>

      {/* Premium Glassmorphism Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationStage >= 2 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Main Glass Layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          }}
          animate={{
            background: [
              'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
              'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)',
              'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glass Reflection Light - Top */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8) 50%, transparent)',
          }}
        />

        {/* Glass Reflection Light - Left */}
        <div
          className="absolute top-0 left-0 bottom-0 w-px opacity-30"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.6) 50%, transparent)',
          }}
        />

        {/* Ambient Color Overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, rgba(255, 107, 129, 0.15), transparent 60%), radial-gradient(circle at 70% 60%, rgba(165, 89, 209, 0.12), transparent 60%)',
              'radial-gradient(circle at 35% 45%, rgba(255, 107, 129, 0.12), transparent 60%), radial-gradient(circle at 65% 55%, rgba(165, 89, 209, 0.15), transparent 60%)',
              'radial-gradient(circle at 30% 40%, rgba(255, 107, 129, 0.15), transparent 60%), radial-gradient(circle at 70% 60%, rgba(165, 89, 209, 0.12), transparent 60%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Dark Mode Glass Override */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-white/0 dark:from-white/8 dark:to-white/0" />
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatePresence>
            {animationStage >= 2 && (
              <>
                {/* Brand Name with Indian Theme */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="mb-8"
                >
                  <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold mb-4 relative">
                    <span
                      className="relative inline-block text-[#a855f7] dark:text-[#c084fc]"
                      style={{
                        filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.25))',
                      }}
                    >
                      qoupl
                    </span>
                  </h1>

                  {/* Animated Hearts */}
                  <div className="flex justify-center gap-2 mb-6">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.1 + i * 0.05,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <Heart className="h-8 w-8 text-primary fill-primary" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-xl md:text-2xl lg:text-3xl mb-10 font-bold"
                >
                  <span className="text-gray-800 dark:text-gray-200">Be </span>
                  <span className="text-[#a855f7] dark:text-[#c084fc]">couple</span>
                  <span className="text-gray-800 dark:text-gray-200"> with </span>
                  <span className="text-[#a855f7] dark:text-[#c084fc]">qoupl</span>
                </motion.p>

                {/* CTA Button - Redesigned */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-col items-center justify-center"
                >
                  <Button
                    size="lg"
                    onClick={() => setIsWaitlistModalOpen(true)}
                    className="text-base px-8 py-4 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 transform hover:scale-105"
                  >
                    <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                    Join the Waitlist
                    <span className="ml-2 text-xs bg-white/20 px-2.5 py-0.5 rounded-full">
                      Free
                    </span>
                  </Button>
                  <p className="mt-3 text-sm text-foreground/50">
                    ⚡ Limited spots available for early access
                  </p>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[
                        "/images/women/rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg",
                        "/images/men/amir-esrafili-eWa7clMsowo-unsplash.jpg",
                        "/images/women/caique-nascimento-Ij24Uq1sMwM-unsplash.jpg",
                        "/images/men/arrul-lin-sYhUhse5uT8-unsplash.jpg",
                      ].map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                          className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative"
                        >
                          <Image
                            src={img}
                            alt="User"
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="font-semibold text-base">
                      10,000+ Waiting for Launch
                    </span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Particles */}
      {animationStage >= 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
              }}
              animate={{
                y: -100,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            >
              <Heart
                className="text-primary/20"
                size={Math.random() * 15 + 10}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </section>
  );
}
