"use client";

import { Heart, Users, Zap, Code, Rocket, Mail, Sparkles, Briefcase, TrendingUp, Lightbulb, Target, Award, Globe, Coffee, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Icon mapping for values
const iconMap: Record<string, LucideIcon> = {
  Heart, Users, Zap, Code, Rocket, Mail, Sparkles
};

// Icon mapping for why join items (replacing emojis)
const whyJoinIconMap: Record<string, LucideIcon> = {
  '💼': Briefcase,
  '🚀': Rocket,
  '💡': Lightbulb,
  '🎯': Target,
  '🏆': Award,
  '🌍': Globe,
  '☕': Coffee,
  '📈': TrendingUp,
  '👥': Users,
  '❤️': Heart,
  '⚡': Zap,
};

interface ValueItem {
  icon?: string
  title?: string
  description?: string
}

interface WhyJoinItem {
  icon?: string
  title?: string
  description?: string
}

interface SectionContent {
  title?: string
  subtitle?: string
  description?: string
  email?: string
  badge?: string
  contactTitle?: string
  contactDescription?: string
  footerText?: string
  values?: ValueItem[]
  items?: WhyJoinItem[]
}

interface CareersClientProps {
  data: {
    sections: Array<{
      type: string;
      content: SectionContent;
    }>;
  };
}

export default function CareersClient({ data }: CareersClientProps) {
  // Extract data from sections
  const heroSection = data.sections.find(s => s.type === 'hero');
  const comingSoonSection = data.sections.find(s => s.type === 'coming-soon');
  const valuesSection = data.sections.find(s => s.type === 'values');
  const whyJoinSection = data.sections.find(s => s.type === 'why-join');

  const heroTitle = heroSection?.content?.title;
  const heroSubtitle = heroSection?.content?.subtitle;
  const comingSoonTitle = comingSoonSection?.content?.title;
  const comingSoonDescription = comingSoonSection?.content?.description;
  const comingSoonEmail = comingSoonSection?.content?.email;
  const values = valuesSection?.content?.values ?? [];
  const whyJoin = whyJoinSection?.content?.items ?? [];

  // Process values to include icon components
  const processedValues = values.map((item: ValueItem) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] ?? Heart : Heart,
  }));

  // Process why join items to replace emojis with icons
  const processedWhyJoin = whyJoin.map((item: WhyJoinItem) => {
    const emoji = item.icon;
    const IconComponent = emoji && whyJoinIconMap[emoji] ? whyJoinIconMap[emoji] : Briefcase;
    return {
      ...item,
      iconComponent: IconComponent,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {heroSection?.content?.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 border border-primary/20 mb-6"
            >
              <Rocket className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{heroSection.content.badge}</span>
            </motion.div>
            )}

            {heroTitle && (
              <h1 className="text-fluid-6xl font-bold leading-tight mb-4 text-title">
                {heroTitle}
              </h1>
            )}

            {heroSubtitle && (
              <p className="text-fluid-lg text-paragraph leading-relaxed max-w-prose mx-auto">
                {heroSubtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-card border border-border rounded-xl p-8 md:p-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary mb-6">
              <Sparkles className="h-7 w-7 text-white" strokeWidth={1.5} />
            </div>

            {comingSoonTitle && (
              <h2 className="text-fluid-5xl font-bold leading-tight mb-4 text-title">
                {comingSoonTitle}
              </h2>
            )}

            {comingSoonDescription && (
              <p className="text-fluid-base text-paragraph leading-relaxed mb-8 max-w-prose mx-auto">
                {comingSoonDescription}
              </p>
            )}

            {comingSoonSection?.content?.contactTitle && (
            <div className="bg-muted rounded-xl p-6 mb-6">
                <h3 className="text-fluid-2xl font-bold leading-snug mb-3 text-title">{comingSoonSection.content.contactTitle}</h3>
                {comingSoonSection.content.contactDescription && (
              <p className="text-fluid-sm text-paragraph leading-relaxed mb-6">
                    {comingSoonSection.content.contactDescription}
              </p>
                )}

              {comingSoonEmail && (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a href={`mailto:${comingSoonEmail}`}>
                    <Mail className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    {comingSoonEmail}
                  </a>
                </Button>
              )}
            </div>
            )}

            {comingSoonSection?.content?.footerText && (
            <p className="text-xs text-muted-foreground">
                {comingSoonSection.content.footerText}
            </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            {valuesSection?.content?.title && (
            <h2 className="text-fluid-5xl font-bold leading-tight mb-4 text-title">
                {valuesSection.content.title}
            </h2>
            )}
            {valuesSection?.content?.description && (
            <p className="text-fluid-base text-paragraph leading-relaxed max-w-prose mx-auto">
                {valuesSection.content.description}
            </p>
            )}
          </motion.div>

          {values.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
              {processedValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="relative h-full bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-fluid-2xl font-bold leading-snug mb-2 text-title">
                      {value.title}
                    </h3>

                    <p className="text-fluid-sm text-paragraph leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            {whyJoinSection?.content?.title && (
            <h2 className="text-fluid-5xl font-bold leading-tight mb-4 text-title">
                {whyJoinSection.content.title}
            </h2>
            )}
            {whyJoinSection?.content?.description && (
              <p className="text-fluid-base text-paragraph leading-relaxed max-w-prose mx-auto">
                {whyJoinSection.content.description}
              </p>
            )}
          </motion.div>

          {processedWhyJoin.length > 0 && (
            <div className="grid md:grid-cols-3 gap-5">
              {processedWhyJoin.map((item, index) => {
                const IconComponent = item.iconComponent;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <div className="h-full bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                        <IconComponent className="h-5 w-5 text-white" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-fluid-xl font-bold leading-snug mb-2 text-title">{item.title}</h3>
                      <p className="text-fluid-sm text-paragraph leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

