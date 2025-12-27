"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#662D91]/5 dark:bg-[#662D91]/10" />

      {/* Background Images - Subtle */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-20 left-10 w-64 h-80 rounded-3xl overflow-hidden rotate-12">
          <Image
            src={getStorageUrl("couple-photos", "qoupl_couple_02.jpg")}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-20 right-10 w-64 h-80 rounded-3xl overflow-hidden -rotate-12">
          <Image
            src={getStorageUrl("couple-photos", "qoupl_couple_03.jpg")}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Find Your Perfect{" "}
              <span className="text-[#662D91]">
                Match
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              The exclusive dating app for college students that helps you connect with peers
              who truly matter. Built with love, designed for meaningful
              connections among college students.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button size="lg" className="text-base px-8 h-14">
                <Sparkles className="mr-2 h-5 w-5" />
                Join Waitlist
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-14">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 justify-center text-sm text-muted-foreground mb-16"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    getStorageUrl("hero-images", "women/qoupl_women_03.png"),
                    getStorageUrl("hero-images", "men/qoupl_men_01.jpg"),
                    getStorageUrl("hero-images", "women/qoupl_women_05.png"),
                    getStorageUrl("hero-images", "men/qoupl_men_02.jpg"),
                  ].map((img, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background overflow-hidden relative"
                    >
                      <Image
                        src={img}
                        alt="User"
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ))}
                </div>
                <span className="font-medium">Join 10,000+ waiting for launch</span>
              </div>
            </motion.div>

            {/* Featured Image Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {[
                getStorageUrl("couple-photos", "qoupl_couple_01.jpg"),
                getStorageUrl("couple-photos", "qoupl_couple_04.jpg"),
                getStorageUrl("couple-photos", "qoupl_couple_05.jpg"),
              ].map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl"
                >
                  <Image
                    src={img}
                    alt="Happy couple"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 25vw"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
