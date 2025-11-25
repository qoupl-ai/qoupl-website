"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun",
    image: "/images/men/amir-esrafili-eWa7clMsowo-unsplash.jpg",
    text: "We matched on qoupl during beta testing and instantly connected. Three months later, we're inseparable!",
    location: "Mumbai, Maharashtra",
    rating: 5,
    date: "Beta User",
  },
  {
    name: "Ananya",
    image: "/images/women/rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg",
    text: "Being part of the beta program was amazing! The matching algorithm really works and I can't wait for everyone to experience it.",
    location: "Bangalore, Karnataka",
    rating: 4,
    date: "Beta User",
  },
  {
    name: "Kavya",
    image: "/images/women/caique-nascimento-Ij24Uq1sMwM-unsplash.jpg",
    text: "Found my soulmate during the beta phase. qoupl changed my life forever and I'm excited for the public launch!",
    location: "Delhi, India",
    rating: 4,
    date: "Beta User",
  },
];

export default function Testimonials() {
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Beta Users
            </span>{" "}
            Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real couples from our exclusive beta program. See how qoupl brought them together during testing.
          </p>
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
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                    <p className="text-white text-base font-medium leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full" />

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary">
            <Heart className="h-5 w-5 fill-primary" />
            <span className="font-semibold">
              Join 10,000+ people waiting for qoupl to launch
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
