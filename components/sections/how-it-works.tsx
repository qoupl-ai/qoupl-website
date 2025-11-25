"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up in seconds and create a profile that showcases the real you. Add photos, interests, and what makes you unique.",
    image: "/qoupl/1.png",
  },
  {
    step: "02",
    title: "Smart AI Matching",
    description:
      "Our advanced AI algorithm analyzes compatibility factors and suggests the most suitable matches for you.",
    image: "/qoupl/3.png",
  },
  {
    step: "03",
    title: "Start Conversations",
    description:
      "Break the ice with our conversation starters and build meaningful connections through authentic chats.",
    image: "/qoupl/4.png",
  },
  {
    step: "04",
    title: "Plan Your Date",
    description:
      "Use our date planning features to find the perfect spot and make your first meeting memorable.",
    image: "/qoupl/6.png",
  },
  {
    step: "05",
    title: "Find True Love",
    description:
      "Build lasting relationships with people who truly understand and complement you. Your perfect match awaits!",
    image: "/qoupl/7.png",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const isEven = index % 2 === 0;
  const isLastStep = index === 4; // Step 5 (index 4)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-24 lg:mb-32 max-w-6xl mx-auto ${
        isEven ? "" : "lg:flex-row-reverse"
      }`}
    >
      {/* Phone Mockup with Screenshot */}
      <motion.div
        style={{ y: isEven ? y : useTransform(y, (val) => -val) }}
        className="relative w-full lg:w-auto flex-shrink-0"
      >
        {/* Phone Frame */}
        <div className="relative mx-auto w-[300px] h-[600px]">
          {/* Phone Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-[3.5rem] blur-2xl scale-95" />

          {/* Phone Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-700/50">
            {/* Screen Container */}
            <div className="absolute inset-[3px] bg-black rounded-[2.85rem] overflow-hidden">
              {/* Status Bar Background */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/50 to-transparent z-20" />

              {/* Notch with Camera */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] bg-black rounded-b-3xl z-30 shadow-lg">
                {/* Speaker */}
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-14 h-1 bg-gray-800 rounded-full" />
                {/* Camera */}
                <div className="absolute top-[8px] left-[20px] w-3 h-3 bg-gray-900 rounded-full border border-gray-700">
                  <div className="absolute inset-[2px] bg-blue-500/20 rounded-full" />
                </div>
              </div>

              {/* Screen Content */}
              <div className="absolute inset-0 bg-white dark:bg-gray-950">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </motion.div>
              </div>

              {/* Screen Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Side Buttons */}
            {/* Volume Buttons (Left) */}
            <div className="absolute -left-[2px] top-[120px] w-[3px] h-[28px] bg-gray-800 rounded-l-sm" />
            <div className="absolute -left-[2px] top-[160px] w-[3px] h-[28px] bg-gray-800 rounded-l-sm" />

            {/* Power Button (Right) */}
            <div className="absolute -right-[2px] top-[140px] w-[3px] h-[56px] bg-gray-800 rounded-r-sm" />
          </div>

          {/* Floating Step Number */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className={`absolute -top-6 ${
              isEven ? "-right-6" : "-left-6"
            } w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-xl flex items-center justify-center z-20`}
          >
            <span className="text-2xl font-bold text-white">{step.step}</span>
          </motion.div>

          {/* Sparkle Effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute -bottom-4 ${
              isEven ? "-left-4" : "-right-4"
            } text-primary opacity-50`}
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex-1 text-center lg:text-left max-w-lg"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60px" }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="h-1 bg-gradient-to-r from-primary to-purple-600 mb-6 mx-auto lg:mx-0"
        />

        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          {step.title}
        </h3>

        <p className="text-lg text-muted-foreground leading-relaxed mx-auto lg:mx-0">
          {step.description}
        </p>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start"
        >
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Easy
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Fast
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Secure
          </span>
        </motion.div>

        {/* Get Started Button - Only on last step */}
        {isLastStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring" }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-2xl hover:shadow-primary/50 transition-shadow"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Connecting Line (Desktop Only) */}
      {index < steps.length - 1 && (
        <div
          className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-[-4rem] w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent"
        />
      )}
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      {/* Animated Background Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Simple Process</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              qoupl
            </span>{" "}
            Works
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your journey to finding true love starts here. Follow these simple
            steps and let our AI-powered platform do the magic.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
