"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import type { FeatureCategorySectionData } from "@/types/section";

interface FeaturesClientProps {
  data?: FeatureCategorySectionData;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function FeaturesClient({ data }: FeaturesClientProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  if (!data || !Array.isArray(data.features) || data.features.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Feature category section data is missing required categories.");
    }
    return null;
  }

  const categories = data.features
    .filter((category) => category.show !== false && category.title)
    .map((category, index) => {
      const icon = resolveLucideIcon(category.icon);
      const imageUrl = resolveStorageUrl(category.image);
      const featureItems = Array.isArray(category.features)
        ? category.features.filter((item) => item.show !== false)
        : [];

      return {
        id: slugify(category.title) || `category-${index}`,
        title: category.title,
        icon,
        color: category.color || "",
        image: imageUrl,
        imageAlt: category.imageAlt || "",
        features: featureItems.map((item) => ({
          title: item.title,
          description: item.description,
          icon: resolveLucideIcon(item.icon),
        })),
      };
    });

  if (categories.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Feature category section data has no visible categories.");
    }
    return null;
  }

  useEffect(() => {
    if (!activeTab && categories[0]?.id) {
      setActiveTab(categories[0].id);
    }
  }, [activeTab, categories]);
  const activeCategory = categories.find((category) => category.id === activeTab) || categories[0];

  const heroTitle = data.hero?.title || "";
  const heroTitleHighlight = data.hero?.titleHighlight || "";
  const heroSubtitle = data.hero?.subtitle || "";
  const showHeroTitle = data.hero?.showTitle !== false && heroTitle.length > 0;
  const showHeroSubtitle = data.hero?.showSubtitle !== false && heroSubtitle.length > 0;

  const ctaTitle = data.cta?.title || "";
  const ctaSubtitle = data.cta?.subtitle || "";
  const ctaButtonText = data.cta?.buttonText || "";
  const showCta =
    data.cta?.show !== false &&
    (ctaTitle.length > 0 || ctaSubtitle.length > 0 || ctaButtonText.length > 0);

  const renderHeroTitle = () => {
    if (!heroTitleHighlight) return heroTitle;
    const index = heroTitle.toLowerCase().indexOf(heroTitleHighlight.toLowerCase());
    if (index === -1) return heroTitle;
    const before = heroTitle.slice(0, index);
    const match = heroTitle.slice(index, index + heroTitleHighlight.length);
    const after = heroTitle.slice(index + heroTitleHighlight.length);
    return (
      <>
        {before}
        <span className="bg-gradient-to-r from-[#662D91] via-[#8B3DB8] to-[#662D91] bg-clip-text text-transparent">
          {match}
        </span>
        {after}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Compact */}
      {(showHeroTitle || showHeroSubtitle) && (
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/3 via-transparent to-transparent dark:from-primary/5 py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {showHeroTitle && (
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                    {renderHeroTitle()}
                  </h1>
                )}
                {showHeroSubtitle && (
                  <p className="text-base md:text-lg text-muted-foreground">
                    {heroSubtitle}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Feature Categories Tabs */}
      {activeCategory && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs - Horizontal Scroll on Mobile */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-full transition-all whitespace-nowrap text-sm md:text-base font-medium ${
                      activeTab === category.id
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-card border border-border hover:border-primary/50 hover:bg-card/80"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 md:h-5 md:w-5" />}
                    <span>{category.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                  {/* Content Column */}
                  <div className="order-2 lg:order-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
                      {activeCategory.title}
                    </h2>
                    <div className="space-y-4 md:space-y-5">
                      {activeCategory.features.map((feature, idx) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-3 md:gap-4 group"
                          >
                            <div className={`w-10 h-10 md:w-12 md:h-12 ${activeCategory.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                              {FeatureIcon && <FeatureIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base md:text-lg mb-1.5">{feature.title}</h3>
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Column - Clean Minimal Design */}
                  <div className="relative order-1 lg:order-2">
                    <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                      >
                        {/* Subtle Background Glow - No Rectangular Shape */}
                        <div className="absolute -inset-12 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/25 dark:via-primary/15 rounded-full blur-3xl opacity-40 dark:opacity-30 -z-10"></div>

                        {/* Image with Clean Presentation - No Background Container */}
                        <div className="relative aspect-[4/3] flex items-center justify-center">
                          <div className="relative w-full h-full max-w-[85%]">
                            {activeCategory.image && (
                              <Image
                                src={activeCategory.image}
                                alt={activeCategory.imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                                className="object-contain drop-shadow-[0_25px_60px_rgba(102,45,145,0.15)] dark:drop-shadow-[0_25px_60px_rgba(102,45,145,0.25)]"
                                priority={activeTab === categories[0]?.id}
                              />
                            )}
                          </div>
                        </div>

                        {/* Floating Accent Elements - Organic Shapes */}
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-50 dark:opacity-30"></div>
                        <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-primary/8 rounded-full blur-xl opacity-40 dark:opacity-25"></div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* CTA Section - Compact */}
      {showCta && (
        <section className="py-12 md:py-16 border-t border-border/40 bg-gradient-to-b from-primary/3 via-transparent to-transparent dark:from-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              {ctaTitle.length > 0 && (
                <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                  {ctaTitle}
                </h2>
              )}
              {ctaSubtitle.length > 0 && (
                <p className="text-base md:text-lg text-muted-foreground mb-6">
                  {ctaSubtitle}
                </p>
              )}
              {ctaButtonText.length > 0 && (
                <button
                  onClick={() => setIsWaitlistModalOpen(true)}
                  className="px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-all font-semibold text-sm md:text-base shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                  {ctaButtonText}
                </button>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}
