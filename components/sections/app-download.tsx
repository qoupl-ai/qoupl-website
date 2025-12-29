"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";

interface AppDownloadProps {
  data?: {
    title?: string;
    subtitle?: string;
    badge?: {
      icon?: string;
      text?: string;
      show?: boolean;
    };
    benefits?: Array<{
      text?: string;
      icon?: string;
      showIcon?: boolean;
    }>;
    showBenefits?: boolean;
    cta?: {
      text?: string;
      subtext?: string;
      icon?: string;
      show?: boolean;
      showSubtext?: boolean;
      secondaryText?: string;
      secondaryLink?: string;
      secondaryIcon?: string;
      showSecondary?: boolean;
    };
    platforms?: Array<{
      label?: string;
      name?: string;
      iconImage?: string;
      iconAlt?: string;
      coming?: boolean;
      show?: boolean;
    }>;
    card?: {
      title?: string;
      subtitle?: string;
      icon?: string;
      show?: boolean;
      platformsLabel?: string;
      showPlatforms?: boolean;
      statsPrefix?: string;
      statsHighlight?: string;
      statsSuffix?: string;
      showStats?: boolean;
    };
    images?: {
      decorative?: Array<{
        image?: string;
        alt?: string;
      }>;
    };
  };
}

export default function AppDownload({ data }: AppDownloadProps = {}) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  if (!data || !data.title) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('App download section data is missing required fields.')
    }
    return null
  }

  const title = data.title || '';
  const subtitle = data.subtitle || '';
  const benefits = Array.isArray(data.benefits) ? data.benefits : [];
  const showBenefits = data.showBenefits !== false && benefits.length > 0;
  const ctaText = data.cta?.text || '';
  const ctaSubtext = data.cta?.subtext || '';
  const showCta = data.cta?.show !== false && ctaText.length > 0;
  const showCtaSubtext = data.cta?.showSubtext === true && ctaSubtext.length > 0;
  const showSecondary = data.cta?.showSecondary === true && (data.cta?.secondaryText || '').length > 0;
  const BadgeIcon = resolveLucideIcon(data.badge?.icon);
  const BenefitIcons = benefits.map((benefit) => resolveLucideIcon(benefit.icon));
  const CtaIcon = resolveLucideIcon(data.cta?.icon);
  const SecondaryIcon = resolveLucideIcon(data.cta?.secondaryIcon);
  const CardIcon = resolveLucideIcon(data.card?.icon);
  const showBadge = data.badge?.show === true && (data.badge?.text || '').length > 0;
  const showCard = data.card?.show !== false;
  const showPlatforms = data.card?.showPlatforms === true;
  const showStats = data.card?.showStats === true;
  const platforms = Array.isArray(data.platforms)
    ? data.platforms.filter((platform) => platform.show !== false)
    : [];
  const decorativeImages = Array.isArray(data.images?.decorative) ? data.images?.decorative || [] : [];
  const leftDecorative = decorativeImages[0];
  const rightDecorative = decorativeImages[1];
  const leftDecorativeUrl = resolveStorageUrl(leftDecorative?.image);
  const rightDecorativeUrl = resolveStorageUrl(rightDecorative?.image);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#662D91]/5 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.3 }}
          >
            {showBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
              >
                {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
                <span className="text-sm font-semibold">{data.badge?.text}</span>
              </motion.div>
            )}

            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Benefits List */}
            {showBenefits && (
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => {
                  const BenefitIcon = BenefitIcons[index];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      {benefit.showIcon !== false && BenefitIcon && (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BenefitIcon className="h-4 w-4 text-primary fill-primary" />
                        </div>
                      )}
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* CTA Button */}
            {showCta && (
              <motion.button
                onClick={() => setIsWaitlistModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#662D91] text-white shadow-lg hover:shadow-xl transition-all font-semibold text-lg"
              >
                {CtaIcon && <CtaIcon className="h-5 w-5" />}
                {ctaText}
              </motion.button>
            )}

            {showCtaSubtext && (
              <p className="mt-4 text-sm text-muted-foreground">
                {ctaSubtext}
              </p>
            )}

            {showSecondary && data.cta?.secondaryLink && (
              <motion.a
                href={data.cta.secondaryLink}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary"
              >
                {data.cta.secondaryText}
                {SecondaryIcon && <SecondaryIcon className="h-4 w-4" />}
              </motion.a>
            )}
          </motion.div>

          {/* Right Content - Coming Soon Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative max-w-sm mx-auto">
              {/* Coming Soon Card */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative z-10 bg-[#662D91]/20 rounded-2xl shadow-2xl p-8 border-2 border-primary/30 backdrop-blur-sm"
              >
                {showCard && (
                  <>
                    <div className="text-center mb-6">
                      {CardIcon && (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <CardIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                        </motion.div>
                      )}
                      {data.card?.title && <h3 className="font-bold text-2xl mb-2">{data.card?.title}</h3>}
                      {data.card?.subtitle && (
                        <p className="text-muted-foreground">
                          {data.card?.subtitle}
                        </p>
                      )}
                    </div>

                    {showPlatforms && platforms.length > 0 && (
                      <>
                        {data.card?.platformsLabel && (
                          <p className="text-xs font-normal text-muted-foreground mb-3 text-center">
                            {data.card?.platformsLabel}
                          </p>
                        )}
                        <div className="space-y-3">
                          {platforms.map((platform, index) => {
                            const iconUrl = resolveStorageUrl(platform.iconImage);
                            return (
                              <div
                                key={`${platform.name}-${index}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border ${platform.coming ? 'opacity-50' : ''}`}
                              >
                                <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center">
                                  <div className="relative h-5 w-5 flex items-center justify-center">
                                    {iconUrl && (
                                      <Image
                                        src={iconUrl}
                                        alt={platform.iconAlt || ''}
                                        width={20}
                                        height={20}
                                        className="object-contain opacity-60"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="text-left">
                                  {platform.label && (
                                    <div className="text-xs font-normal text-muted-foreground">{platform.label}</div>
                                  )}
                                  {platform.name && (
                                    <div className="text-sm font-semibold">{platform.name}</div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}

                    {showStats && (
                      <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          {data.card?.statsPrefix}{' '}
                          {data.card?.statsHighlight && (
                            <span className="font-semibold text-primary">{data.card?.statsHighlight}</span>
                          )}{' '}
                          {data.card?.statsSuffix}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Decorative Images */}
              {leftDecorativeUrl && (
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -left-8 top-12 w-32 h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-gray-800 dark:border-gray-700 opacity-70"
                >
                  <Image
                    src={leftDecorativeUrl}
                    alt={leftDecorative?.alt || ''}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}

              {rightDecorativeUrl && (
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -right-8 bottom-12 w-32 h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-gray-800 dark:border-gray-700 opacity-70"
                >
                  <Image
                    src={rightDecorativeUrl}
                    alt={rightDecorative?.alt || ''}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </section>
  );
}
