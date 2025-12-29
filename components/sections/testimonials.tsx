"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import { resolveLucideIcon } from "@/lib/utils/icons";

// No hardcoded defaults - all content must come from database

interface TestimonialsProps {
  data?: {
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    badge?: {
      icon?: string;
      text?: string;
      show?: boolean;
    };
    testimonials?: Array<{
      name: string;
      image?: string;
      imageAlt?: string;
      text: string;
      location?: string;
      rating?: number;
      date?: string;
      showRating?: boolean;
    }>;
    stats?: {
      text?: string;
      icon?: string;
      show?: boolean;
    };
    icons?: {
      quote?: string;
      heart?: string;
      rating?: string;
    };
  };
}

export default function Testimonials({ data }: TestimonialsProps = {}) {
  if (!data || !data.testimonials || !Array.isArray(data.testimonials) || data.testimonials.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Testimonials section data is missing required testimonials.')
    }
    return null
  }

  // Process testimonials from data only - no defaults
  const testimonials = data.testimonials.map(item => {
    const imageUrl = resolveStorageUrl(item.image);
    return {
      name: item.name,
      image: imageUrl,
      imageAlt: item.imageAlt || '',
      text: item.text,
      location: item.location || "",
      rating: item.rating || 0,
      date: item.date || "",
      showRating: item.showRating !== false,
    };
  });
  const BadgeIcon = resolveLucideIcon(data?.badge?.icon);
  const QuoteIcon = resolveLucideIcon(data?.icons?.quote);
  const HeartIcon = resolveLucideIcon(data?.icons?.heart);
  const RatingIcon = resolveLucideIcon(data?.icons?.rating);
  const StatsIcon = resolveLucideIcon(data?.stats?.icon);
  const showBadge = data?.badge?.show === true && (data?.badge?.text || '').length > 0;
  const showStats = data?.stats?.show === true && (data?.stats?.text || '').length > 0;
  const title = data?.title || '';
  const titleHighlight = data?.titleHighlight || '';
  const subtitle = data?.subtitle || '';

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
      {/* Animated Background Blobs */}
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
        className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
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
          {showBadge && (
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.1, type: "spring" }}
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

        {/* Testimonials Grid - Instagram Story Style */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                {testimonial.image && (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-[#662D91]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top - Quote Icon */}
                  <div className="flex justify-between items-start">
                    {QuoteIcon && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <QuoteIcon className="h-6 w-6 text-white" />
                      </motion.div>
                    )}

                    {HeartIcon && (
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <HeartIcon className="h-6 w-6 text-white fill-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom - Testimonial Details */}
                  <div className="space-y-4">
                    {/* Rating Stars */}
                    {testimonial.showRating && testimonial.rating > 0 && RatingIcon && (
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <RatingIcon
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    )}

                    {/* Quote Text */}
                    <p className="text-white text-base font-medium leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-[#662D91] rounded-full" />

                    {/* Author Info */}
                    <div>
                      <p className="text-white font-bold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-white/80 text-sm">
                        {testimonial.location}
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-3xl transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary">
              {StatsIcon && <StatsIcon className="h-5 w-5 fill-primary" />}
              <span className="font-semibold">
                {data?.stats?.text}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
