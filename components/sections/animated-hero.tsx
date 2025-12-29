"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart } from "lucide-react";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useState, useEffect, useRef } from "react";
import WaitlistModal from "@/components/waitlist-modal";

// Fallback images if data not provided
const defaultWomenImages = [
  getStorageUrl("hero-images", "women/qoupl_women_03.png"),
  getStorageUrl("hero-images", "women/qoupl_women_05.png"),
  getStorageUrl("hero-images", "women/qoupl_women_01.png"),
  getStorageUrl("hero-images", "women/qoupl_women_02.png"),
  getStorageUrl("hero-images", "women/qoupl_women_04.png"),
  getStorageUrl("hero-images", "women/qoupl_women_06.png"),
  getStorageUrl("hero-images", "women/qoupl_women_07.png"),
  getStorageUrl("hero-images", "women/qoupl_women_08.png"),
  getStorageUrl("hero-images", "women/qoupl_women_09.png"),
  getStorageUrl("hero-images", "women/qoupl_women_10.png"),
];

const defaultMenImages = [
  getStorageUrl("hero-images", "men/qoupl_men_01.jpg"),
  getStorageUrl("hero-images", "men/qoupl_men_02.jpg"),
  getStorageUrl("hero-images", "men/qoupl_men_03.jpg"),
  getStorageUrl("hero-images", "men/qoupl_men_04.jpg"),
  getStorageUrl("hero-images", "men/qoupl_men_05.jpg"),
  getStorageUrl("hero-images", "men/qoupl_men_06.jpg"),
];

// Modern 2025 Floating Cards with Magnetic Effect
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

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate particle positions only on client side to avoid hydration mismatch
  useEffect(() => {
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
      className="relative h-[400px] md:h-[500px] lg:h-[700px] w-full flex items-center justify-center"
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
        const radius = isMobile ? 120 : 180; // Smaller radius on mobile
        const x = Math.cos((rotation * Math.PI) / 180) * radius;
        const z = Math.sin((rotation * Math.PI) / 180) * radius;
        const y = isMobile ? 0 : Math.sin(index * 0.8) * 40; // No vertical wave on mobile

        // Magnetic effect - cards slightly follow mouse (disabled on mobile)
        const magneticX = isMobile ? 0 : mousePosition.x * 15;
        const magneticY = isMobile ? 0 : mousePosition.y * 15;

        // Scale based on Z position (closer = larger)
        const depth = (z + radius) / (2 * radius);
        const scale = isMobile ? 0.6 + depth * 0.2 : 0.7 + depth * 0.3; // Smaller cards on mobile

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
              className="relative w-[280px] h-[400px] md:w-[320px] md:h-[460px] lg:w-[360px] lg:h-[520px] rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: `
                  0 8px 32px 0 rgba(0, 0, 0, 0.37),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                  ${depth > 0.5 ? "0 0 60px rgba(168, 85, 247, 0.3)" : "0 0 30px rgba(168, 85, 247, 0.15)"}
                `,
              }}
            >
              {/* Image */}
              <Image
                src={image}
                alt={`Profile ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 240px, (max-width: 1024px) 280px, 300px"
                priority={index < 2}
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

              {/* Glow Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    "inset 0 0 20px rgba(168, 85, 247, 0.2)",
                    "inset 0 0 40px rgba(236, 72, 153, 0.3)",
                    "inset 0 0 20px rgba(168, 85, 247, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
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
  data: Record<string, any>;
}

export default function AnimatedHero({ data = {} }: AnimatedHeroProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  // Use data from props or fallback to defaults
  const title = data?.title || 'qoupl';
  const tagline = data?.tagline || 'Be couple with qoupl';
  const subtitle = data?.subtitle || 'Find your vibe. Match your energy. Connect for real.';
  const ctaText = data?.cta?.text || data?.cta?.buttonText || 'Join the Waitlist';
  const ctaSubtext = data?.cta?.subtext || '⚡ Limited spots for early access';
  const ctaBadge = data?.cta?.badge || 'Free';

  // Process images from data or use defaults
  const womenImages = data?.images?.women?.map((path: string) => {
    // If path includes bucket, use as is, otherwise construct URL
    if (path.includes('/')) {
      const [bucket, ...rest] = path.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl("hero-images", path);
  }) || defaultWomenImages;

  const menImages = data?.images?.men?.map((path: string) => {
    if (path.includes('/')) {
      const [bucket, ...rest] = path.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl("hero-images", path);
  }) || defaultMenImages;

  // Combined array: women + men images
  const carouselImages = [...womenImages, ...menImages];

  return (
    <section
      className="relative min-h-screen w-full flex flex-col overflow-hidden bg-background"
    >
      {/* Main Content - Split Layout with Better Alignment */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 relative z-10 w-full flex-1 flex items-center min-h-0">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-12 items-start lg:items-center w-full py-6 md:py-8 lg:py-12">
          {/* Left: Brand & CTA - Energetic & Fun Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-5 lg:space-y-6 order-1 lg:order-1"
          >
            {/* Brand Name - Bigger with 3D Effect */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-none font-black mb-6 md:mb-8"
              style={{
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                fontWeight: 900,
                color: "#662D91",
                letterSpacing: "-0.02em",
                textShadow: `
                  4px 4px 0px rgba(102, 45, 145, 0.2),
                  8px 8px 0px rgba(102, 45, 145, 0.15),
                  12px 12px 0px rgba(102, 45, 145, 0.1),
                  0 0 30px rgba(102, 45, 145, 0.3)
                `,
                transform: "perspective(1000px) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {title}
            </motion.h1>

            {/* Combined Taglines - Together, Small, Semi-Bold - Indented with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-1 mb-6 md:mb-8 pl-0 md:pl-4 lg:pl-8 xl:pl-12"
            >
              <p
                className="text-base md:text-lg font-semibold text-foreground leading-relaxed"
                style={{
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontWeight: 600,
                }}
              >
                {tagline.split(' ').map((word: string, i: number) => {
                  const lowerWord = word.toLowerCase();
                  if (lowerWord.includes('qoupl') || lowerWord.includes('couple')) {
                    return (
                      <span key={i} className="text-[#662D91]">
                        {word}{' '}
                      </span>
                    );
                  }
                  return <span key={i}>{word} </span>;
                })}
              </p>
              <p
                className="text-base md:text-lg font-semibold text-muted-foreground leading-relaxed"
                style={{
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
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
              className="flex flex-col items-center lg:items-start space-y-2 w-full mt-8 md:mt-10 lg:mt-12 pl-0 md:pl-4 lg:pl-8 xl:pl-12"
            >
              <Button
                size="default"
                onClick={() => setIsWaitlistModalOpen(true)}
                className="group px-6 py-3 h-auto rounded-full bg-[#662D91] hover:bg-[#7a35a8] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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
                <p className="text-xs text-muted-foreground text-center lg:text-left">
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
            className="flex items-center justify-center lg:justify-end order-2 lg:order-2 w-full mt-4 md:mt-6 lg:mt-0 lg:-mt-16"
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
