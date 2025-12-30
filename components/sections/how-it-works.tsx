"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getStorageUrl } from "@/lib/supabase/storage-url";

// Fallback steps
const defaultSteps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up in seconds as a college student and create a profile that showcases the real you. Verify with your college ID, add photos, interests, and what makes you unique.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_01.png"),
  },
  {
    step: "02",
    title: "Smart AI Matching",
    description:
      "Our advanced AI algorithm analyzes compatibility factors and suggests the most suitable matches for you.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_03.png"),
  },
  {
    step: "03",
    title: "Start Conversations",
    description:
      "Break the ice with our conversation starters and build meaningful connections through authentic chats.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_04.png"),
  },
  {
    step: "04",
    title: "Plan Your Date",
    description:
      "Use our date planning features to find the perfect spot and make your first meeting memorable.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_06.png"),
  },
  {
    step: "05",
    title: "Find True Love",
    description:
      "Build lasting relationships with people who truly understand and complement you. Your perfect match awaits!",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_07.png"),
  },
];

interface HowItWorksProps {
  data: Record<string, any>;
}

export default function HowItWorks({ data = {} }: HowItWorksProps) {
  // Process steps from data or use defaults
  const steps = data?.steps?.map((item: any) => {
    let imageUrl = item.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      if (imageUrl.includes('/')) {
        const [bucket, ...rest] = imageUrl.split('/');
        imageUrl = getStorageUrl(bucket, rest.join('/'));
      } else {
        imageUrl = getStorageUrl("app-screenshots", imageUrl);
      }
    }
    return {
      step: item.step,
      title: item.title,
      description: item.description,
      image: imageUrl || getStorageUrl("app-screenshots", "qoupl_screenshot_01.png"),
    };
  }) || defaultSteps;
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
  const currentStepData = steps[currentStep];

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
          />

          <div className="container mx-auto px-4 relative z-10 w-full h-full flex flex-col pt-16 md:pt-20 pb-8 md:pb-12">
            {/* Header - Always visible, fixed position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 flex-shrink-0"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                How{" "}
                <span className="bg-gradient-to-r from-primary to-[#662D91] bg-clip-text text-transparent">
                  qoupl
                </span>{" "}
                Works
              </h2>
            </motion.div>

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
                          <Image
                            src={currentStepData.image}
                            alt={currentStepData.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 170px, (max-width: 768px) 190px, (max-width: 1024px) 210px, (max-width: 1280px) 240px, 260px"
                            priority
                          />
                        </div>

                        {/* Screen Glare */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Step Badge */}
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
              {steps.map((_: any, index: number) => (
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
