"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import { resolveLucideIcon } from "@/lib/utils/icons";

// No hardcoded defaults - all content must come from database

interface GalleryProps {
  data?: {
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    badge?: {
      icon?: string;
      text?: string;
      show?: boolean;
    };
    images?: Array<{
      image: string;
      alt?: string;
      title?: string;
      story?: string;
    }>;
    cta?: {
      text?: string;
      highlight?: string;
      show?: boolean;
    };
    successBadge?: {
      text?: string;
      show?: boolean;
    };
    icons?: {
      badge?: string;
      story?: string;
    };
  };
}

export default function Gallery({ data }: GalleryProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const galleryImages = (data?.images && Array.isArray(data.images) && data.images.length > 0)
    ? data.images.map(item => {
        const src = resolveStorageUrl(item.image);
        return {
          src,
          alt: item.alt || "",
          title: item.title || "",
          story: item.story || ""
        };
      }).filter(item => item.src.length > 0)
    : [];

  // Auto-play carousel
  useEffect(() => {
    if (galleryImages.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(timer);
  }, [currentIndex, galleryImages.length]);

  if (galleryImages.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Gallery section data is missing required images.')
    }
    return null
  }

  const BadgeIcon = resolveLucideIcon(data?.badge?.icon || data?.icons?.badge)
  const StoryIcon = resolveLucideIcon(data?.icons?.story)
  const showBadge = data?.badge?.show === true && (data.badge?.text || '').length > 0
  const showCta = data?.cta?.show === true && (data.cta?.text || '').length > 0
  const showSuccessBadge = data?.successBadge?.show === true && (data.successBadge?.text || '').length > 0
  const title = data?.title || ''
  const titleHighlight = data?.titleHighlight || ''
  const subtitle = data?.subtitle || ''

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
        <span className="bg-[#662D91] bg-clip-text text-transparent">{match}</span>
        {after}
      </>
    )
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
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
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#662D91]/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {showBadge && (
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              {BadgeIcon && <BadgeIcon className="h-4 w-4 fill-primary" />}
              <span className="text-sm font-medium">{data?.badge?.text}</span>
            </motion.div>
          )}

          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {renderTitle()}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
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
              {galleryImages.map((image, index) => {
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
                          {StoryIcon && (
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
                                <StoryIcon className="h-7 w-7 text-white fill-white" />
                              </div>
                            </motion.div>
                          )}

                          <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">{image.title}</h3>
                          <p className="text-white/95 text-base md:text-lg drop-shadow-md">{image.story}</p>
                          
                          {/* Beta User Badge */}
                          {showSuccessBadge && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#662D91]/30 to-[#662D91]/30 backdrop-blur-md border border-white/30"
                            >
                              <span className="text-sm font-semibold">{data?.successBadge?.text}</span>
                            </motion.div>
                          )}
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

        {showCta && (
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
              {data?.cta?.text}{" "}
              {data?.cta?.highlight && (
                <span className="text-primary font-semibold">
                  {data?.cta?.highlight}
                </span>
              )}
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
