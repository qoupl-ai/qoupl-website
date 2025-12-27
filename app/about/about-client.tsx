"use client";

import Link from "next/link";
import { Heart, Users, Zap, Shield, Sparkles, Target, Eye, TrendingUp, Globe, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useRef, useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Shield, Sparkles, Users, Zap, Target, Eye, TrendingUp, Globe, Rocket
};

interface ValueItem {
  icon?: string;
  title: string;
  description: string;
  color?: string;
}

interface TimelineItem {
  year: string;
  event: string;
  description: string;
}

interface AboutClientProps {
  data: {
    sections: Array<{
      type: string;
      content: {
        values?: ValueItem[];
        timeline?: TimelineItem[];
      };
    }>;
  };
}

export default function AboutClient({ data }: AboutClientProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const heroRef = useRef(null);

  // Extract data from sections
  const valuesSection = data.sections.find(s => s.type === 'values');
  const timelineSection = data.sections.find(s => s.type === 'timeline');
  
  const values = valuesSection?.content?.values || [];
  const timeline = timelineSection?.content?.timeline || [];

  // Process values to include icon components and ensure gradient colors
  type ProcessedValue = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
  };
  
  const processedValues: ProcessedValue[] = (values as ValueItem[]).map((item) => ({
    title: item.title,
    description: item.description,
    icon: item.icon ? iconMap[item.icon] || Heart : Heart,
    color: item.color || (item.color?.startsWith('from-') ? item.color : 'from-pink-500 to-rose-500'),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern Bento Grid Design */}
      <section ref={heroRef} className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F7] via-purple-50/50 to-pink-50/30 dark:from-[#0F0A1A] dark:via-purple-950/30 dark:to-pink-950/20" />
        
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary backdrop-blur-sm border border-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Our Story</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Building the{" "}
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Future
                </span>{" "}
                of Love
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                qoupl is revolutionizing how people connect. Through advanced AI matching 
                and a commitment to authentic relationships, we&apos;re creating a platform 
                where meaningful connections happen naturally.
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
                    src={getStorageUrl("couple-photos", "qoupl_couple_01.jpg")}
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
                    src={getStorageUrl("couple-photos", "qoupl_couple_02.jpg")}
                    alt="Couple together"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 30vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent" />
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
                    src={getStorageUrl("couple-photos", "qoupl_couple_03.jpg")}
                    alt="Smiling couple"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 30vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent" />
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
                    src={getStorageUrl("couple-photos", "qoupl_couple_04.jpg")}
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
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative h-full bg-card border border-primary/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 text-primary mb-6">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">Our Mission</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Bringing People Together
                </h2>

                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    At qoupl, we believe that everyone deserves to find love and meaningful
                    connections. Our mission is to leverage cutting-edge AI technology to
                    match compatible people while maintaining the authenticity and magic of
                    human connection.
                  </p>
                  <p>
                    We&apos;re committed to creating a safe, inclusive, and trustworthy platform
                    where people can be themselves and find their perfect match.
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
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative h-full bg-card border border-purple-600/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-purple-600/40 transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-600 mb-6">
                  <Eye className="h-5 w-5" />
                  <span className="font-semibold">Our Vision</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  The Future of Dating
                </h2>

                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    We envision a world where finding love is accessible, safe, and enjoyable
                    for everyone, regardless of their background or location. Through
                    continuous innovation and user-centric design, we&apos;re building the
                    world&apos;s most trusted dating platform.
                  </p>
                  <p>
                    Our vision extends beyond just matching—we want to foster lasting
                    relationships that enrich lives and create countless success stories.
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
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at qoupl
            </p>
          </motion.div>

          {values.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {processedValues.map((value, index) => {
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full p-8 md:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-full blur-2xl`} />

                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
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
          )}
        </div>
      </section>

      {/* Timeline Section - Enhanced */}
      <section className="py-32 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20" />
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
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Reality
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Transforming the way people connect and find love
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line - enhanced gradient */}
            {timeline.length > 0 && (
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-30 rounded-full" />
            )}

            {timeline.length > 0 && timeline.map((item: TimelineItem, index: number) => (
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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 border-4 border-background transform -translate-x-1/2 shadow-lg" />
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
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg overflow-hidden">
                      {/* Year badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm mb-4 shadow-lg">
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
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                color: "from-purple-500 to-indigo-500"
              },
              {
                title: "Verified Profiles",
                description: "Photo verification and ID checks ensure you're talking to real people.",
                icon: Shield,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Safe & Secure",
                description: "End-to-end encryption and 24/7 moderation keep your data and conversations private.",
                icon: Shield,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Inclusive Platform",
                description: "Everyone is welcome. We celebrate diversity and promote inclusivity.",
                icon: Users,
                color: "from-pink-500 to-rose-500"
              },
              {
                title: "Smart Features",
                description: "Smart conversation starters, messaging tools, and date planning features make connecting easy.",
                icon: Zap,
                color: "from-orange-500 to-amber-500"
              },
              {
                title: "Love Stories",
                description: "Join thousands of couples who found love through qoupl.",
                icon: Heart,
                color: "from-red-500 to-pink-500"
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Card */}
                  <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600" />
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
              Be part of the next generation of dating and find meaningful connections
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

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}
