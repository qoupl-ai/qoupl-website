"use client";

import Link from "next/link";
import { Check, MessageSquare, Zap, Heart, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  name: string;
  price: number;
  currency?: string;
  billing_period?: string;
  features: string[];
  is_popular?: boolean;
  order_index?: number;
}

interface PricingClientProps {
  hero?: {
    title?: string;
    subtitle?: string;
    badge?: {
      icon?: string;
      text?: string;
    };
  };
  plans: PricingPlan[];
  freeMessages?: {
    count?: number;
    title?: string;
    description?: string;
  };
  messageBundles?: {
    price_per_message?: number;
    gst_rate?: number;
    bundles?: Array<{ messages: number; popular: boolean }>;
    min_messages?: number;
    max_messages?: number;
    title?: string;
    subtitle?: string;
  };
  pricingInfo?: {
    title?: string;
    items?: string[];
  };
  faq?: {
    title?: string;
    faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string }>;
    cta?: {
      text?: string;
      link?: string;
    };
  };
}

export default function PricingClient({ 
  hero, 
  plans, 
  freeMessages, 
  messageBundles: messageBundlesData, 
  pricingInfo, 
  faq 
}: PricingClientProps) {
  const [messageBundle, setMessageBundle] = useState(5);

  // Get values from CMS - no defaults, only use if data exists
  const pricePerMessage = messageBundlesData?.price_per_message ?? 10;
  const gstRate = messageBundlesData?.gst_rate ?? 18;
  const minMessages = messageBundlesData?.min_messages ?? 5;
  const maxMessages = messageBundlesData?.max_messages ?? 100;

  const calculatePrice = (messages: number) => {
    const basePrice = messages * pricePerMessage;
    const gst = basePrice * (gstRate / 100);
    return {
      base: basePrice,
      gst: gst,
      total: basePrice + gst
    };
  };

  const price = calculatePrice(messageBundle);

  // Get features from first plan
  const features = plans.length > 0 && plans[0].features?.length > 0 
    ? plans[0].features 
    : [];

  // Get message bundles from CMS - only use if data exists
  const messageBundles = messageBundlesData?.bundles && messageBundlesData.bundles.length > 0
    ? messageBundlesData.bundles
    : [];

  // If no sections exist at all, show a message
  const hasAnyContent = hero || plans.length > 0 || freeMessages || messageBundlesData || pricingInfo || faq

  if (!hasAnyContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Pricing content is being set up. Please check back soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {hero && (
        <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              {hero?.badge?.text && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 mb-4"
                >
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="text-xs font-medium">{hero.badge.text}</span>
                </motion.div>
              )}

              <h1 className="text-fluid-6xl font-bold leading-tight mb-4 text-title">
                {hero?.title || "Affordable Pricing"}
              </h1>
              <p className="text-fluid-lg text-paragraph leading-relaxed max-w-prose mx-auto">
                {hero?.subtitle || "Pay only for what you use. No hidden fees, no surprises."}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Platform Fee Section */}
      {plans.length > 0 && (
        <section className="pb-12 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mb-12"
          >
            <div className="relative bg-card border border-border rounded-xl p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                  <Zap className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>

                <h2 className="text-fluid-5xl font-bold leading-tight mb-4 text-title">
                  {plans.length > 0 ? plans[0].name || "Platform Access" : "Platform Access"}
                </h2>

                {plans.length > 0 && (
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-fluid-6xl font-bold leading-tight text-primary">
                      ₹{plans[0].price}
                    </span>
                    <span className="text-fluid-lg text-secondary-text">/{plans[0].billing_period || "month"}</span>
                  </div>
                )}

                <p className="text-fluid-base text-paragraph leading-relaxed max-w-prose mx-auto">
                  Get access to the qoupl platform and unlock all features
                </p>
              </div>

              {features.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" strokeWidth={2} />
                    </div>
                    <span className="text-fluid-sm text-paragraph">{feature}</span>
                  </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Free Messages Notice */}
          {freeMessages && (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-fluid-2xl font-bold leading-snug mb-2 text-title">
                  {freeMessages?.title || `First ${freeMessages?.count || 3} Messages Free Per Match!`}
                </h3>
                <p className="text-fluid-base text-paragraph leading-relaxed">
                  {freeMessages?.description || "Start conversations with your matches without any additional cost. Your first 3 messages with each match are completely free."}
                </p>
              </div>
            </div>
          </motion.div>
          )}

          {/* Message Bundles */}
          {messageBundlesData && (
            <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-fluid-5xl font-bold leading-tight mb-3 text-title">
                {messageBundlesData?.title || "Message Bundles"}
              </h2>
              <p className="text-fluid-base text-paragraph leading-relaxed max-w-prose mx-auto">
                {messageBundlesData?.subtitle || "After your free messages, purchase message bundles to continue connecting"}
              </p>
            </motion.div>

            {/* Quick Select Bundles */}
            {messageBundles.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {messageBundles.map((bundle, index) => {
                const bundlePrice = calculatePrice(bundle.messages);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    onClick={() => setMessageBundle(bundle.messages)}
                    className={`relative cursor-pointer group ${
                      bundle.popular ? 'lg:-mt-2' : ''
                    }`}
                  >
                    {bundle.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-lg shadow-md">
                          Popular
                        </span>
                      </div>
                    )}

                    <div className={`relative h-full bg-card border ${
                      messageBundle === bundle.messages
                        ? 'border-primary'
                        : 'border-border'
                    } rounded-xl p-5 hover:border-primary transition-all duration-300 ${
                      bundle.popular ? 'pt-7' : ''
                    }`}>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary mb-3">
                          <MessageSquare className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-fluid-2xl font-bold leading-snug mb-1 text-title">{bundle.messages}</h3>
                        <p className="text-fluid-sm text-secondary-text mb-3">Messages</p>

                        <div className="text-fluid-xl font-bold leading-snug text-primary mb-1">
                          ₹{bundlePrice.total.toFixed(2)}
                        </div>
                        <p className="text-fluid-sm text-secondary-text">
                          ₹{bundlePrice.base} + ₹{bundlePrice.gst.toFixed(2)} GST ({gstRate}%)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground mb-12">
                <p>No message bundles configured. Add bundles in the CMS to display them here.</p>
              </div>
            )}

            {/* Custom Bundle Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >

              <div className="relative bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-fluid-2xl font-bold leading-snug mb-2 text-title">Custom Bundle</h3>
                  <p className="text-fluid-sm text-paragraph leading-relaxed">
                    Choose your own message bundle size (minimum 5 messages)
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-fluid-base font-semibold text-title">Number of Messages</label>
                      <span className="text-fluid-5xl font-bold leading-tight text-primary">
                        {messageBundle}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={minMessages}
                      max={maxMessages}
                      step="5"
                      value={messageBundle}
                      onChange={(e) => setMessageBundle(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#662D91]/20 rounded-full appearance-none cursor-pointer slider-thumb-brand"
                      style={{
                        background: `linear-gradient(to right,
                          #662D91 0%,
                          #662D91 ${((messageBundle - minMessages) / (maxMessages - minMessages)) * 100}%,
                          rgba(102, 45, 145, 0.2) ${((messageBundle - minMessages) / (maxMessages - minMessages)) * 100}%,
                          rgba(102, 45, 145, 0.2) 100%)`
                      }}
                    />

                    <div className="flex justify-between text-fluid-sm text-secondary-text mt-2">
                      <span>{minMessages} messages</span>
                      <span>{maxMessages} messages</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="rounded-lg p-5 mb-6 border border-border">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-fluid-sm text-paragraph">Base Price ({messageBundle} × ₹{pricePerMessage})</span>
                        <span className="text-fluid-sm font-semibold text-title">₹{price.base}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-fluid-sm text-paragraph">GST ({gstRate}%)</span>
                        <span className="text-fluid-sm font-semibold text-title">₹{price.gst.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between items-center">
                        <span className="text-fluid-base font-bold text-title">Total Amount</span>
                        <span className="text-fluid-5xl font-bold leading-tight text-primary">
                          ₹{price.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Purchase {messageBundle} Messages
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          )}

          {/* Pricing Info */}
          {pricingInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-6 mt-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-fluid-xl leading-snug text-title">{pricingInfo?.title || "How it works"}</h4>
                  {pricingInfo?.items && pricingInfo.items.length > 0 ? (
                    <ul className="space-y-2 text-fluid-sm text-paragraph">
                      {pricingInfo.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      )}

      {/* FAQ Section */}
      {faq && (
        <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-fluid-5xl font-bold leading-tight mb-3 text-title">
              {faq?.title || "Frequently Asked Questions"}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faq?.faqs && faq.faqs.length > 0 ? faq.faqs.map((faqItem, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-5"
              >
                <h3 className="font-bold text-fluid-xl leading-snug mb-2 text-title">{faqItem.question || faqItem.q}</h3>
                <p className="text-fluid-sm text-paragraph leading-relaxed">{faqItem.answer || faqItem.a}</p>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-paragraph">
                <p className="text-fluid-sm">No FAQs available. Add FAQs in the CMS to display them here.</p>
              </div>
            )}
          </div>

          {(faq?.cta?.text || faq?.cta?.link) && (
            <div className="text-center mt-8">
              <p className="text-fluid-sm text-paragraph leading-relaxed mb-4">{faq.cta.text || "Still have questions?"}</p>
              <Link href={faq.cta.link || "/contact"}>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      )}
    </div>
  );
}
