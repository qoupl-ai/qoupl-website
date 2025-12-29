"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Users } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useTheme } from "next-themes";
import WaitlistModal from "@/components/waitlist-modal";

interface ComingSoonProps {
  data?: {
    title?: string;
    subtitle?: string;
    badge?: {
      icon?: string;
      text?: string;
    };
    cta?: {
      text?: string;
    };
    platforms?: Array<{
      name: string;
      icon?: string;
      coming?: boolean;
    }>;
    stats?: {
      text?: string;
      count?: string;
    };
    screenshots?: string[];
  };
}

export default function ComingSoon({ data }: ComingSoonProps = {}) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Default to light mode during SSR to match server render
  const isDark = mounted && resolvedTheme === 'dark';

  const title = data?.title || "Get Early Access";
  const subtitle = data?.subtitle || "Join thousands of college students waiting for qoupl to launch. Be the first to experience the future of dating.";
  const ctaText = data?.cta?.text || "Join the Waitlist";

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#662D91]/5 to-background" />

      {/* Animated Gradient Orbs */}
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3 }}
              className="order-2 lg:order-1 relative z-30"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Launching Soon
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>

              {subtitle && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Join Waitlist Button */}
              <div className="mb-8">
                <Button
                  size="lg"
                  onClick={() => setIsWaitlistModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-[#662D91] hover:from-[#9333ea] hover:to-[#db2777] text-white"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {ctaText}
                </Button>
              </div>

              {/* Platform Badges */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black cursor-pointer shadow-lg"
                >
                  <div className="relative h-6 w-6 flex items-center justify-center shrink-0">
                    <Image
                      src={isDark ? "/images/brand-logo/apple-dark.png" : "/images/brand-logo/apple.png"}
                      alt="Apple logo"
                      width={24}
                      height={24}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Coming to</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black cursor-pointer shadow-lg"
                >
                  <div className="relative h-6 w-6 flex items-center justify-center shrink-0">
                    <Image
                      src={isDark ? "/images/brand-logo/android-dark.png" : "/images/brand-logo/android.png"}
                      alt="Android logo"
                      width={24}
                      height={24}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Coming to</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-semibold text-primary">10,000+</span> people already on the waitlist
                </span>
              </div>
            </motion.div>

            {/* Right Content - Phone Mockup with Floating Screenshots */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
                {/* Main Phone - Center */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-64 h-[520px] z-20"
                >
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-gray-800 dark:border-gray-700">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-3xl z-20">
                      <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full" />
                    </div>
                    {/* Purple Glow Effect */}
                    <div className="absolute inset-0 bg-[#662D91]/30 rounded-[3rem] blur-3xl scale-110 -z-10" />
                    <Image
                      src={getStorageUrl("app-screenshots", "qoupl_screenshot_01.png")}
                      alt="App Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating Screenshot 1 - Top Left */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [-5, -8, -5],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute top-8 -left-8 w-40 h-64 z-0"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Image
                      src={getStorageUrl("app-screenshots", "qoupl_screenshot_02.png")}
                      alt="App Feature"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating Screenshot 2 - Top Right */}
                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    rotate: [5, 8, 5],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute top-12 -right-8 w-40 h-64 z-0"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Image
                      src={getStorageUrl("app-screenshots", "qoupl_screenshot_03.png")}
                      alt="App Feature"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating Screenshot 3 - Bottom Left */}
                <motion.div
                  animate={{
                    y: [0, 18, 0],
                    rotate: [3, -3, 3],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                  className="absolute bottom-8 -left-12 w-40 h-64 z-0"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Image
                      src={getStorageUrl("app-screenshots", "qoupl_screenshot_04.png")}
                      alt="App Feature"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating Screenshot 4 - Bottom Right */}
                <motion.div
                  animate={{
                    y: [0, -12, 0],
                    rotate: [-4, 4, -4],
                  }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                  className="absolute bottom-12 -right-12 w-40 h-64 z-0"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Image
                      src={getStorageUrl("app-screenshots", "qoupl_screenshot_05.png")}
                      alt="App Feature"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </section>
  );
}
