"use client";

import Link from "next/link";
import { Heart, Users, Zap, Shield, Sparkles, Target, Eye, TrendingUp, Globe, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useRef, useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import { Button } from "@/components/ui/button";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
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

interface HeroSection {
  badge?: string;
  title?: string;
  description?: string;
  locationBadge?: { flag?: string; text?: string };
  images?: string[];
}

interface MissionVisionSection {
  mission?: { badge?: string; title?: string; content?: string[] };
  vision?: { badge?: string; title?: string; content?: string[] };
}

interface WhyChooseUsSection {
  badge?: string;
  title?: string;
  features?: Array<{ icon?: string; title: string; description: string }>;
}

interface CTASection {
  badge?: string;
  title?: string;
  description?: string;
  buttons?: Array<{ text: string; type: string; href?: string }>;
}

type SectionContent = HeroSection | MissionVisionSection | ValueItem[] | WhyChooseUsSection | CTASection | TimelineItem[] | Record<string, unknown>

interface AboutClientProps {
  data: {
    sections: Array<{
      type: string
      content: SectionContent
    }>
  }
}

export default function AboutClient({ data }: AboutClientProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const heroRef = useRef(null);

  // Extract data from sections
  const heroSection = data.sections.find(s => s.type === 'hero');
  const valuesSection = data.sections.find(s => s.type === 'values');
  const timelineSection = data.sections.find(s => s.type === 'timeline');
  const missionVisionSection = data.sections.find(s => s.type === 'mission-vision');

  const hero: HeroSection = (heroSection?.content as HeroSection) || {};
  const values = (valuesSection?.content as { values?: ValueItem[] })?.values || [];
  const timeline = (timelineSection?.content as { timeline?: TimelineItem[] })?.timeline || [];
  const missionVision: MissionVisionSection = (missionVisionSection?.content as MissionVisionSection) || {};
        'We\'re committed to creating a safe, inclusive, and trustworthy platform where people can be themselves and find their perfect match.',
      ],
    },
    vision: {
      badge: 'Our Vision',
      title: 'The Future of Dating',
      content: [
        'We envision a world where finding love is accessible, safe, and enjoyable for everyone, regardless of their background or location. Through continuous innovation and user-centric design, we\'re building the world\'s most trusted dating platform.',
        'Our vision extends beyond just matching—we want to foster lasting relationships that enrich lives and create countless success stories.',
      ],
    },
  };


  // Process values to include icon components
  type ProcessedValue = {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    description: string;
  };

  const processedValues: ProcessedValue[] = (values as ValueItem[]).map((item) => ({
    title: item.title,
    description: item.description,
    icon: item.icon ? iconMap[item.icon] || Heart : Heart,
  }));

  // Process hero images
  const heroImages = (hero.images || []).map((path) => {
    if (path.startsWith('http') || path.startsWith('/')) return path;
    if (path.includes('/')) {
      const [bucket, ...rest] = path.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl('couple-photos', path);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern Image Gallery Design */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16">

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="text-xs font-medium">{hero.badge || 'Our Story'}</span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {hero.title || 'Building the Future of Love'}
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {hero.description || 'qoupl is revolutionizing how people connect. Through advanced AI matching and a commitment to authentic relationships, we\'re creating a platform where meaningful connections happen naturally.'}
              </p>

              {hero.locationBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap gap-3 pt-2"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#662D91]/10 border border-[#662D91]/20">
                    <span className="text-lg leading-none">{hero.locationBadge.flag || '🇮🇳'}</span>
                    <span className="text-sm font-medium text-foreground">{hero.locationBadge.text || 'Launching in India'}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Side - Modern Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {/* Large Image - Top Left */}
                {heroImages[0] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    className="col-span-2 row-span-2 relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group"
                  >
                    <Image
                      src={heroImages[0]}
                      alt="Happy couple"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                )}

                {/* Small Image - Bottom Left */}
                {heroImages[1] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg group"
                  >
                    <Image
                      src={heroImages[1]}
                      alt="Couple together"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </motion.div>
                )}

                {/* Small Image - Bottom Right */}
                {heroImages[2] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg group"
                  >
                    <Image
                      src={heroImages[2]}
                      alt="Smiling couple"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Modern Clean Design */}
      <section className="py-16 md:py-20 bg-background relative overflow-hidden">

        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="relative h-full bg-card border border-border rounded-xl p-6 md:p-8 hover:border-[#662D91] transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20 mb-4">
                  <Target className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-xs font-medium">{missionVision.mission?.badge || 'Our Mission'}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {missionVision.mission?.title || 'Bringing People Together'}
                </h2>

                <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {missionVision.mission?.content?.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
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
              <div className="relative h-full bg-card border border-border rounded-xl p-6 md:p-8 hover:border-[#662D91] transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20 mb-4">
                  <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-xs font-medium">{missionVision.vision?.badge || 'Our Vision'}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {missionVision.vision?.title || 'The Future of Dating'}
                </h2>

                <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {missionVision.vision?.content?.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Modern Clean Design */}
      <section className="py-16 md:py-20 bg-background relative overflow-hidden">

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20 mb-4"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-xs font-medium">What Drives Us</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Our Core{" "}
              <span className="text-[#662D91]">
                Values
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at qoupl
            </p>
          </motion.div>

          {values.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
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
                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full p-6 rounded-xl bg-card border border-border hover:border-[#662D91] transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                      </div>

                      <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-[#662D91] transition-colors duration-300">
                        {value.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section - Modern Vertical Timeline */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-background">

        <div className="container mx-auto px-4 max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20 mb-4"
            >
              <Rocket className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-xs font-medium">Our Journey</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              From Idea to{" "}
              <span className="text-[#662D91]">
                Reality
              </span>
            </h2>
            <p className="text-base text-muted-foreground">
              Transforming the way people connect and find love
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Modern Vertical Timeline */}
            {timeline.length > 0 && (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />
                
                {/* Timeline items */}
                {timeline.map((item: TimelineItem, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="relative pl-16 md:pl-20 pb-10 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-6 top-1.5 z-10">
                      <div className="w-3 h-3 rounded-full bg-[#662D91] border-2 border-background" />
                    </div>

                    {/* Year badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#662D91] text-white font-semibold text-xs">
                        <TrendingUp className="h-3 w-3" strokeWidth={1.5} />
                        {item.year}
                      </span>
                    </div>

                    {/* Content card */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-card border border-border rounded-lg p-5 hover:border-[#662D91] transition-all duration-300"
                    >
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">
                        {item.event}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern Clean Design */}
      <section className="py-16 md:py-20 bg-background relative overflow-hidden">

        <div className="container mx-auto px-4 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20 mb-4"
            >
              <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-xs font-medium">What Makes Us Different</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Why Choose{" "}
              <span className="text-[#662D91]">
                qoupl?
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "AI-Powered Matching",
                description: "Our advanced algorithm learns your preferences and suggests highly compatible matches.",
                icon: Sparkles
              },
              {
                title: "Verified Profiles",
                description: "Photo verification and ID checks ensure you're talking to real people.",
                icon: Shield
              },
              {
                title: "Safe & Secure",
                description: "End-to-end encryption and 24/7 moderation keep your data and conversations private.",
                icon: Shield
              },
              {
                title: "Inclusive Platform",
                description: "Everyone is welcome. We celebrate diversity and promote inclusivity.",
                icon: Users
              },
              {
                title: "Smart Features",
                description: "Smart conversation starters, messaging tools, and date planning features make connecting easy.",
                icon: Zap
              },
              {
                title: "Love Stories",
                description: "Join thousands of couples who found love through qoupl.",
                icon: Heart
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
                  {/* Card */}
                  <div className="relative h-full bg-card border border-border rounded-lg p-5 hover:border-[#662D91] transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-base font-bold mb-2 group-hover:text-[#662D91] transition-colors duration-300">
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

      {/* CTA Section - Modern Clean Design */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-[#662D91]">

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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-white mb-6"
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-xs font-medium">Join Our Community</span>
            </motion.div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Find Your Perfect Match?
            </h2>

            <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Be part of the next generation of dating and find meaningful connections
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  onClick={() => setIsWaitlistModalOpen(true)}
                  className="bg-white text-primary hover:bg-white/90 hover:text-primary font-semibold shadow-2xl hover:shadow-white/20"
                >
                  <span className="flex items-center gap-2">
                    Join the Waitlist
                    <Heart className="h-4 w-4" />
                  </span>
                </Button>
              </motion.div>

              <Link href="/community-guidelines">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
                  >
                    Learn More
                  </Button>
                </motion.div>
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
