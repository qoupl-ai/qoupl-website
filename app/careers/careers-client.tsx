"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { resolveLucideIcon } from "@/lib/utils/icons";

interface CareersClientProps {
  data: {
    sections: Array<{
      type: string;
      content: any;
    }>;
  };
}

export default function CareersClient({ data }: CareersClientProps) {
  // Extract data from sections
  const heroSection = data.sections.find(s => s.type === 'hero');
  const comingSoonSection = data.sections.find(s => s.type === 'coming-soon');
  const valuesSection = data.sections.find(s => s.type === 'values');
  const whyJoinSection = data.sections.find(s => s.type === 'why-join');

  const heroContent = (heroSection?.content || {}) as Record<string, unknown>;
  const comingSoonContent = (comingSoonSection?.content || {}) as Record<string, unknown>;
  const valuesContent = (valuesSection?.content || {}) as Record<string, unknown>;
  const whyJoinContent = (whyJoinSection?.content || {}) as Record<string, unknown>;

  const heroTitle = typeof heroContent['title'] === 'string' ? heroContent['title'] : '';
  const heroTitleHighlight = typeof heroContent['titleHighlight'] === 'string' ? heroContent['titleHighlight'] : '';
  const heroSubtitle = typeof heroContent['subtitle'] === 'string' ? heroContent['subtitle'] : '';
  const heroBadge = (heroContent['badge'] || {}) as Record<string, unknown>;

  const comingSoonTitle = typeof comingSoonContent['title'] === 'string' ? comingSoonContent['title'] : '';
  const comingSoonSubtitle = typeof comingSoonContent['subtitle'] === 'string' ? comingSoonContent['subtitle'] : '';
  const comingSoonBadge = (comingSoonContent['badge'] || {}) as Record<string, unknown>;
  const comingSoonCta = (comingSoonContent['cta'] || {}) as Record<string, unknown>;
  const comingSoonCallout = (comingSoonContent['callout'] || {}) as Record<string, unknown>;
  const comingSoonFooterNote = typeof comingSoonContent['footer_note'] === 'string' ? comingSoonContent['footer_note'] : '';

  const valuesTitle = typeof valuesContent['title'] === 'string' ? valuesContent['title'] : '';
  const valuesTitleHighlight = typeof valuesContent['titleHighlight'] === 'string' ? valuesContent['titleHighlight'] : '';
  const valuesSubtitle = typeof valuesContent['subtitle'] === 'string' ? valuesContent['subtitle'] : '';
  const values = Array.isArray(valuesContent['values'])
    ? valuesContent['values'].filter((item) => (item as Record<string, unknown>)['show'] !== false)
    : [];

  const whyJoinTitle = typeof whyJoinContent['title'] === 'string' ? whyJoinContent['title'] : '';
  const whyJoinTitleHighlight = typeof whyJoinContent['titleHighlight'] === 'string' ? whyJoinContent['titleHighlight'] : '';
  const whyJoin = Array.isArray(whyJoinContent['items'])
    ? whyJoinContent['items'].filter((item) => (item as Record<string, unknown>)['show'] !== false)
    : [];

  // Process values to include icon components
  const processedValues = values.map((item: unknown) => {
    const itemObj = item as Record<string, unknown>
    const iconName = typeof itemObj['icon'] === 'string' ? itemObj['icon'] : ''
    return {
      ...itemObj,
      icon: resolveLucideIcon(iconName),
    }
  });

  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + highlight.length);
    const after = text.slice(index + highlight.length);
    return (
      <>
        {before}
        <span className="bg-[#662D91] bg-clip-text text-transparent">{match}</span>
        {after}
      </>
    );
  };

  const heroBadgeText = typeof heroBadge['text'] === 'string' ? heroBadge['text'] : '';
  const heroBadgeIconName = typeof heroBadge['icon'] === 'string' ? heroBadge['icon'] : '';
  const heroBadgeShow = heroBadge['show'] !== false && heroBadgeText.length > 0;
  const HeroBadgeIcon = resolveLucideIcon(heroBadgeIconName);

  const comingSoonBadgeIconName = typeof comingSoonBadge['icon'] === 'string' ? comingSoonBadge['icon'] : '';
  const comingSoonBadgeShow = comingSoonBadge['show'] !== false && comingSoonBadgeIconName.length > 0;
  const ComingSoonBadgeIcon = resolveLucideIcon(comingSoonBadgeIconName);

  const comingSoonCtaText = typeof comingSoonCta['text'] === 'string' ? comingSoonCta['text'] : '';
  const comingSoonCtaLink = typeof comingSoonCta['link'] === 'string' ? comingSoonCta['link'] : '';
  const comingSoonCtaShow = comingSoonCta['show'] !== false && comingSoonCtaText.length > 0;
  const comingSoonCtaIconName = typeof comingSoonCta['icon'] === 'string' ? comingSoonCta['icon'] : '';
  const ComingSoonCtaIcon = resolveLucideIcon(comingSoonCtaIconName);

  const comingSoonCalloutTitle = typeof comingSoonCallout['title'] === 'string' ? comingSoonCallout['title'] : '';
  const comingSoonCalloutDescription = typeof comingSoonCallout['description'] === 'string' ? comingSoonCallout['description'] : '';
  const comingSoonCalloutShow = comingSoonCallout['show'] !== false && (comingSoonCalloutTitle.length > 0 || comingSoonCalloutDescription.length > 0);

  if (process.env.NODE_ENV !== 'production') {
    if (!heroTitle) {
      throw new Error('Careers hero title is missing in CMS.');
    }
    if (!comingSoonTitle) {
      throw new Error('Careers coming soon title is missing in CMS.');
    }
    if (heroBadgeShow && heroBadgeIconName && !HeroBadgeIcon) {
      throw new Error('Careers hero badge icon is missing or invalid in CMS.');
    }
    if (comingSoonBadgeShow && comingSoonBadgeIconName && !ComingSoonBadgeIcon) {
      throw new Error('Careers coming soon badge icon is missing or invalid in CMS.');
    }
    if (comingSoonCtaShow && comingSoonCtaIconName && !ComingSoonCtaIcon) {
      throw new Error('Careers coming soon CTA icon is missing or invalid in CMS.');
    }
    if (comingSoonCtaShow && !comingSoonCtaLink) {
      throw new Error('Careers coming soon CTA link is missing in CMS.');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#662D91]/20 via-[#662D91]/20 to-[#662D91]/20 dark:from-[#662D91]/40 dark:via-[#662D91]/40 dark:to-[#662D91]/40" />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#662D91]/30 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {heroBadgeShow && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
              >
                {HeroBadgeIcon && <HeroBadgeIcon className="h-4 w-4" />}
                <span className="text-sm font-semibold">{heroBadgeText}</span>
              </motion.div>
            )}

            {heroTitle && (
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {renderHighlightedText(heroTitle, heroTitleHighlight)}
              </h1>
            )}

            {heroSubtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
                {heroSubtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#662D91]/20 rounded-3xl blur-xl" />

            <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 md:p-16 text-center">
              {comingSoonBadgeShow && ComingSoonBadgeIcon && (
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#662D91] mb-8">
                  <ComingSoonBadgeIcon className="h-10 w-10 text-white" />
                </div>
              )}

              {comingSoonTitle && (
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {comingSoonTitle}
                </h2>
              )}

              {comingSoonSubtitle && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {comingSoonSubtitle}
                </p>
              )}

              {comingSoonCalloutShow && (
                <div className="bg-[#662D91]/5 rounded-2xl p-8 mb-8">
                  {comingSoonCalloutTitle && (
                    <h3 className="text-2xl font-bold mb-4">{comingSoonCalloutTitle}</h3>
                  )}
                  {comingSoonCalloutDescription && (
                    <p className="text-lg text-muted-foreground mb-6">
                      {comingSoonCalloutDescription}
                    </p>
                  )}

                  {comingSoonCtaShow && comingSoonCtaLink && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={comingSoonCtaLink}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#662D91] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {ComingSoonCtaIcon && <ComingSoonCtaIcon className="h-5 w-5" />}
                        {comingSoonCtaText}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {comingSoonFooterNote && (
                <p className="text-sm text-muted-foreground">
                  {comingSoonFooterNote}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {valuesTitle && (
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {renderHighlightedText(valuesTitle, valuesTitleHighlight)}
              </h2>
            )}
            {valuesSubtitle && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {valuesSubtitle}
              </p>
            )}
          </motion.div>

          {values.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {processedValues.map((value: Record<string, unknown>, index: number) => {
              const Icon = value['icon'] as ComponentType<{ className?: string }> | undefined;
              const color = typeof value['color'] === 'string' ? value['color'] : '';
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 ${color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {Icon && <Icon className="h-7 w-7 text-white" />}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {typeof value['title'] === 'string' ? value['title'] : ''}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {typeof value['description'] === 'string' ? value['description'] : ''}
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#662D91]/10 to-[#662D91]/10" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {whyJoinTitle && (
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {renderHighlightedText(whyJoinTitle, whyJoinTitleHighlight)}
              </h2>
            )}
          </motion.div>

          {whyJoin.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">
              {whyJoin.map((item: unknown, index: number) => {
                const itemObj = item as Record<string, unknown>
                const iconName = typeof itemObj['icon'] === 'string' ? itemObj['icon'] : ''
                const ItemIcon = resolveLucideIcon(iconName)

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="text-center p-6"
                  >
                    <div className="text-5xl mb-4">
                      {ItemIcon && <ItemIcon className="h-12 w-12 mx-auto text-primary" />}
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      {typeof itemObj['title'] === 'string' ? itemObj['title'] : ''}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {typeof itemObj['description'] === 'string' ? itemObj['description'] : ''}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
