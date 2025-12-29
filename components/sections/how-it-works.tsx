"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";

// No hardcoded defaults - all content must come from database

interface HowItWorksProps {
  data?: {
    title?: string;
    titleHighlight?: string;
    showTitle?: boolean;
    steps?: Array<{
      step: string;
      title: string;
      description: string;
      image?: string;
      imageAlt?: string;
      showImage?: boolean;
      showBadge?: boolean;
    }>;
  };
}

export default function HowItWorks({ data }: HowItWorksProps = {}) {
  if (!data || !data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('How it works section data is missing required steps.')
    }
    return null
  }

  // Process steps from data only - no defaults
  const steps = data.steps.map(item => {
    const imageUrl = resolveStorageUrl(item.image);
    return {
      step: item.step,
      title: item.title,
      description: item.description,
      image: imageUrl,
      imageAlt: item.imageAlt || '',
      showImage: item.showImage !== false,
      showBadge: item.showBadge !== false,
    };
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate step with precise control - requires more scroll per step
  const stepProgress = useTransform(scrollYProgress, (progress) => {
    const totalSteps = steps.length;
    // Each step gets equal portion of scroll (1/5 = 0.2)
    // Require 50% progress into a step zone before transitioning
    const stepSize = 1 / totalSteps;
    const currentStepFloat = progress / stepSize;
    const stepIndex = Math.floor(currentStepFloat);
    
    // Only advance to next step when we're 50% through the current step zone
    // This requires more scrolling to change steps
    const progressInStep = (progress % stepSize) / stepSize;
    
    if (progressInStep >= 0.5 && stepIndex < totalSteps - 1) {
      return stepIndex + 1;
    }
    
    return Math.min(stepIndex, totalSteps - 1);
  });

  // Smooth spring animation for step transitions - slower and more controlled
  const smoothStep = useSpring(stepProgress, {
    stiffness: 40, // Lower = slower, more controlled
    damping: 35, // Higher damping = less bounce
    mass: 1.2, // Higher mass = slower response
  });

  // Update current step based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothStep.on("change", (latest) => {
      const stepIndex = Math.round(latest);
      const clampedIndex = Math.min(Math.max(stepIndex, 0), steps.length - 1);
      setCurrentStep(clampedIndex);
    });

    return () => unsubscribe();
  }, [smoothStep]);

  // Get the current step data
  const currentStepData = steps[currentStep] ?? steps[0]!;
  const showTitle = data.showTitle !== false && (data.title || '').length > 0
  const title = data.title || ''
  const titleHighlight = data.titleHighlight || ''

  const renderTitle = () => {
    if (!titleHighlight) return title
    const index = title.toLowerCase().indexOf(titleHighlight.toLowerCase())
    if (index === -1) return title
    const before = title.slice(0, index)
    const match = title.slice(index, index + titleHighlight.length)
    const after = title.slice(index + titleHighlight.length)
    return (
      <>
        {before}
        <span className="bg-gradient-to-r from-primary to-[#662D91] bg-clip-text text-transparent">
          {match}
        </span>
        {after}
      </>
    )
  }

  return (
    <section ref={containerRef} className="relative">
      {/* Scroll height for animation */}
      <div className="h-[700vh] relative">
        {/* Sticky Container - Full height minus navbar */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden"
        >
          {/* Background with parallax */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.1]),
            }}
            className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"
          />

          <div className="container mx-auto px-4 relative z-10 w-full h-full flex flex-col pt-16 md:pt-20 pb-8 md:pb-12">
            {/* Header - Always visible, fixed position */}
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 flex-shrink-0"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                  {renderTitle()}
                </h2>
              </motion.div>
            )}

            {/* Step Content - Flexible, centered with proper spacing */}
            <div className="flex-1 flex items-center justify-center min-h-0 max-w-6xl mx-auto w-full overflow-visible">
              <div className="w-full h-full flex items-center py-4">
                <div className="grid md:grid-cols-2 gap-4 md:gap-4 lg:gap-4 xl:gap-6 items-center w-full">
                  {/* Phone Preview - Left Side */}
                  <motion.div
                    key={`phone-${currentStep}`}
                    initial={{ opacity: 0, scale: 0.9, x: -30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 30 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative mx-auto md:mx-0 flex justify-center md:justify-start"
                  >
                    <div className="relative w-[170px] sm:w-[190px] md:w-[210px] lg:w-[240px] xl:w-[260px] aspect-[9/19] mb-4">
                      {/* Phone Frame */}
                      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-lg border-2 border-border/50 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-900 dark:to-gray-800">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-20">
                          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gray-800 rounded-full" />
                        </div>

                        {/* Screen */}
                        <div className="absolute inset-[2px] bg-white dark:bg-gray-950 rounded-[2.3rem] overflow-hidden">
                          {currentStepData.showImage && currentStepData.image && (
                            <Image
                              src={currentStepData.image}
                              alt={currentStepData.imageAlt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 170px, (max-width: 768px) 190px, (max-width: 1024px) 210px, (max-width: 1280px) 240px, 260px"
                              priority
                            />
                          )}
                        </div>

                        {/* Screen Glare */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Step Badge */}
                      {currentStepData.showBadge && currentStepData.step && (
                        <motion.div
                          key={`badge-${currentStep}`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#662D91] to-primary shadow-xl flex items-center justify-center z-10"
                        >
                          <span className="text-sm sm:text-base md:text-lg font-bold text-white">
                            {currentStepData.step}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Content - Right Side */}
                  <motion.div
                    key={`content-${currentStep}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-center md:text-left flex-shrink-0"
                  >
                    <motion.div
                      key={`title-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                    >
                      <div className="inline-block h-1 w-10 sm:w-12 md:w-16 bg-gradient-to-r from-[#662D91] to-primary rounded-full mb-3 md:mb-4" />
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-3">
                        {currentStepData.title}
                      </h3>
                    </motion.div>

                    <motion.p
                      key={`desc-${currentStep}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-md"
                    >
                      {currentStepData.description}
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Step Indicators - Bottom aligned, always visible */}
            <motion.div
              className="flex justify-center gap-2 mt-6 md:mt-8 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: index === currentStep ? 24 : 8,
                    backgroundColor:
                      index === currentStep
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground) / 0.3)",
                  }}
                  animate={{
                    opacity: index === currentStep ? 1 : 0.4,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
