"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import { resolveLucideIcon } from "@/lib/utils/icons";

// No hardcoded defaults - all content must come from database

interface ProductFeaturesProps {
  data?: {
    title?: string;
    subtitle?: string;
    showTitle?: boolean;
    showSubtitle?: boolean;
    highlightIcon?: string;
    features?: Array<{
      icon?: string;
      title: string;
      description: string;
      highlights?: string[];
      image?: string;
      imageAlt?: string;
      color?: string;
      showHighlights?: boolean;
      show?: boolean;
    }>;
  };
}

export default function ProductFeatures({ data }: ProductFeaturesProps = {}) {
  if (!data || !data.features || !Array.isArray(data.features) || data.features.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Product features section data is missing required features.')
    }
    return null
  }

  // Process features from data only - no defaults
  const features = data.features
    .filter((item) => item.show !== false)
    .map(item => {
      const IconComponent = resolveLucideIcon(item.icon);
      const imageUrl = resolveStorageUrl(item.image);
      return {
        icon: IconComponent,
        title: item.title,
        description: item.description,
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        showHighlights: item.showHighlights !== false,
        image: imageUrl,
        imageAlt: item.imageAlt || '',
        color: item.color || "",
      };
    });
  const HighlightIcon = resolveLucideIcon(data.highlightIcon);
  const showTitle = data.showTitle !== false && (data.title || '').length > 0;
  const showSubtitle = data.showSubtitle !== false && (data.subtitle || '').length > 0;
  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
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
        className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
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
          {showTitle && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {data.title}
            </h2>
          )}
          {showSubtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
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
                  className="relative h-[520px] rounded-3xl overflow-hidden shadow-xl cursor-pointer border border-white/10"
                  whileHover={{
                    y: -12,
                    boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4)",
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {feature.image && (
                      <Image
                        src={feature.image}
                        alt={feature.imageAlt}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />
                    )}
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
                      {Icon && (
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
                      )}
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
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
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
                        className="text-white/90 leading-relaxed text-sm"
                      >
                        {feature.description}
                      </motion.p>

                      {/* Highlights - Animated on View */}
                      {feature.showHighlights && feature.highlights.length > 0 && (
                        <motion.ul
                          className="space-y-2 pt-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                        >
                          {feature.highlights.map((highlight, idx) => (
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
                              {HighlightIcon && (
                                <motion.div
                                  className={`w-5 h-5 rounded-full ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <HighlightIcon className="h-3 w-3 text-white" strokeWidth={3} />
                                </motion.div>
                              )}
                              <span className="text-white/80 text-sm group-hover/item:text-white transition-colors">
                                {highlight}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
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
