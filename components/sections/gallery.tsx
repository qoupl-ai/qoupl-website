"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Heart, Sparkles } from "lucide-react";

const galleryImages = [
  {
    src: "/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg",
    alt: "Happy couple outdoors",
    delay: 0,
  },
  {
    src: "/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg",
    alt: "Couple enjoying time together",
    delay: 0.15,
  },
  {
    src: "/images/coupl/man-loving-her-wife-holding-open-book-front-bookshelf.jpg",
    alt: "Romantic moment",
    delay: 0.3,
  },
  {
    src: "/images/coupl/young-couple-valentines-day-smiling-girl-hugged-smiling-guy-isolated-pink-background.jpg",
    alt: "Couple smiling",
    delay: 0.45,
  },
  {
    src: "/images/coupl/young-guy-with-packets-hugging-happy-lady-sitting-stone (1).jpg",
    alt: "Dating couple",
    delay: 0.6,
  },
  {
    src: "/images/women/Gemini_Generated_Image_34su0h34su0h34su.png",
    alt: "Love and connection",
    delay: 0.75,
  },
];

// Enhanced Gallery Card Component
function GalleryCard({ image, index, parallaxY }: { image: typeof galleryImages[0]; index: number; parallaxY: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        delay: image.delay * 0.3,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth easeOutQuad
      }}
      style={{ y: parallaxY }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900"
        whileHover={{
          y: -12,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>

          {/* Gradient Overlay - Always subtle, darker on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            animate={{
              opacity: isHovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Purple accent overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Heart Icon - Animated entrance */}
          <motion.div
            className="absolute top-6 right-6"
            initial={{ scale: 0, rotate: -90 }}
            animate={{
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? 0 : -90,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: isHovered
                  ? "0 10px 40px rgba(168, 85, 247, 0.4)"
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <Heart className="h-6 w-6 text-primary fill-primary" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Sparkles - Bottom left */}
          <motion.div
            className="absolute bottom-6 left-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? [0, 15, -15, 0] : 0,
            }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { type: "spring", stiffness: 200 },
              rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Animated border shine */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: isHovered
                ? "inset 0 0 60px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)"
                : "inset 0 0 0px rgba(168, 85, 247, 0)",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Sweeping light effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: isHovered ? ["0%", "100%"] : "-100%",
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            style={{
              transform: "skewX(-20deg)",
            }}
          />
        </div>

        {/* Bottom gradient bar - appears on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Heart className="h-4 w-4 fill-primary" />
            <span className="text-sm font-medium">Love Stories</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Real{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Connections
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of couples who found their perfect match through
            qoupl
          </p>
        </motion.div>

        {/* Enhanced Gallery with Smooth Animations */}
        <div className="max-w-6xl mx-auto">
          {/* Row 1 - 3 images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {galleryImages.slice(0, 3).map((image, index) => (
              <GalleryCard
                key={index}
                image={image}
                index={index}
                parallaxY={index % 2 === 0 ? y1 : y2}
              />
            ))}
          </div>

          {/* Row 2 - 3 images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.slice(3, 6).map((image, index) => (
              <GalleryCard
                key={index + 3}
                image={image}
                index={index + 3}
                parallaxY={index % 2 === 0 ? y2 : y1}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mt-20 relative z-30"
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-lg text-muted-foreground"
          >
            Be part of something beautiful.{" "}
            <span className="text-primary font-semibold">
              Your story could be next.
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
