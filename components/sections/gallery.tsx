"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getStorageUrl } from "@/lib/supabase/storage-url";

// Fallback images
const defaultGalleryImages = [
  {
    src: getStorageUrl('couple-photos', 'qoupl_couple_01.jpg'),
    alt: "Happy couple outdoors",
    title: "Sarah & Raj",
    story: "Met through qoupl, now planning their future together"
  },
  {
    src: getStorageUrl('couple-photos', 'qoupl_couple_02.jpg'),
    alt: "Couple enjoying time together",
    title: "Priya & Arjun",
    story: "Found love in unexpected places"
  },
  {
    src: getStorageUrl('couple-photos', 'qoupl_couple_05.jpg'),
    alt: "Romantic moment",
    title: "Anjali & Vikram",
    story: "Book lovers united by their passion"
  },
  {
    src: getStorageUrl('couple-photos', 'qoupl_couple_03.jpg'),
    alt: "Couple smiling",
    title: "Neha & Karan",
    story: "Perfect match from day one"
  },
  {
    src: getStorageUrl('couple-photos', 'qoupl_couple_04.jpg'),
    alt: "Dating couple",
    title: "Maya & Rohan",
    story: "Adventure seekers finding love together"
  },
];

interface GalleryProps {
  data: Record<string, any>;
}

export default function Gallery({ data = {} }: GalleryProps) {
  // Process images from data or use defaults
  const galleryImages = data?.images?.map((item: any) => {
    let src = item.image;
    // If path includes bucket, use as is, otherwise construct URL
    if (!src.startsWith('http') && !src.startsWith('/')) {
      if (src.includes('/')) {
        const [bucket, ...rest] = src.split('/');
        src = getStorageUrl(bucket, rest.join('/'));
      } else {
        src = getStorageUrl('couple-photos', src);
      }
    }
    return {
      src,
      alt: item.alt || item.title || "Couple photo",
      title: item.title || "",
      story: item.story || ""
    };
  }) || defaultGalleryImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Heart className="h-4 w-4 fill-primary" />
            <span className="text-sm font-medium">Love Stories</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Real{" "}
            <span className="bg-[#662D91] bg-clip-text text-transparent">
              Connections
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of college student couples who found their perfect match through qoupl
          </p>
        </motion.div>

        {/* Enhanced 3D Carousel Container */}
        <div className="max-w-7xl mx-auto relative">
          <div 
            className="relative h-[550px] md:h-[650px] flex items-center justify-center"
            style={{
              perspective: '1500px',
              perspectiveOrigin: 'center center',
            }}
          >
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              {galleryImages.map((image: any, index: number) => {
                // Calculate position relative to current
                const offset = (index - currentIndex + galleryImages.length) % galleryImages.length;
                
                // Only render cards that are close to current
                if (offset > 2 && offset < galleryImages.length - 2) return null;
                
                // Determine stack position
                let x = 0;
                let z = 0;
                let rotateY = 0;
                let scale = 1;
                let opacity = 1;
                let zIndex = 0;
                
                if (offset === 0) {
                  // Center card
                  x = 0;
                  z = 0;
                  rotateY = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 50;
                } else if (offset === 1) {
                  // Right card
                  x = 200;
                  z = -200;
                  rotateY = -45;
                  scale = 0.75;
                  opacity = 0.5;
                  zIndex = 40;
                } else if (offset === 2) {
                  // Far right card
                  x = 350;
                  z = -400;
                  rotateY = -60;
                  scale = 0.6;
                  opacity = 0.3;
                  zIndex = 30;
                } else if (offset === galleryImages.length - 1) {
                  // Left card
                  x = -200;
                  z = -200;
                  rotateY = 45;
                  scale = 0.75;
                  opacity = 0.5;
                  zIndex = 40;
                } else if (offset === galleryImages.length - 2) {
                  // Far left card
                  x = -350;
                  z = -400;
                  rotateY = 60;
                  scale = 0.6;
                  opacity = 0.3;
                  zIndex = 30;
                }

                return (
                  <motion.div
                    key={index}
                    className="absolute"
                    initial={{ 
                      x: direction > 0 ? 500 : -500,
                      opacity: 0,
                      scale: 0.5,
                      rotateY: direction > 0 ? -90 : 90,
                    }}
                    animate={{
                      x,
                      scale,
                      rotateY,
                      opacity,
                      zIndex,
                      z,
                    }}
                    exit={{
                      x: direction > 0 ? -500 : 500,
                      opacity: 0,
                      scale: 0.5,
                      rotateY: direction > 0 ? 90 : -90,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      opacity: { duration: 0.4 },
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      className="relative w-[280px] md:w-[350px] lg:w-[420px] aspect-[3/4] rounded-3xl overflow-hidden"
                      style={{
                        transformStyle: 'preserve-3d',
                        boxShadow: offset === 0 
                          ? '0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(168, 85, 247, 0.4)'
                          : '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {/* Border with 3D effect */}
                      <div className={`absolute inset-0 rounded-3xl ${
                        offset === 0 
                          ? 'border-4 border-white dark:border-white/90' 
                          : 'border-2 border-white/60 dark:border-white/30'
                      }`} />

                      {/* Image */}
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 280px, (max-width: 1024px) 350px, 420px"
                        priority={index === 0}
                        style={{
                          filter: offset === 0 ? 'grayscale(0%) brightness(1)' : 'grayscale(100%) brightness(0.7)',
                          transition: 'filter 0.5s ease',
                        }}
                      />

                      {/* Gradient Overlay - Stronger on side cards */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                        style={{
                          opacity: offset === 0 ? 0.6 : 0.8,
                        }}
                      />

                      {/* Content - Only visible on center card */}
                      {offset === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 30 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10"
                        >
                          {/* Animated Heart */}
                          <motion.div
                            className="absolute top-6 right-6"
                            initial={{ scale: 0 }}
                            animate={{ 
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30">
                              <Heart className="h-7 w-7 text-white fill-white" />
                            </div>
                          </motion.div>

                          <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">{image.title}</h3>
                          <p className="text-white/95 text-base md:text-lg drop-shadow-md">{image.story}</p>
                          
                          {/* Beta User Badge */}
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#662D91]/30 to-[#662D91]/30 backdrop-blur-md border border-white/30"
                          >
                            <span className="text-sm font-semibold">Beta Success Story</span>
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Shine Effect on Center Card */}
                      {offset === 0 && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      {/* 3D Edge Highlight */}
                      <div 
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background: offset === 0 
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mt-16 relative z-30"
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-lg md:text-xl text-muted-foreground"
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
