"use client";

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, Users, Zap, Shield, Sparkles, Target, Eye, TrendingUp, Award, Globe, Rocket } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

const values = [
  {
    icon: Heart,
    title: "Authenticity First",
    description: "We believe in real connections built on honesty and genuine interactions.",
    color: "bg-[#662D91]"
  },
  {
    icon: Shield,
    title: "Safety & Trust",
    description: "Your safety is our priority. We create a secure environment for finding love.",
    color: "bg-[#662D91]"
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Leveraging AI and technology to make dating smarter and more meaningful.",
    color: "bg-[#662D91]"
  },
  {
    icon: Users,
    title: "College Community",
    description: "A dedicated space for college students to connect with peers who understand their journey.",
    color: "bg-[#662D91]"
  }
];

// Removed stats - app is still in development

const timeline = [
  { year: "2024", event: "qoupl Founded", description: "Started with a vision to revolutionize online dating in India" },
  { year: "2024", event: "Platform Development", description: "Building the core platform with AI-powered matching technology" },
  { year: "2025", event: "Beta Testing", description: "Preparing for beta launch with select users" },
  { year: "2025", event: "Future Plans", description: "Expanding features and preparing for global launch" }
];

export default function AboutUs() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section - Modern Bento Grid Design */}
      <section ref={heroRef} className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-[#662D91]/5 dark:bg-[#662D91]/10" />
        
        {/* Animated mesh gradient */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.15),transparent_50%)]"
        />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-6 space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#662D91]/10 text-primary backdrop-blur-sm border border-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Our Story</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Building the{" "}
                <span className="bg-[#662D91] bg-clip-text text-transparent">
                  Future
                </span>{" "}
                of Love
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                qoupl is the exclusive dating app for college students aged 18-25. Through advanced AI matching 
                and a commitment to authentic relationships, we're creating a safe, age-appropriate platform 
                where college students can find meaningful connections with their peers.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">10,000+ Waitlist</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Launching in India</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Bento Grid - Modern Image Layout */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="lg:col-span-6"
            >
              <div className="grid grid-cols-6 grid-rows-3 gap-3 md:gap-4 h-[500px] md:h-[600px]">
                {/* Large card - Top left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="col-span-4 row-span-2 relative rounded-3xl overflow-hidden shadow-xl group"
                >
                  <Image
                    src="/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg"
                    alt="Happy couple"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 70vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Small card - Top right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  <Image
                    src="/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg"
                    alt="Couple together"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 30vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#662D91]/20 to-transparent" />
                </motion.div>

                {/* Medium card - Middle right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  <Image
                    src="/images/coupl/young-couple-valentines-day-smiling-girl-hugged-smiling-guy-isolated-pink-background.jpg"
                    alt="Smiling couple"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 30vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#662D91]/20 to-transparent" />
                </motion.div>

                {/* Wide card - Bottom left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  <Image
                    src="/images/coupl/man-loving-her-wife-holding-open-book-front-bookshelf.jpg"
                    alt="Book loving couple"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 70vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent" />
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-primary rounded-3xl blur-2xl opacity-40" />
                    
                    {/* Badge */}
                    <div className="relative bg-white dark:bg-gray-900 rounded-3xl px-8 py-6 shadow-2xl border-4 border-primary/30">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="h-12 w-12 text-primary fill-primary mx-auto mb-2" />
                        </motion.div>
                        <div className="text-4xl font-bold bg-[#662D91] bg-clip-text text-transparent">
                          10,000+
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                          On Waitlist
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Redesigned */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-[#662D91]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative h-full bg-card border border-primary/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-[#662D91]/20 text-primary mb-6">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">Our Mission</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Bringing People Together
                </h2>

                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    At qoupl, we believe that college students deserve a dedicated space to find love and meaningful
                    connections. Our mission is to leverage cutting-edge AI technology to
                    match compatible college students while maintaining the authenticity and magic of
                    human connection.
                  </p>
                  <p>
                    We're committed to creating a safe, inclusive, and trustworthy platform
                    exclusively for college students aged 18-25, where they can be themselves and find their perfect match.
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Target className="h-32 w-32" />
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#662D91]/20 to-[#662D91]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative h-full bg-card border border-[#662D91]/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-[#662D91]/40 transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#662D91]/20 to-[#662D91]/20 text-[#662D91] mb-6">
                  <Eye className="h-5 w-5" />
                  <span className="font-semibold">Our Vision</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  The Future of Dating
                </h2>

                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    We envision a world where college students can find love in a safe, age-appropriate environment
                    designed specifically for their needs. Through continuous innovation and user-centric design, 
                    we're building the most trusted dating platform exclusively for college students.
                  </p>
                  <p>
                    Our vision extends beyond just matching—we want to foster lasting
                    relationships among college students that enrich their lives and create countless success stories.
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Eye className="h-32 w-32" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Values Section - Enhanced */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">What Drives Us</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Core{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at qoupl
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 ${value.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full p-8 md:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${value.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-full blur-2xl`} />

                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {value.description}
                      </p>
                    </div>

                    {/* Decorative corner element */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      <Icon className="w-full h-full" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section - Enhanced */}
      <section className="py-32 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[#662D91]/5 dark:bg-[#662D91]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />

        <div className="container mx-auto px-4 max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
            >
              <Rocket className="h-4 w-4" />
              <span className="text-sm font-semibold">Our Journey</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              From Idea to{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                Reality
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Transforming the way people connect and find love
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line - enhanced gradient */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-[#662D91] to-[#662D91] opacity-30 rounded-full" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                className={`relative flex items-center mb-16 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot - enhanced */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5, type: "spring" }}
                  className="absolute left-8 md:left-1/2 z-10"
                >
                  <div className="w-6 h-6 rounded-full bg-[#662D91] border-4 border-background transform -translate-x-1/2 shadow-lg" />
                  <div className="absolute inset-0 w-6 h-6 rounded-full bg-primary blur-lg opacity-50 transform -translate-x-1/2" />
                </motion.div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#662D91]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg overflow-hidden">
                      {/* Year badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#662D91] text-white font-bold text-sm mb-4 shadow-lg">
                        <TrendingUp className="h-4 w-4" />
                        {item.year}
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.event}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {item.description}
                      </p>

                      {/* Decorative gradient */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#662D91]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Removed emojis, added modern design */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold">What Makes Us Different</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Why Choose{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                qoupl?
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Matching",
                description: "Our advanced algorithm learns your preferences and suggests highly compatible matches.",
                icon: Sparkles,
                color: "bg-[#662D91]"
              },
              {
                title: "Verified Profiles",
                description: "Photo verification and ID checks ensure you're talking to real people.",
                icon: Shield,
                color: "bg-[#662D91]"
              },
              {
                title: "Safe & Secure",
                description: "End-to-end encryption and 24/7 moderation keep your data and conversations private.",
                icon: Shield,
                color: "bg-[#662D91]"
              },
              {
                title: "College-Exclusive Platform",
                description: "Exclusively for college students aged 18-25. Connect with peers who share your academic journey.",
                icon: Users,
                color: "bg-[#662D91]"
              },
              {
                title: "Smart Features",
                description: "Smart conversation starters, messaging tools, and date planning features make connecting easy.",
                icon: Zap,
                color: "bg-[#662D91]"
              },
              {
                title: "Love Stories",
                description: "Join thousands of couples who found love through qoupl.",
                icon: Heart,
                color: "bg-[#662D91]"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Card */}
                  <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[#662D91]" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
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
        <motion.div
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-8"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">Join Our Community</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Find Your Perfect Match?
            </h2>

            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join the exclusive dating platform for college students and find meaningful connections with your peers
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => setIsWaitlistModalOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  Join the Waitlist
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </motion.button>

              <Link href="/community-guidelines">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Learn More
                </motion.button>
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
