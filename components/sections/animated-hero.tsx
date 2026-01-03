"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart } from "lucide-react";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useState, useEffect, useRef } from "react";
import WaitlistModal from "@/components/waitlist-modal";


interface ModernFloatingCardsProps {
  carouselImages: string[];
}

function ModernFloatingCards({ carouselImages }: ModernFloatingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [particlePositions, setParticlePositions] = useState<Array<{ initialX: number; initialY: number; animateX: number[]; animateY: number[]; duration: number; delay: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint (1024px)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate particle positions only on client side to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const positions = Array.from({ length: 8 }, (_, i) => ({
      initialX: Math.random() * 100 - 50,
      initialY: Math.random() * 100 - 50,
      animateX: [
        Math.random() * 200 - 100,
        Math.random() * 300 - 150,
        Math.random() * 200 - 100,
      ],
      animateY: [
        Math.random() * 200 - 100,
        Math.random() * 300 - 150,
        Math.random() * 200 - 100,
      ],
      duration: 4 + Math.random() * 2,
      delay: i * 0.5,
    }));
    setParticlePositions(positions);
  }, []);

  // Mouse tracking for magnetic effect - only on desktop
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        // Check if container is in viewport
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isInViewport) {
          // Reset position when out of viewport
          setMousePosition({ x: 0, y: 0 });
          return;
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMousePosition({
          x: (e.clientX - centerX) / (rect.width / 2),
          y: (e.clientY - centerY) / (rect.height / 2),
        });
      }
    };

    const handleScroll = () => {
      // Reset mouse position on scroll to prevent stuck cards
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isInViewport) {
          setMousePosition({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Auto-rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Show 5 cards at a time in a floating formation
  const visibleCards = 5;

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] sm:h-[430px] md:h-[480px] lg:h-[580px] xl:h-[650px] 2xl:h-[720px] w-full flex items-center justify-center"
      style={{
        perspective: "1500px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* Floating Cards */}
      {carouselImages.slice(0, visibleCards).map((image, index) => {
        const baseRotation = (index * 360) / visibleCards;
        const timeOffset = activeIndex * 72; // 360 / 5 = 72 degrees per card
        const rotation = baseRotation + timeOffset;

        // Calculate position in 3D space (circular orbit)
        // Responsive radius: mobile < 640px, tablet 640-1024px, desktop > 1024px
        const radius = isMobile ? 120 : 160; // Increased radius for larger cards
        const x = Math.cos((rotation * Math.PI) / 180) * radius;
        const z = Math.sin((rotation * Math.PI) / 180) * radius;
        const y = isMobile ? 0 : Math.sin(index * 0.8) * 35; // Slightly increased vertical wave

        // Magnetic effect - cards slightly follow mouse (disabled on mobile)
        const magneticX = isMobile ? 0 : mousePosition.x * 15;
        const magneticY = isMobile ? 0 : mousePosition.y * 15;

        // Scale based on Z position (closer = larger)
        const depth = (z + radius) / (2 * radius);
        const scale = isMobile ? 0.7 + depth * 0.2 : 0.75 + depth * 0.3; // Increased base scales

        return (
          <motion.div
            key={`${image}-${index}`}
            className="absolute cursor-pointer"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              x: x + magneticX,
              y: y + magneticY,
              z: z,
              rotateY: rotation + 90,
              scale: scale,
              opacity: 0.85 + depth * 0.15,
            }}
            transition={{
              x: { type: "spring", stiffness: 50, damping: 15 },
              y: { type: "spring", stiffness: 50, damping: 15 },
              z: { type: "spring", stiffness: 50, damping: 15 },
              rotateY: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
              scale: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 1.2 },
            }}
            whileHover={{
              scale: scale * 1.1,
              z: z + 50,
              transition: { duration: 0.3 },
            }}
            onClick={() => setActiveIndex(index)}
            style={{
              transformStyle: "preserve-3d",
              zIndex: Math.round(z + radius),
            }}
          >
            {/* Modern Glass Card */}
            <div
              className="relative w-[280px] h-[380px] sm:w-[300px] sm:h-[410px] md:w-[340px] md:h-[460px] lg:w-[380px] lg:h-[520px] xl:w-[400px] xl:h-[550px] 2xl:w-[420px] 2xl:h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: `
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset
                `,
              }}
            >
              {/* Image */}
              <Image
                src={image}
                alt={`Profile ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 380px, (max-width: 1280px) 400px, 420px"
                quality={85}
                priority={index < 2}
                loading={index < 2 ? undefined : "lazy"}
              />

              {/* Modern Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Holographic Shimmer Effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(
                    135deg,
                    rgba(168, 85, 247, 0.3) 0%,
                    rgba(236, 72, 153, 0.3) 50%,
                    rgba(168, 85, 247, 0.3) 100%
                  )`,
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />


              {/* Heart Badge - Only on front card */}
              {depth > 0.7 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2.5 shadow-xl border border-white/30"
                >
                  <Heart className="w-5 h-5 text-white fill-white" />
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Floating Particles - Only render after mount to avoid hydration mismatch */}
      {isMounted && particlePositions.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute pointer-events-none"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: 0,
          }}
          animate={{
            x: particle.animateX,
            y: particle.animateY,
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        >
          <Heart className="w-3 h-3 text-primary/30 fill-primary/30" />
        </motion.div>
      ))}
    </div>
  );
}


interface AnimatedHeroProps {
  data?: {
    title?: string;
    tagline?: string;
    subtitle?: string;
    cta?: {
      text?: string;
      buttonText?: string;
      subtext?: string;
      badge?: string;
    };
    images?: {
      women?: string[];
      men?: string[];
    };
  };
}

export default function AnimatedHero({ data = {} }: AnimatedHeroProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const title = data?.title || '';
  const tagline = data?.tagline || '';
  const subtitle = data?.subtitle || '';
  const ctaText = data?.cta?.text || data?.cta?.buttonText || '';
  const ctaSubtext = data?.cta?.subtext || '';
  const ctaBadge = data?.cta?.badge || '';

  // Process images from data or use defaults
  const womenImages = data?.images?.women?.map((path: string) => {
    // If path includes bucket, use as is, otherwise construct URL
    if (path.includes('/')) {
      const [bucket, ...rest] = path.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl("hero-images", path);
  }) || [];

  const menImages = data?.images?.men?.map((path: string) => {
    if (path.includes('/')) {
      const [bucket, ...rest] = path.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl("hero-images", path);
  }) || [];

  // Combined array: women + men images
  const carouselImages = [...womenImages, ...menImages];

  return (
    <section
      className="relative min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-screen w-full flex flex-col overflow-hidden bg-background"
    >
      {/* Main Content - Split Layout with Better Alignment */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10 w-full flex-1 flex items-center min-h-0">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 2xl:gap-24 items-start lg:items-center w-full py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
          {/* Left: Brand & CTA - Energetic & Fun Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-5 lg:space-y-6 order-1 lg:order-1 relative z-30 lg:pr-4 xl:pr-6"
          >
            {/* Brand Name - Clean & Simple */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="leading-none font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-[#662D91] dark:text-[#9333ea] text-[clamp(6.5rem,7vw+1rem,7.5rem)] sm:text-[clamp(7rem,8vw+1rem,8.5rem)] md:text-[clamp(7.5rem,9vw+1rem,9rem)] lg:text-[clamp(9rem,10vw+1rem,10.5rem)] xl:text-[12rem] 2xl:text-[14rem]"
              style={{
                fontFamily: "var(--font-qoupl), system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </motion.h1>

            {/* Combined Taglines - Together, Small, Semi-Bold - Indented with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-1 sm:space-y-1.5 mb-4 sm:mb-5 md:mb-6 lg:mb-8 pl-0 sm:pl-2 md:pl-4 lg:pl-6 xl:pl-8 2xl:pl-12 relative z-30"
            >
              <p
                className="text-fluid-lg font-semibold text-title leading-relaxed"
                style={{
                  fontFamily: "var(--font-qoupl), system-ui, sans-serif",
                  fontWeight: 600,
                }}
              >
                {tagline.split(' ').map((word: string, i: number) => {
                  const lowerWord = word.toLowerCase();
                  if (lowerWord.includes('qoupl') || lowerWord.includes('couple')) {
                    return (
                      <span key={i} className="text-primary">
                        {word}{' '}
                      </span>
                    );
                  }
                  return <span key={i}>{word} </span>;
                })}
              </p>
              <p
                className="text-fluid-base sm:text-fluid-lg font-semibold text-paragraph leading-relaxed max-w-prose"
                style={{
                  fontFamily: "var(--font-qoupl), system-ui, sans-serif",
                  fontWeight: 600,
                }}
              >
                {subtitle}
              </p>
            </motion.div>

            {/* CTA Button - Smaller Size - Indented with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col items-center lg:items-start space-y-2 w-full mt-6 sm:mt-7 md:mt-8 lg:mt-10 xl:mt-12 pl-0 sm:pl-2 md:pl-4 lg:pl-6 xl:pl-8 2xl:pl-12 relative z-30"
            >
              <Button
                size="default"
                onClick={() => setIsWaitlistModalOpen(true)}
                className="group px-6 bg-[#662D91] hover:bg-[#7a35a8] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {ctaText}
                {ctaBadge && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {ctaBadge}
                  </span>
                )}
              </Button>
              {ctaSubtext && (
                <p className="text-xs text-paragraph text-center lg:text-left">
                  {ctaSubtext}
                </p>
              )}
            </motion.div>

          </motion.div>

          {/* Right: Modern Floating Cards - Swapped to Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center lg:justify-end order-2 lg:order-2 w-full mt-6 sm:mt-8 md:mt-10 lg:mt-0 relative z-10 lg:pl-4 xl:pl-6"
          >
            <ModernFloatingCards carouselImages={carouselImages} />
          </motion.div>
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
