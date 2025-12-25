"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Shield, Zap, MessageCircle, Sparkles, Check, Lock, Eye, Star, Filter, Bell, Users, MapPin, Camera, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

const featureCategories = [
  {
    id: "matching",
    title: "Smart Matching",
    icon: Sparkles,
    color: "bg-[#662D91]",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_03.png"),
    coupleImage: getStorageUrl("couple-photos", "qoupl_couple_01.jpg"),
    features: [
      { icon: Sparkles, title: "AI-Powered Algorithm", description: "Advanced compatibility analysis based on personality, interests, and values" },
      { icon: Star, title: "Compatibility Score", description: "See how well you match with potential partners before connecting" },
      { icon: Heart, title: "Learning Preferences", description: "Algorithm improves as you use the app, understanding your type better" },
      { icon: Filter, title: "Smart Filters", description: "Filter by age, location, education, lifestyle preferences and more" },
    ]
  },
  {
    id: "safety",
    title: "Safety & Trust",
    icon: Shield,
    color: "bg-[#662D91]",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_01.png"),
    coupleImage: getStorageUrl("couple-photos", "qoupl_couple_02.jpg"),
    features: [
      { icon: Camera, title: "Photo Verification", description: "Real-time selfie verification to confirm identity and get verified badge" },
      { icon: Shield, title: "College ID Verification", description: "Mandatory college ID verification to ensure all users are current college students" },
      { icon: Lock, title: "End-to-End Encryption", description: "All messages encrypted to protect your privacy" },
      { icon: Bell, title: "24/7 AI Moderation", description: "Automated and human review of content for safety" },
    ]
  },
  {
    id: "communication",
    title: "Rich Communication",
    icon: MessageCircle,
    color: "bg-[#662D91]",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_04.png"),
    coupleImage: getStorageUrl("couple-photos", "qoupl_couple_04.jpg"),
    features: [
      { icon: MessageCircle, title: "Smart Icebreakers", description: "AI-generated conversation starters tailored to each match" },
      { icon: Camera, title: "Photo & Video Sharing", description: "Share moments with your matches securely" },
      { icon: Phone, title: "Voice Messages", description: "Express yourself better with voice notes" },
      { icon: Zap, title: "Real-time Chat", description: "Instant messaging with read receipts and typing indicators" },
    ]
  },
  {
    id: "experience",
    title: "Premium Experience",
    icon: Star,
    color: "bg-[#662D91]",
    image: getStorageUrl("app-screenshots", "qoupl_screenshot_06.png"),
    coupleImage: getStorageUrl("couple-photos", "qoupl_couple_03.jpg"),
    features: [
      { icon: Eye, title: "See Who Likes You", description: "View all people who liked your profile instantly" },
      { icon: Zap, title: "Profile Boost", description: "Get more visibility by appearing at the top of search results" },
      { icon: MapPin, title: "Travel Mode", description: "Match with people in any city before you visit" },
      { icon: Heart, title: "Unlimited Likes", description: "Like as many profiles as you want without restrictions" },
    ]
  },
];

export default function Features() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("matching");

  const activeCategory = featureCategories.find(cat => cat.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Modern Split Design */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        {/* Background */}
        <div className="absolute inset-0 bg-[#662D91]/5 dark:bg-[#662D91]/10" />
        
        {/* Animated gradient mesh */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#662D91]/10 text-primary mb-6 backdrop-blur-sm border border-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Everything You Need</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Features That{" "}
                <span className="bg-[#662D91] bg-clip-text text-transparent">
                  Make Dating Better
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Discover intelligent features designed exclusively for college students to find meaningful connections 
                faster, safer, and more authentically than ever before.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Tabs */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Tab Navigation */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {featureCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      isActive
                        ? `${category.color} text-white shadow-lg`
                        : 'bg-card border-2 border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{category.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feature Content */}
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Phone Mockup */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative order-2 lg:order-1"
                  >
                    <div className="relative max-w-sm mx-auto">
                      {/* Phone Frame */}
                      <div className="relative aspect-[9/19] max-w-[320px] mx-auto">
                        {/* Glowing effect */}
                        <div className={`absolute inset-0 ${activeCategory.color} rounded-[3rem] blur-3xl opacity-30`} />
                        
                        {/* Phone container */}
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-2 shadow-2xl border border-gray-700/50">
                          {/* Screen */}
                          <div className="relative bg-white dark:bg-gray-950 rounded-[2.2rem] overflow-hidden aspect-[9/19]">
                            {/* Status bar notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[28px] bg-black rounded-b-3xl z-20" />
                            
                            {/* App screenshot */}
                            <Image
                              src={activeCategory.image}
                              alt={activeCategory.title}
                              fill
                              className="object-cover"
                              sizes="320px"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Floating couple image */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          y: [0, -10, 0],
                        }}
                        transition={{
                          opacity: { delay: 0.4 },
                          scale: { delay: 0.4 },
                          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute -right-12 -bottom-8 w-48 h-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 hidden lg:block"
                      >
                        <Image
                          src={activeCategory.coupleImage}
                          alt="Happy couple"
                          fill
                          className="object-cover"
                          sizes="192px"
                        />
                        <div className={`absolute inset-0 ${activeCategory.color} opacity-20`} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Features List */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-6 order-1 lg:order-2"
                  >
                    {activeCategory.features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                          whileHover={{ x: 8, transition: { duration: 0.2 } }}
                          className="group"
                        >
                          <div className="flex gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl ${activeCategory.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <Icon className="h-7 w-7 text-white" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                                {feature.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                              </p>
                            </div>

                            {/* Check icon */}
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full ${activeCategory.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                <Check className="h-5 w-5 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* All Features Grid - Comprehensive */}
      <section className="py-16 md:py-24 bg-[#662D91]/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              And Much{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                More
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover all the tools and features that make qoupl the best dating app for college students
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: "Location-Based", description: "Find matches near you" },
              { icon: Eye, title: "Incognito Mode", description: "Browse privately" },
              { icon: Star, title: "Super Likes", description: "Show extra interest" },
              { icon: Bell, title: "Smart Alerts", description: "Never miss a match" },
              { icon: Users, title: "Activity Status", description: "See who's online now" },
              { icon: Lock, title: "Privacy Controls", description: "Control your visibility" },
              { icon: Phone, title: "Date Planning", description: "Plan dates together" },
              { icon: Zap, title: "Instant Matching", description: "Real-time connections" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <div className="h-full bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[#662D91]" />
        
        {/* Animated overlay */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            backgroundSize: "200% 200%"
          }}
        />

        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Heart className="h-16 w-16 text-white fill-white mx-auto mb-6" />
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Experience the Future of Dating?
            </h2>

            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join our waitlist and be among the first to experience these amazing features
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => setIsWaitlistModalOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  Join the Waitlist
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </motion.button>

              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 text-white/80"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">10,000+ Waiting</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-white" />
                <span className="font-semibold">Premium Experience</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}
