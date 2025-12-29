"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { resolveLucideIcon } from "@/lib/utils/icons";
import type {
  FreeMessagesSectionData,
  MessageBundlesSectionData,
  PricingFaqSectionData,
  PricingHeroSectionData,
  PricingInfoSectionData,
  PricingPlansSectionData,
} from "@/types/section";

interface PricingClientProps {
  hero?: PricingHeroSectionData;
  pricingPlans?: PricingPlansSectionData;
  freeMessages?: FreeMessagesSectionData;
  messageBundles?: MessageBundlesSectionData;
  pricingInfo?: PricingInfoSectionData;
  faq?: PricingFaqSectionData;
}

export default function PricingClient({
  hero,
  pricingPlans,
  freeMessages,
  messageBundles,
  pricingInfo,
  faq,
}: PricingClientProps) {
  const plans = useMemo(() => {
    if (!pricingPlans?.plans || !Array.isArray(pricingPlans.plans)) return [];
    return [...pricingPlans.plans].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [pricingPlans?.plans]);

  const primaryPlan = plans[0];

  const pricePerMessage =
    typeof messageBundles?.price_per_message === "number" && Number.isFinite(messageBundles.price_per_message)
      ? messageBundles.price_per_message
      : null;
  const gstRate =
    typeof messageBundles?.gst_rate === "number" && Number.isFinite(messageBundles.gst_rate)
      ? messageBundles.gst_rate
      : null;
  const minMessages =
    typeof messageBundles?.min_messages === "number" && Number.isFinite(messageBundles.min_messages)
      ? messageBundles.min_messages
      : null;
  const maxMessages =
    typeof messageBundles?.max_messages === "number" && Number.isFinite(messageBundles.max_messages)
      ? messageBundles.max_messages
      : null;

  const initialMessageBundle = minMessages ?? 0;
  const [messageBundle, setMessageBundle] = useState(initialMessageBundle);

  useEffect(() => {
    if (minMessages !== null) {
      setMessageBundle(minMessages);
    }
  }, [minMessages]);

  const bundles = Array.isArray(messageBundles?.bundles)
    ? messageBundles!.bundles.filter((bundle) => bundle.show !== false && bundle.messages > 0)
    : [];

  const labels = messageBundles?.labels ?? {};
  const currencySymbol = messageBundles?.currencySymbol ?? "";
  const BundleIcon = resolveLucideIcon(messageBundles?.icon);
  const showBundleIcon = messageBundles?.showIcon !== false && !!BundleIcon;

  const calculatePrice = (messages: number) => {
    if (pricePerMessage === null || gstRate === null) return null;
    const basePrice = messages * pricePerMessage;
    const gst = basePrice * (gstRate / 100);
    return {
      base: basePrice,
      gst,
      total: basePrice + gst,
    };
  };

  const heroTitle = hero?.title ?? "";
  const heroTitleHighlight = hero?.titleHighlight ?? "";
  const heroSubtitle = hero?.subtitle ?? "";
  const showHeroTitle = hero?.showTitle !== false && heroTitle.length > 0;
  const showHeroSubtitle = hero?.showSubtitle !== false && heroSubtitle.length > 0;
  const showHeroBadge = hero?.badge?.show === true && (hero?.badge?.text ?? "").length > 0;
  const HeroBadgeIcon = resolveLucideIcon(hero?.badge?.icon);

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
        <span className="bg-[#662D91] bg-clip-text text-transparent">{match}</span>
        {after}
      </>
    );
  };

  if (pricingPlans && plans.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Pricing plans section data is missing required plans.");
    }
  }

  const PlanIcon = resolveLucideIcon(primaryPlan?.icon);
  const FeatureIcon = resolveLucideIcon(primaryPlan?.featureIcon);
  const showPlanFeatures = primaryPlan?.showFeatures !== false && (primaryPlan?.features?.length ?? 0) > 0;

  const showFreeMessages =
    freeMessages?.show !== false &&
    ((freeMessages?.title ?? "").length > 0 || (freeMessages?.description ?? "").length > 0);
  const FreeMessagesIcon = resolveLucideIcon(freeMessages?.icon);
  const showFreeMessagesIcon = freeMessages?.showIcon !== false && !!FreeMessagesIcon;

  const canRenderBundles =
    messageBundles?.show !== false &&
    pricePerMessage !== null &&
    gstRate !== null &&
    minMessages !== null &&
    maxMessages !== null;

  if (messageBundles && !canRenderBundles) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Message bundles section data is missing required fields.");
    }
  }

  const showPricingInfo =
    pricingInfo?.show !== false &&
    ((pricingInfo?.title ?? "").length > 0 || (pricingInfo?.items?.length ?? 0) > 0);
  const PricingInfoIcon = resolveLucideIcon(pricingInfo?.icon);
  const PricingInfoItemIcon = resolveLucideIcon(pricingInfo?.itemIcon);
  const showPricingInfoIcon = pricingInfo?.showIcon !== false && !!PricingInfoIcon;
  const showPricingInfoItemIcon = pricingInfo?.showItemIcon !== false && !!PricingInfoItemIcon;

  const faqItems = Array.isArray(faq?.faqs)
    ? faq!.faqs.filter((item) => item.show !== false && item.question && item.answer)
    : [];
  if (faq && faqItems.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Pricing FAQ section data is missing required FAQs.");
    }
  }

  const showFaqCta = faq?.cta?.show === true && (faq?.cta?.buttonText ?? "").length > 0;
  const faqCtaText = faq?.cta?.text ?? "";
  const faqCtaButtonText = faq?.cta?.buttonText ?? "";
  const faqCtaLink = faq?.cta?.link ?? "";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {hero && (showHeroTitle || showHeroSubtitle || showHeroBadge) && (
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              {showHeroBadge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
                >
                  {HeroBadgeIcon && <HeroBadgeIcon className="h-4 w-4" />}
                  <span className="text-sm font-semibold">{hero?.badge?.text}</span>
                </motion.div>
              )}

              {showHeroTitle && (
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                  {renderHeroTitle()}
                </h1>
              )}
              {showHeroSubtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {heroSubtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </section>
      )}

      {/* Platform Fee Section */}
      {primaryPlan && (
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative mb-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-xl" />

              <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-8">
                  {PlanIcon && (
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-6">
                      <PlanIcon className="h-8 w-8 text-white" />
                    </div>
                  )}

                  {(primaryPlan.name ?? "").length > 0 && (
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      {primaryPlan.name}
                    </h2>
                  )}

                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {primaryPlan.currency ?? ""}{primaryPlan.price}
                    </span>
                    {(primaryPlan.billing_period ?? "").length > 0 && (
                      <span className="text-2xl text-muted-foreground">/{primaryPlan.billing_period}</span>
                    )}
                  </div>

                  {(primaryPlan.description ?? "").length > 0 && (
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      {primaryPlan.description}
                    </p>
                  )}
                </div>

                {showPlanFeatures && (
                  <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {primaryPlan.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        {FeatureIcon && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <FeatureIcon className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <span className="text-muted-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Free Messages Notice */}
            {showFreeMessages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20 rounded-2xl p-6 md:p-8 mb-20"
              >
                <div className="flex items-start gap-4">
                  {showFreeMessagesIcon && (
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FreeMessagesIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}
                  <div>
                    {(freeMessages?.title ?? "").length > 0 && (
                      <h3 className="text-2xl font-bold mb-2">
                        {freeMessages?.title}
                      </h3>
                    )}
                    {(freeMessages?.description ?? "").length > 0 && (
                      <p className="text-lg text-muted-foreground">
                        {freeMessages?.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Message Bundles */}
            {canRenderBundles && (
              <div className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  {(messageBundles?.title ?? "").length > 0 && (
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      {messageBundles?.title}
                    </h2>
                  )}
                  {(messageBundles?.subtitle ?? "").length > 0 && (
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      {messageBundles?.subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Quick Select Bundles */}
                {bundles.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {bundles.map((bundle, index) => {
                      const bundlePrice = calculatePrice(bundle.messages);
                      if (!bundlePrice) return null;
                      const popularLabel = bundle.label || labels.popular || "";
                      const messagesLabel = labels.messages || "";
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                          onClick={() => setMessageBundle(bundle.messages)}
                          className={`relative cursor-pointer group ${
                            bundle.popular ? "lg:-mt-4" : ""
                          }`}
                        >
                          {bundle.popular && popularLabel.length > 0 && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                              <span className="px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                                {popularLabel}
                              </span>
                            </div>
                          )}

                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${
                              messageBundle === bundle.messages
                                ? "from-primary/30 to-purple-600/30"
                                : "from-primary/10 to-purple-600/10"
                            } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                          />

                          <div
                            className={`relative h-full bg-card border-2 ${
                              messageBundle === bundle.messages
                                ? "border-primary"
                                : "border-border"
                            } rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 ${
                              bundle.popular ? "py-8" : ""
                            }`}
                          >
                            <div className="text-center">
                              {showBundleIcon && (
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 mb-4">
                                  <BundleIcon className="h-6 w-6 text-white" />
                                </div>
                              )}

                              <h3 className="text-3xl font-bold mb-2">{bundle.messages}</h3>
                              {messagesLabel.length > 0 && (
                                <p className="text-muted-foreground mb-4">{messagesLabel}</p>
                              )}

                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                                {currencySymbol}{bundlePrice.total.toFixed(2)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {currencySymbol}{bundlePrice.base} + {currencySymbol}{bundlePrice.gst.toFixed(2)}{" "}
                                {labels.gstLabel || ""} ({gstRate}%)
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Custom Bundle Calculator */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-xl" />

                  <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-8">
                      {(labels.customBundleTitle ?? "").length > 0 && (
                        <h3 className="text-3xl font-bold mb-4">{labels.customBundleTitle}</h3>
                      )}
                      {(labels.customBundleSubtitle ?? "").length > 0 && (
                        <p className="text-muted-foreground">
                          {labels.customBundleSubtitle}
                        </p>
                      )}
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          {(labels.quantityLabel ?? "").length > 0 && (
                            <label className="text-lg font-semibold">{labels.quantityLabel}</label>
                          )}
                          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {messageBundle}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={minMessages ?? 0}
                          max={maxMessages ?? 0}
                          step="5"
                          value={messageBundle}
                          onChange={(e) => setMessageBundle(parseInt(e.target.value))}
                          className="w-full h-3 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: (() => {
                              const minValue = minMessages ?? 0;
                              const maxValue = maxMessages ?? 0;
                              const range = maxValue - minValue;
                              const progress = range > 0 ? ((messageBundle - minValue) / range) * 100 : 0;
                              return `linear-gradient(to right,
                          hsl(var(--primary)) 0%,
                          hsl(var(--primary)) ${progress}%,
                          rgba(168, 85, 247, 0.2) ${progress}%,
                          rgba(168, 85, 247, 0.2) 100%)`;
                            })(),
                          }}
                        />

                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>
                            {minMessages} {labels.messages ?? ""}
                          </span>
                          <span>
                            {maxMessages} {labels.messages ?? ""}
                          </span>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-2xl p-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              {labels.basePriceLabel ?? ""} ({messageBundle} × {currencySymbol}{pricePerMessage})
                            </span>
                            <span className="font-semibold">{currencySymbol}{calculatePrice(messageBundle)?.base}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              {labels.gstLabel ?? ""} ({gstRate}%)
                            </span>
                            <span className="font-semibold">{currencySymbol}{calculatePrice(messageBundle)?.gst.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-border pt-3 flex justify-between items-center">
                            <span className="text-lg font-bold">{labels.totalLabel ?? ""}</span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              {currencySymbol}{calculatePrice(messageBundle)?.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const purchaseLabel = labels.purchaseLabel ?? "";
                        const messagesLabel = labels.messages ?? "";
                        const purchaseText = [purchaseLabel, messageBundle, messagesLabel]
                          .filter((part) => String(part).length > 0)
                          .join(" ");
                        if (!purchaseText) return null;
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {purchaseText}
                          </motion.button>
                        );
                      })()}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Pricing Info */}
            {showPricingInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20 rounded-2xl p-6 mt-12"
              >
                <div className="flex items-start gap-4">
                  {showPricingInfoIcon && (
                    <div className="flex-shrink-0">
                      <PricingInfoIcon className="h-6 w-6 text-blue-500" />
                    </div>
                  )}
                  <div className="space-y-2">
                    {(pricingInfo?.title ?? "").length > 0 && (
                      <h4 className="font-bold text-lg">{pricingInfo?.title}</h4>
                    )}
                    {(pricingInfo?.items?.length ?? 0) > 0 && (
                      <ul className="space-y-2 text-muted-foreground">
                        {pricingInfo!.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            {showPricingInfoItemIcon && (
                              <PricingInfoItemIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            )}
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              {(faq?.title ?? "").length > 0 && (
                <h2 className="text-4xl font-bold mb-4">{faq?.title}</h2>
              )}
            </motion.div>

            <div className="space-y-6">
              {faqItems.map((faqItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
                >
                  <h3 className="font-bold text-lg mb-2">{faqItem.question}</h3>
                  <p className="text-muted-foreground">{faqItem.answer}</p>
                </motion.div>
              ))}
            </div>

            {showFaqCta && (
              <div className="text-center mt-12">
                {(faqCtaText ?? "").length > 0 && (
                  <p className="text-muted-foreground mb-4">{faqCtaText}</p>
                )}
                {faqCtaLink.length > 0 && (
                  <Link
                    href={faqCtaLink}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {faqCtaButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
