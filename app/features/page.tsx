"use client";

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, Shield, Zap, Users, MessageCircle, Lightbulb, MapPin, Sparkles, Check, Lock, Eye, Star, Filter, Bell, Phone, Camera } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

const mainFeatures = [
  {
    icon: Sparkles,
    title: "AI-Powered Smart Matching",
    description: "Our advanced AI algorithm analyzes personality traits, interests, values, and behavior to suggest highly compatible matches tailored just for you.",
    features: ["Compatibility score", "Personalized suggestions", "Learning algorithm", "Values-based matching"],
    color: "from-pink-500 to-rose-500",
    image: "/ethan-robertson-gWzGqPw2ODY-unsplash.jpg"
  },
  {
    icon: Shield,
    title: "Safety & Verification",
    description: "Multi-layered security with photo verification, AI moderation, and 24/7 human review to ensure a safe dating environment.",
    features: ["Photo verification", "ID verification", "AI content moderation", "Background checks"],
    color: "from-purple-500 to-indigo-500",
    image: "/albert-dera-ILip77SbmOE-unsplash.jpg"
  },
  {
    icon: MessageCircle,
    title: "Smart Communication",
    description: "AI-powered conversation starters, ice breakers, and real-time translation to help you connect meaningfully.",
    features: ["Conversation starters", "Voice messages", "GIF & stickers", "Real-time translation"],
    color: "from-violet-500 to-purple-500",
    image: "/andre-sebastian-3_I3GXWldEw-unsplash.jpg"
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Get personalized dating tips, profile insights, and compatibility analysis to improve your dating experience.",
    features: ["Profile strength score", "Dating insights", "Compatibility tips", "Activity analytics"],
    color: "from-blue-500 to-cyan-500",
    image: "/anthony-tran-LMcvt8Rew4c-unsplash.jpg"
  }
];

const additionalFeatures = [
  { icon: Filter, title: "Advanced Filters", description: "Filter by age, location, education, lifestyle, and more" },
  { icon: MapPin, title: "Location-Based", description: "Find matches near you with adjustable distance settings" },
  { icon: Lock, title: "Privacy Controls", description: "Control who sees your profile and what information is visible" },
  { icon: Eye, title: "Incognito Mode", description: "Browse profiles privately without appearing in search" },
  { icon: Star, title: "Super Likes", description: "Stand out by showing extra interest to potential matches" },
  { icon: Bell, title: "Smart Notifications", description: "Get notified about new matches, messages, and profile views" },
  { icon: Heart, title: "Unlimited Likes", description: "Like as many profiles as you want with premium" },
  { icon: Users, title: "See Who Likes You", description: "Know who's interested before you swipe" },
  { icon: Phone, title: "Date Planning", description: "Built-in tools to plan and coordinate your first date" },
  { icon: Camera, title: "Photo Sharing", description: "Share moments through photos securely with your matches" },
  { icon: Zap, title: "Boost Your Profile", description: "Get more visibility and appear at the top of search results" },
  { icon: Check, title: "Read Receipts", description: "Know when your messages have been read" }
];

const premiumFeatures = [
  "Unlimited likes and super likes",
  "See who liked you before matching",
  "Advanced filters for precise matching",
  "Rewind last swipe if you change your mind",
  "5 Super Likes per day",
  "1 Boost per month to increase visibility",
  "Incognito mode for private browsing",
  "Ad-free experience",
  "Priority customer support",
  "Travel mode to match anywhere in the world",
  "Read receipts on messages",
  "Extended profile with more photos"
];

const safetyFeatures = [
  { icon: Shield, title: "Photo Verification", description: "Verify your identity with a real-time selfie to get a verified badge" },
  { icon: Eye, title: "Profile Moderation", description: "AI and human reviewers check all profiles for authenticity and safety" },
  { icon: Lock, title: "Encrypted Messaging", description: "End-to-end encryption keeps your conversations private" },
  { icon: Bell, title: "Instant Reporting", description: "Report suspicious behavior with one tap, reviewed within 24 hours" },
  { icon: Phone, title: "Emergency SOS", description: "Quick access to emergency contacts and safety resources" },
  { icon: Users, title: "Block & Unmatch", description: "Control who can see and contact you at any time" }
];

export default function Features() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Powerful{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Everything you need to find meaningful connections, all in one beautifully designed app.
            </p>
          </motion.div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </section>

      {/* Main Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Core{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets human connection
            </p>
          </motion.div>

          <div className="space-y-24">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="lg:w-1/2">
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 space-y-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              More Amazing{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Your Safety First</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Safety{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of protection to keep you safe while dating
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Star className="h-5 w-5 fill-primary" />
              <span className="font-semibold">qoupl Plus</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Premium{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upgrade to qoupl Plus for the ultimate dating experience
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => setIsWaitlistModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Join Waitlist
              </button>
              <p className="mt-4 text-sm text-muted-foreground">
                Be among the first to access premium features
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the waitlist today and be the first to experience the future of dating
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsWaitlistModalOpen(true)}
                className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all duration-300"
              >
                Join Waitlist
              </button>
              <Link
                href="/community-guidelines"
                className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold text-lg hover:bg-primary/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
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
