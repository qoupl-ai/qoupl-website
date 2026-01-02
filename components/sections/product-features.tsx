"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { Heart, Shield, Zap, Check } from "lucide-react";

// Icon mapping
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Heart,
  Shield,
  Zap,
  Check,
};

// Fallback features
const defaultFeatures = [
  {
    icon: Heart,
    title: "Smart AI Matching",
    description:
      "Our advanced AI algorithm analyzes compatibility factors including personality, interests, values, and lifestyle to suggest highly compatible matches tailored just for you.",
    highlights: [
      "Deep compatibility analysis",
      "Personalized suggestions",
      "Values-based matching",
      "Learning preferences",
    ],
    image: getStorageUrl("couple-photos", "qoupl_couple_01.jpg"),
    color: "bg-[#662D91]",
  },
  {
    icon: Shield,
    title: "Safe & Verified",
    description:
      "Multi-layered verification system with mandatory college ID verification, 24/7 AI moderation, photo verification, and encrypted messaging to keep college students safe while finding love.",
    highlights: [
      "College ID verification",
      "Photo verification",
      "24/7 AI moderation",
      "Encrypted messaging",
    ],
    image: getStorageUrl("couple-photos", "qoupl_couple_02.jpg"),
    color: "bg-[#662D91]",
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description:
      "Connect with compatible matches instantly through our real-time matching system. Start meaningful conversations with smart conversation starters.",
    highlights: [
      "Real-time matching",
      "Smart conversation starters",
      "Meaningful connections",
      "Instant notifications",
    ],
    image: getStorageUrl("couple-photos", "qoupl_couple_04.jpg"),
    color: "bg-[#662D91]",
  },
];

interface ProductFeaturesProps {
  data: Record<string, any>;
}

export default function ProductFeatures({ data = {} }: ProductFeaturesProps) {
  // Process features from data
  if (!data?.features || !Array.isArray(data.features) || data.features.length === 0) {
    return null;
  }

  const features = data.features.map((item: any) => {
    const IconComponent = item.icon ? iconMap[item.icon] || Heart : Heart;
    let imageUrl = item.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      if (imageUrl.includes('/')) {
        const [bucket, ...rest] = imageUrl.split('/');
        imageUrl = getStorageUrl(bucket, rest.join('/'));
      } else {
        imageUrl = getStorageUrl("couple-photos", imageUrl);
      }
    }
    return {
      icon: IconComponent,
      title: item.title,
      description: item.description,
      highlights: item.highlights || [],
      image: imageUrl || getStorageUrl("couple-photos", "qoupl_couple_01.jpg"),
      color: item.color || "bg-[#662D91]",
    };
  });
  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      {/* Background Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-fluid-5xl leading-tight font-bold mb-4 text-title">
            {(() => {
              const title = data?.title || "Why Choose qoupl";
              const words = title.split(' ');
              return words.map((word: string, i: number) => {
                const lowerWord = word.toLowerCase();
                if (lowerWord.includes('qoupl')) {
                  return (
                    <span key={i} className="text-[#662D91] dark:text-[#9333ea]">
                      {word}{' '}
                    </span>
                  );
                }
                return <span key={i}>{word} </span>;
              });
            })()}
          </h2>
          {data?.subtitle && (
            <p className="text-fluid-base leading-relaxed text-paragraph max-w-prose mx-auto">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature: any, index: number) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group relative"
              >
                {/* Card Container */}
                <motion.div
                  className="relative h-[520px] rounded-3xl overflow-hidden cursor-pointer border border-white/10"
                  whileHover={{
                    y: -12,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index < 3}
                    />
                  </div>

                  {/* Gradient Overlay - Always Visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                  {/* Animated Border Gradient */}
                  <motion.div
                    className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />

                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top Section - Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        delay: 0.1 + index * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="flex justify-end"
                    >
                      <motion.div
                        className={`w-14 h-14 rounded-2xl ${feature.color} shadow-2xl flex items-center justify-center`}
                        whileHover={{
                          scale: 1.15,
                          rotate: 8,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                      >
                        <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </motion.div>
                    </motion.div>

                    {/* Bottom Section - Content */}
                    <motion.div className="space-y-4">
                      {/* Title - Always Visible */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
                      >
                        <h3 className="text-fluid-2xl leading-snug font-bold text-white mb-2">
                          {feature.title}
                        </h3>
                        <div className={`h-1 w-16 bg-gradient-to-r ${feature.color} rounded-full transform group-hover:w-24 transition-all duration-500`} />
                      </motion.div>

                      {/* Description - Always Visible */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                        className="text-white/90 text-fluid-base leading-relaxed max-w-prose"
                      >
                        {feature.description}
                      </motion.p>

                      {/* Highlights - Animated on View */}
                      <motion.ul
                        className="space-y-2 pt-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                      >
                        {feature.highlights.map((highlight: string, idx: number) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{
                              delay: 0.3 + index * 0.05 + idx * 0.03,
                              duration: 0.2
                            }}
                            className="flex items-center gap-2 group/item"
                          >
                            <motion.div
                              className={`w-5 h-5 rounded-full ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            </motion.div>
                            <span className="text-white/80 text-fluid-base group-hover/item:text-white transition-colors">
                              {highlight}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  </div>

                  {/* Hover Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
