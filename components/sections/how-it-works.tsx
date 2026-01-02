"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getStorageUrl } from "@/lib/supabase/storage-url";

interface Step {
  step: string;
  title: string;
  description: string;
  image: string;
}

// Fallback steps
const defaultSteps: Step[] = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up in seconds as a college student and create a profile that showcases the real you. Verify with your college ID, add photos, interests, and what makes you unique.\n\nOur verification process ensures a safe and authentic community where you can be yourself. Share your passions, hobbies, and what you're looking for in a meaningful connection.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_01.png"),
  },
  {
    step: "02",
    title: "Smart AI Matching",
    description:
      "Our advanced AI algorithm analyzes compatibility factors and suggests the most suitable matches for you.\n\nThe system learns from your preferences, interactions, and behavior to continuously improve match quality. Every swipe and conversation helps refine your future suggestions for better compatibility.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_03.png"),
  },
  {
    step: "03",
    title: "Start Conversations",
    description:
      "Break the ice with our conversation starters and build meaningful connections through authentic chats.\n\nEngage in genuine conversations that go beyond surface-level small talk. Our platform encourages thoughtful interactions that help you discover shared values, interests, and life goals with potential matches.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_04.png"),
  },
  {
    step: "04",
    title: "Plan Your Date",
    description:
      "Use our date planning features to find the perfect spot and make your first meeting memorable.\n\nDiscover local venues, activities, and events that match both your interests. Get suggestions for date ideas that create the perfect atmosphere for getting to know each other better.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_06.png"),
  },
  {
    step: "05",
    title: "Find True Love",
    description:
      "Build lasting relationships with people who truly understand and complement you. Your perfect match awaits!\n\nExperience the joy of finding someone who shares your values, supports your dreams, and grows with you. Join thousands of college students who have found their perfect match on qoupl.",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_07.png"),
  },
];

interface HowItWorksProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export default function HowItWorks({ data = {} }: HowItWorksProps) {
  // Process steps from data or use defaults
  const steps: Step[] = (data?.steps && Array.isArray(data.steps)) 
    ? data.steps.map((item: { step?: string; title?: string; description?: string; image?: string }) => {
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
          step: item.step ?? '',
          title: item.title ?? '',
          description: item.description ?? '',
          image: imageUrl ?? getStorageUrl("app-screenshots", "qoupl_screenshot_01.png"),
        };
      })
    : defaultSteps;
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
  }, [smoothStep, steps.length]);

  // Get the current step data
  const currentStepData = steps[currentStep];

  return (
    <section ref={containerRef} className="relative">
      {/* Scroll height for animation */}
      <div className="h-[700vh] relative">
        {/* Sticky Container - Full height minus navbar */}
        <div
          ref={stickyRef}
          className="sticky top-14 h-[calc(100vh-3.5rem)] flex items-start md:items-center justify-center overflow-y-auto md:overflow-hidden"
        >
          {/* Background with parallax */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.1]),
            }}
          />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full min-h-full flex flex-col pt-4 sm:pt-6 md:pt-12 pb-4 sm:pb-6 md:pb-8">
            {/* Header - Always visible, fixed position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 sm:mb-8 md:mb-16 lg:mb-20 xl:mb-24 flex-shrink-0"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                How{" "}
                <span className="bg-gradient-to-r from-primary to-[#662D91] bg-clip-text text-transparent">
                  qoupl
                </span>{" "}
                Works
              </h2>
            </motion.div>

            {/* Step Content - Flexible, centered with proper spacing */}
            <div className="flex-1 flex items-start md:items-center justify-center min-h-0 max-w-6xl mx-auto w-full overflow-visible">
              <div className="w-full flex items-start md:items-center py-2 sm:py-4">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-4 lg:gap-4 xl:gap-6 items-start md:items-center w-full">
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
                    <div className="relative w-[170px] sm:w-[190px] md:w-[210px] lg:w-[240px] xl:w-[260px] aspect-[9/19] mb-4 sm:mb-6 md:mb-0">
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
                        className="absolute top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#662D91] to-primary shadow-xl flex items-center justify-center z-10"
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
                    className="text-center md:text-left flex-shrink-0 w-full"
                  >
                    <motion.div
                      key={`title-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                    >
                      <div className="inline-block h-1 w-10 sm:w-12 md:w-16 bg-gradient-to-r from-[#662D91] to-primary rounded-full mb-2 sm:mb-3 md:mb-4" />
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#171717' }}>
                        {currentStepData.title}
                      </h3>
                    </motion.div>

                    <motion.div
                      key={`desc-${currentStep}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-sm sm:text-base md:text-base lg:text-[18px] leading-normal max-w-full md:max-w-md mx-auto md:mx-0 px-4 sm:px-6 md:px-0"
                      style={{ color: '#707070' }}
                    >
                      {currentStepData.description.split(/\n\n+/).filter((p: string) => p.trim().length > 0).map((paragraph: string, index: number) => (
                        <p key={index} className={`text-left font-medium ${index > 0 ? "mt-3 sm:mt-4 md:mt-4" : ""}`}>
                          {paragraph.trim()}
                        </p>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Step Indicators - Bottom aligned, always visible */}
            <motion.div
              className="flex justify-center gap-2 mt-4 sm:mt-6 md:mt-8 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {steps.map((_, index: number) => (
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
