"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import type {
  AppDownloadSectionData,
  HeroSectionData,
  TimelineSectionData,
  ValuesSectionData,
  WhyJoinSectionData,
} from "@/types/section";

interface AboutClientProps {
  hero?: HeroSectionData;
  missionVision?: ValuesSectionData;
  values?: ValuesSectionData;
  timeline?: TimelineSectionData;
  whyJoin?: WhyJoinSectionData;
  cta?: AppDownloadSectionData;
}

const renderHighlightedTitle = (
  title: string,
  highlight: string,
  highlightClass: string
) => {
  if (!highlight) return title;
  const index = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return title;
  const before = title.slice(0, index);
  const match = title.slice(index, index + highlight.length);
  const after = title.slice(index + highlight.length);
  return (
    <>
      {before}
      <span className={highlightClass}>{match}</span>
      {after}
    </>
  );
};

export default function AboutClient({
  hero,
  missionVision,
  values,
  timeline,
  whyJoin,
  cta,
}: AboutClientProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const heroRef = useRef(null);

  const heroBadgeText = hero?.badge?.text ?? "";
  const HeroBadgeIcon = resolveLucideIcon(hero?.badge?.icon);
  const showHeroBadge = hero?.badge?.show === true && heroBadgeText.length > 0;

  const heroTitle = hero?.title ?? "";
  const heroTitleHighlight = hero?.titleHighlight ?? "";
  const heroDescription = hero?.description ?? "";
  const showHeroTitle = heroTitle.length > 0;
  const showHeroDescription = hero?.showDescription !== false && heroDescription.length > 0;

  const heroStats = Array.isArray(hero?.stats)
    ? hero.stats.filter((stat) => stat.show !== false && (stat.text ?? "").trim().length > 0)
    : [];
  const heroStatIcons = heroStats.map((stat) => resolveLucideIcon(stat.icon));

  const heroImages = Array.isArray(hero?.images?.grid) ? hero.images.grid : [];
  const heroGridImages = heroImages.slice(0, 4).map((image) => ({
    url: resolveStorageUrl(image?.image),
    alt: image?.alt || "",
  }));

  const heroFloatingValue = hero?.floatingBadge?.value ?? "";
  const heroFloatingLabel = hero?.floatingBadge?.label ?? "";
  const HeroFloatingIcon = resolveLucideIcon(hero?.floatingBadge?.icon);
  const showHeroFloating =
    hero?.floatingBadge?.show === true &&
    (heroFloatingValue.length > 0 || heroFloatingLabel.length > 0);

  const showHeroSection =
    !!hero &&
    (showHeroBadge ||
      showHeroTitle ||
      showHeroDescription ||
      heroStats.length > 0 ||
      heroGridImages.some((image) => image.url) ||
      showHeroFloating);

  if (hero && !showHeroSection && process.env.NODE_ENV !== "production") {
    throw new Error("About hero section has no visible content.");
  }

  const missionVisionItems = Array.isArray(missionVision?.values)
    ? missionVision.values
        .filter((item) => item.show !== false)
        .map((item) => {
          const label = (item.label ?? "").trim();
          const title = (item.title ?? "").trim();
          const description = (item.description ?? "").trim();
          const extraBody = Array.isArray(item.body)
            ? item.body.filter((text) => (text ?? "").trim().length > 0)
            : [];
          const paragraphs = [description, ...extraBody].filter((text) => text.length > 0);
          const LabelIcon = resolveLucideIcon(item.labelIcon);
          const DecorativeIcon = resolveLucideIcon(item.icon);
          const hasContent =
            label.length > 0 ||
            title.length > 0 ||
            paragraphs.length > 0 ||
            !!LabelIcon ||
            !!DecorativeIcon;
          return {
            label,
            title,
            paragraphs,
            LabelIcon,
            DecorativeIcon,
            hasContent,
          };
        })
        .filter((item) => item.hasContent)
    : [];

  const showMissionVisionSection = !!missionVision && missionVisionItems.length > 0;

  if (missionVision && !showMissionVisionSection && process.env.NODE_ENV !== "production") {
    throw new Error("About mission/vision section has no visible cards.");
  }

  const valuesBadgeText = values?.badge?.text ?? "";
  const ValuesBadgeIcon = resolveLucideIcon(values?.badge?.icon);
  const showValuesBadge = values?.badge?.show === true && valuesBadgeText.length > 0;

  const valuesTitle = values?.title ?? "";
  const valuesTitleHighlight = values?.titleHighlight ?? "";
  const valuesSubtitle = values?.subtitle ?? "";
  const showValuesTitle = valuesTitle.length > 0;
  const showValuesSubtitle = valuesSubtitle.length > 0;

  const valuesItems = Array.isArray(values?.values)
    ? values.values
        .filter((item) => item.show !== false)
        .map((item) => {
          const title = (item.title ?? "").trim();
          const description = (item.description ?? "").trim();
          const Icon = resolveLucideIcon(item.icon);
          const color = (item.color ?? "").trim();
          const hasContent = title.length > 0 || description.length > 0 || !!Icon;
          return {
            title,
            description,
            Icon,
            color,
            hasContent,
          };
        })
        .filter((item) => item.hasContent)
    : [];

  const showValuesSection =
    !!values &&
    (showValuesBadge || showValuesTitle || showValuesSubtitle || valuesItems.length > 0);

  if (values && !showValuesSection && process.env.NODE_ENV !== "production") {
    throw new Error("About values section has no visible content.");
  }

  const timelineBadgeText = timeline?.badge?.text ?? "";
  const TimelineBadgeIcon = resolveLucideIcon(timeline?.badge?.icon);
  const showTimelineBadge = timeline?.badge?.show === true && timelineBadgeText.length > 0;

  const timelineTitle = timeline?.title ?? "";
  const timelineTitleHighlight = timeline?.titleHighlight ?? "";
  const timelineSubtitle = timeline?.subtitle ?? "";
  const showTimelineTitle = timelineTitle.length > 0;
  const showTimelineSubtitle = timelineSubtitle.length > 0;

  const timelineItems = Array.isArray(timeline?.timeline)
    ? timeline.timeline
        .filter((item) => item.show !== false)
        .map((item) => {
          const year = (item.year ?? "").trim();
          const event = (item.event ?? "").trim();
          const description = (item.description ?? "").trim();
          const hasContent = year.length > 0 || event.length > 0 || description.length > 0;
          return {
            year,
            event,
            description,
            hasContent,
          };
        })
        .filter((item) => item.hasContent)
    : [];

  const TimelineItemIcon = resolveLucideIcon(timeline?.itemIcon);
  const showTimelineItemIcon = timeline?.showItemIcon !== false && !!TimelineItemIcon;

  const showTimelineSection =
    !!timeline &&
    (showTimelineBadge || showTimelineTitle || showTimelineSubtitle || timelineItems.length > 0);

  if (timeline && !showTimelineSection && process.env.NODE_ENV !== "production") {
    throw new Error("About timeline section has no visible content.");
  }

  const whyJoinBadgeText = whyJoin?.badge?.text ?? "";
  const WhyJoinBadgeIcon = resolveLucideIcon(whyJoin?.badge?.icon);
  const showWhyJoinBadge = whyJoin?.badge?.show === true && whyJoinBadgeText.length > 0;

  const whyJoinTitle = whyJoin?.title ?? "";
  const whyJoinTitleHighlight = whyJoin?.titleHighlight ?? "";
  const whyJoinSubtitle = whyJoin?.subtitle ?? "";
  const showWhyJoinTitle = whyJoinTitle.length > 0;
  const showWhyJoinSubtitle = whyJoinSubtitle.length > 0;

  const whyJoinItems = Array.isArray(whyJoin?.items)
    ? whyJoin.items
        .filter((item) => item.show !== false)
        .map((item) => {
          const title = (item.title ?? "").trim();
          const description = (item.description ?? "").trim();
          const Icon = resolveLucideIcon(item.icon);
          const color = (item.color ?? "").trim();
          const hasContent = title.length > 0 || description.length > 0 || !!Icon;
          return {
            title,
            description,
            Icon,
            color,
            hasContent,
          };
        })
        .filter((item) => item.hasContent)
    : [];

  const showWhyJoinSection =
    !!whyJoin &&
    (showWhyJoinBadge || showWhyJoinTitle || showWhyJoinSubtitle || whyJoinItems.length > 0);

  if (whyJoin && !showWhyJoinSection && process.env.NODE_ENV !== "production") {
    throw new Error("About why-join section has no visible content.");
  }

  const ctaBadgeText = cta?.badge?.text ?? "";
  const CtaBadgeIcon = resolveLucideIcon(cta?.badge?.icon);
  const showCtaBadge = cta?.badge?.show === true && ctaBadgeText.length > 0;

  const ctaTitle = cta?.title ?? "";
  const ctaSubtitle = cta?.subtitle ?? "";
  const showCtaTitle = ctaTitle.length > 0;
  const showCtaSubtitle = ctaSubtitle.length > 0;

  const ctaPrimaryText = cta?.cta?.text ?? "";
  const CtaPrimaryIcon = resolveLucideIcon(cta?.cta?.icon);
  const showCtaPrimary = cta?.cta?.show !== false && ctaPrimaryText.length > 0;

  const ctaSecondaryText = cta?.cta?.secondaryText ?? "";
  const ctaSecondaryLink = cta?.cta?.secondaryLink ?? "";
  const CtaSecondaryIcon = resolveLucideIcon(cta?.cta?.secondaryIcon);
  const showCtaSecondary =
    cta?.cta?.showSecondary === true &&
    ctaSecondaryText.length > 0 &&
    ctaSecondaryLink.length > 0;

  const showCtaSection =
    !!cta &&
    (showCtaBadge || showCtaTitle || showCtaSubtitle || showCtaPrimary || showCtaSecondary);

  if (cta && !showCtaSection && process.env.NODE_ENV !== "production") {
    throw new Error("About CTA section has no visible content.");
  }

  const missionVisionStyles = [
    {
      glow: "from-primary/20 to-purple-600/20",
      border: "border-primary/20",
      badge: "from-primary/20 to-purple-600/20 text-primary",
    },
    {
      glow: "from-purple-600/20 to-pink-600/20",
      border: "border-purple-600/20",
      badge: "from-purple-600/20 to-pink-600/20 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern Bento Grid Design */}
      {showHeroSection && (
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
              ease: "easeInOut",
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
                {showHeroBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary backdrop-blur-sm border border-primary/20"
                  >
                    {HeroBadgeIcon && <HeroBadgeIcon className="h-4 w-4" />}
                    <span className="text-sm font-semibold">{heroBadgeText}</span>
                  </motion.div>
                )}

                {showHeroTitle && (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    {renderHighlightedTitle(
                      heroTitle,
                      heroTitleHighlight,
                      "bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    )}
                  </h1>
                )}

                {showHeroDescription && (
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {heroDescription}
                  </p>
                )}

                {heroStats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-wrap gap-4 pt-4"
                  >
                    {heroStats.map((stat, index) => {
                      const StatIcon = heroStatIcons[index];
                      return (
                        <div
                          key={`${stat.text}-${index}`}
                          className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
                        >
                          {StatIcon && <StatIcon className="h-5 w-5 text-primary" />}
                          <span className="font-semibold text-foreground">{stat.text}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
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
                    {heroGridImages[0]?.url && (
                      <Image
                        src={heroGridImages[0].url}
                        alt={heroGridImages[0].alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 70vw, 40vw"
                      />
                    )}
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
                    {heroGridImages[1]?.url && (
                      <Image
                        src={heroGridImages[1].url}
                        alt={heroGridImages[1].alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 30vw, 20vw"
                      />
                    )}
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
                    {heroGridImages[2]?.url && (
                      <Image
                        src={heroGridImages[2].url}
                        alt={heroGridImages[2].alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 30vw, 20vw"
                      />
                    )}
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
                    {heroGridImages[3]?.url && (
                      <Image
                        src={heroGridImages[3].url}
                        alt={heroGridImages[3].alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 70vw, 40vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent" />
                  </motion.div>

                  {/* Floating badge */}
                  {showHeroFloating && (
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
                          ease: "easeInOut",
                        }}
                        className="relative"
                      >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-primary rounded-3xl blur-2xl opacity-40" />

                        {/* Badge */}
                        <div className="relative bg-white dark:bg-gray-900 rounded-3xl px-8 py-6 shadow-2xl border-4 border-primary/30">
                          <div className="text-center">
                            {HeroFloatingIcon && (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <HeroFloatingIcon className="h-12 w-12 text-primary fill-primary mx-auto mb-2" />
                              </motion.div>
                            )}
                            {heroFloatingValue && (
                              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {heroFloatingValue}
                              </div>
                            )}
                            {heroFloatingLabel && (
                              <div className="text-sm font-semibold text-muted-foreground">
                                {heroFloatingLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision - Redesigned */}
      {showMissionVisionSection && (
        <section className="py-32 bg-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

          <div className="container mx-auto px-4 max-w-7xl relative">
            <div className="grid lg:grid-cols-2 gap-16 items-stretch">
              {missionVisionItems.map((item, index) => {
                const style = missionVisionStyles[index % missionVisionStyles.length];
                return (
                  <motion.div
                    key={`${item.title}-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.2 }}
                    className="relative group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${style.glow} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}
                    />
                    <div
                      className={`relative h-full bg-card border ${style.border} rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-primary/40 transition-all duration-300`}
                    >
                      {(item.label || item.LabelIcon) && (
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${style.badge} mb-6`}
                        >
                          {item.LabelIcon && <item.LabelIcon className="h-5 w-5" />}
                          {item.label && <span className="font-semibold">{item.label}</span>}
                        </div>
                      )}

                      {item.title && (
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {item.title}
                        </h2>
                      )}

                      {item.paragraphs.length > 0 && (
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                          {item.paragraphs.map((paragraph, paragraphIndex) => (
                            <p key={`${item.title}-${paragraphIndex}`}>{paragraph}</p>
                          ))}
                        </div>
                      )}

                      {item.DecorativeIcon && (
                        <div className="absolute bottom-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                          <item.DecorativeIcon className="h-32 w-32" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Values Section - Enhanced */}
      {showValuesSection && (
        <section className="py-32 bg-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.05),transparent_50%)]" />

          <div className="container mx-auto px-4 max-w-6xl relative">
            {(showValuesBadge || showValuesTitle || showValuesSubtitle) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                {showValuesBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
                  >
                    {ValuesBadgeIcon && <ValuesBadgeIcon className="h-4 w-4" />}
                    <span className="text-sm font-semibold">{valuesBadgeText}</span>
                  </motion.div>
                )}

                {showValuesTitle && (
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    {renderHighlightedTitle(
                      valuesTitle,
                      valuesTitleHighlight,
                      "bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    )}
                  </h2>
                )}
                {showValuesSubtitle && (
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {valuesSubtitle}
                  </p>
                )}
              </motion.div>
            )}

            {valuesItems.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {valuesItems.map((value, index) => {
                  const gradientClasses = value.color ? `bg-gradient-to-br ${value.color}` : "";
                  return (
                    <motion.div
                      key={`${value.title}-${index}`}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.7 }}
                      className="group relative"
                    >
                      {/* Glow effect */}
                      {gradientClasses && (
                        <div
                          className={`absolute inset-0 ${gradientClasses} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                        />
                      )}

                      {/* Card */}
                      <motion.div
                        whileHover={{ y: -12, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full p-8 md:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
                      >
                        {/* Background gradient */}
                        {gradientClasses && (
                          <div
                            className={`absolute top-0 right-0 w-32 h-32 ${gradientClasses} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-full blur-2xl`}
                          />
                        )}

                        <div className="relative">
                          {(gradientClasses || value.Icon) && (
                            <div
                              className={`w-20 h-20 rounded-2xl ${gradientClasses} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                            >
                              {value.Icon && <value.Icon className="h-10 w-10 text-white" />}
                            </div>
                          )}

                          {value.title && (
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                              {value.title}
                            </h3>
                          )}

                          {value.description && (
                            <p className="text-muted-foreground leading-relaxed text-lg">
                              {value.description}
                            </p>
                          )}
                        </div>

                        {/* Decorative corner element */}
                        {value.Icon && (
                          <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                            <value.Icon className="w-full h-full" />
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Timeline Section - Enhanced */}
      {showTimelineSection && (
        <section className="py-32 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />

          <div className="container mx-auto px-4 max-w-5xl relative">
            {(showTimelineBadge || showTimelineTitle || showTimelineSubtitle) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                {showTimelineBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
                  >
                    {TimelineBadgeIcon && <TimelineBadgeIcon className="h-4 w-4" />}
                    <span className="text-sm font-semibold">{timelineBadgeText}</span>
                  </motion.div>
                )}

                {showTimelineTitle && (
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    {renderHighlightedTitle(
                      timelineTitle,
                      timelineTitleHighlight,
                      "bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    )}
                  </h2>
                )}
                {showTimelineSubtitle && (
                  <p className="text-xl text-muted-foreground">{timelineSubtitle}</p>
                )}
              </motion.div>
            )}

            <div className="relative">
              {/* Timeline line - enhanced gradient */}
              {timelineItems.length > 0 && (
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-30 rounded-full" />
              )}

              {timelineItems.map((item, index) => (
                <motion.div
                  key={`${item.event}-${index}`}
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
                  <div
                    className={`ml-20 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                    }`}
                  >
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
                        {(item.year || showTimelineItemIcon) && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm mb-4 shadow-lg">
                            {showTimelineItemIcon && TimelineItemIcon && (
                              <TimelineItemIcon className="h-4 w-4" />
                            )}
                            {item.year}
                          </div>
                        )}

                        {item.event && (
                          <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                            {item.event}
                          </h3>
                        )}

                        {item.description && (
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {item.description}
                          </p>
                        )}

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
      )}

      {/* Why Choose Us - Removed emojis, added modern design */}
      {showWhyJoinSection && (
        <section className="py-32 bg-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.05),transparent_50%)]" />

          <div className="container mx-auto px-4 max-w-7xl relative">
            {(showWhyJoinBadge || showWhyJoinTitle || showWhyJoinSubtitle) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                {showWhyJoinBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
                  >
                    {WhyJoinBadgeIcon && <WhyJoinBadgeIcon className="h-4 w-4" />}
                    <span className="text-sm font-semibold">{whyJoinBadgeText}</span>
                  </motion.div>
                )}

                {showWhyJoinTitle && (
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    {renderHighlightedTitle(
                      whyJoinTitle,
                      whyJoinTitleHighlight,
                      "bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    )}
                  </h2>
                )}

                {showWhyJoinSubtitle && (
                  <p className="text-xl text-muted-foreground">{whyJoinSubtitle}</p>
                )}
              </motion.div>
            )}

            {whyJoinItems.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyJoinItems.map((feature, index) => {
                  const gradientClasses = feature.color ? `bg-gradient-to-br ${feature.color}` : "";
                  return (
                    <motion.div
                      key={`${feature.title}-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, duration: 0.5 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative"
                    >
                      {/* Glow effect */}
                      {gradientClasses && (
                        <div
                          className={`absolute inset-0 ${gradientClasses} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                        />
                      )}

                      {/* Card */}
                      <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                        {(gradientClasses || feature.Icon) && (
                          <div
                            className={`w-14 h-14 rounded-xl ${gradientClasses} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                          >
                            {feature.Icon && <feature.Icon className="h-7 w-7 text-white" />}
                          </div>
                        )}

                        {feature.title && (
                          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                            {feature.title}
                          </h3>
                        )}

                        {feature.description && (
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section - Enhanced */}
      {showCtaSection && (
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
              ease: "linear",
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
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
              ease: "easeInOut",
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
              delay: 1,
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
              {showCtaBadge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-8"
                >
                  {CtaBadgeIcon && <CtaBadgeIcon className="h-4 w-4" />}
                  <span className="text-sm font-semibold">{ctaBadgeText}</span>
                </motion.div>
              )}

              {showCtaTitle && (
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {ctaTitle}
                </h2>
              )}

              {showCtaSubtitle && (
                <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
                  {ctaSubtitle}
                </p>
              )}

              {(showCtaPrimary || showCtaSecondary) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {showCtaPrimary && (
                    <motion.button
                      onClick={() => setIsWaitlistModalOpen(true)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-10 py-5 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">
                        {ctaPrimaryText}
                        {CtaPrimaryIcon && (
                          <CtaPrimaryIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        )}
                      </span>
                    </motion.button>
                  )}

                  {showCtaSecondary && (
                    <Link href={ctaSecondaryLink}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
                      >
                        <span className="flex items-center gap-2">
                          {ctaSecondaryText}
                          {CtaSecondaryIcon && <CtaSecondaryIcon className="h-5 w-5" />}
                        </span>
                      </motion.button>
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
    </div>
  );
}
