"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Quote, Star } from "lucide-react";
import { getStorageUrl } from "@/lib/supabase/storage-url";


interface TestimonialsProps {
  data: Record<string, any>;
}

export default function Testimonials({ data = {} }: TestimonialsProps) {
  // Process testimonials from data or use defaults
  const testimonials = data?.testimonials?.map((item: any) => {
    let imageUrl = item.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      if (imageUrl.includes('/')) {
        const [bucket, ...rest] = imageUrl.split('/');
        imageUrl = getStorageUrl(bucket, rest.join('/'));
      } else {
        imageUrl = getStorageUrl("hero-images", imageUrl);
      }
    }
    return {
      name: item.name,
      image: imageUrl || getStorageUrl("hero-images", "men/qoupl_men_01.jpg"),
      text: item.text,
      location: item.location || "",
      rating: item.rating || 5,
      date: item.date || "",
    };
  }) || defaultTestimonials;
  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
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
            <span className="text-sm font-medium">Beta User Success Stories</span>
          </motion.div>

          <h2 className="text-fluid-5xl leading-tight font-bold mb-4 text-title">
            What Our{" "}
            <span className="text-[#662D91] dark:text-[#9333ea]">
              Beta Users
            </span>{" "}
            Say
          </h2>
          <p className="text-fluid-lg leading-relaxed text-paragraph max-w-2xl mx-auto">
            Real college student couples from our exclusive beta program. See how qoupl brought them together during testing.
          </p>
        </motion.div>

        {/* Testimonials Grid - Instagram Story Style */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial: any, index: number) => (
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
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-[#662D91]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top - Quote Icon */}
                  <div className="flex justify-between items-start">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Quote className="h-6 w-6 text-white" />
                    </motion.div>

                    {/* Heart Icon */}
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
                      <Heart className="h-6 w-6 text-white fill-white" />
                    </motion.div>
                  </div>

                  {/* Bottom - Testimonial Details */}
                  <div className="space-y-4">
                    {/* Rating Stars */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="text-fluid-lg leading-relaxed text-paragraph font-medium text-white">
                      "{testimonial.text}"
                    </p>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-[#662D91] rounded-full" />

                    {/* Author Info */}
                    <div>
                      <p className="text-fluid-base font-semibold text-title text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-fluid-sm text-secondary-text text-white/80">
                        {testimonial.location}
                      </p>
                      <p className="text-fluid-sm text-secondary-text text-white/60 mt-1">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mt-16"
        >
        </motion.div>
      </div>
    </section>
  );
}
