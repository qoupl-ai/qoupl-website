"use client";

import Link from "next/link";
import { ArrowLeft, Check, MessageSquare, Zap, Heart, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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
  plans: PricingPlan[];
}

export default function PricingClient({ plans }: PricingClientProps) {
  const [messageBundle, setMessageBundle] = useState(5);

  const calculatePrice = (messages: number) => {
    const basePrice = messages * 10;
    const gst = basePrice * 0.18; // 18% GST
    return {
      base: basePrice,
      gst: gst,
      total: basePrice + gst
    };
  };

  const price = calculatePrice(messageBundle);

  // Get features from first plan or use defaults
  const features = plans.length > 0 && plans[0].features?.length > 0 
    ? plans[0].features 
    : [
        "AI-powered matching algorithm",
        "Advanced profile customization",
        "Photo verification",
        "Smart conversation starters",
        "Read receipts",
        "Priority support",
        "Ad-free experience",
        "Enhanced privacy controls"
      ];

  const messageBundles = [
    { messages: 5, popular: false },
    { messages: 10, popular: true },
    { messages: 20, popular: false },
    { messages: 50, popular: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Simple & Transparent</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Affordable{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Pay only for what you use. No hidden fees, no surprises.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </section>

      {/* Platform Fee Section */}
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Platform Access
                </h2>

                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    ₹10
                  </span>
                  <span className="text-2xl text-muted-foreground">/month</span>
                </div>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get access to the qoupl platform and unlock all features
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Free Messages Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20 rounded-2xl p-6 md:p-8 mb-20"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">First 3 Messages Free Per Match!</h3>
                <p className="text-lg text-muted-foreground">
                  Start conversations with your matches without any additional cost.
                  Your first 3 messages with each match are completely free.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Message Bundles */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Message{" "}
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bundles
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                After your free messages, purchase message bundles to continue connecting
              </p>
            </motion.div>

            {/* Quick Select Bundles */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                      bundle.popular ? 'lg:-mt-4' : ''
                    }`}
                  >
                    {bundle.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                          Popular
                        </span>
                      </div>
                    )}

                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      messageBundle === bundle.messages
                        ? 'from-primary/30 to-purple-600/30'
                        : 'from-primary/10 to-purple-600/10'
                    } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className={`relative h-full bg-card border-2 ${
                      messageBundle === bundle.messages
                        ? 'border-primary'
                        : 'border-border'
                    } rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 ${
                      bundle.popular ? 'py-8' : ''
                    }`}>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 mb-4">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>

                        <h3 className="text-3xl font-bold mb-2">{bundle.messages}</h3>
                        <p className="text-muted-foreground mb-4">Messages</p>

                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                          ₹{bundlePrice.total.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ₹{bundlePrice.base} + ₹{bundlePrice.gst.toFixed(2)} GST
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

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
                  <h3 className="text-3xl font-bold mb-4">Custom Bundle</h3>
                  <p className="text-muted-foreground">
                    Choose your own message bundle size (minimum 5 messages)
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-lg font-semibold">Number of Messages</label>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {messageBundle}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={messageBundle}
                      onChange={(e) => setMessageBundle(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right,
                          hsl(var(--primary)) 0%,
                          hsl(var(--primary)) ${((messageBundle - 5) / 95) * 100}%,
                          rgba(168, 85, 247, 0.2) ${((messageBundle - 5) / 95) * 100}%,
                          rgba(168, 85, 247, 0.2) 100%)`
                      }}
                    />

                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>5 messages</span>
                      <span>100 messages</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-2xl p-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Base Price ({messageBundle} × ₹10)</span>
                        <span className="font-semibold">₹{price.base}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span className="font-semibold">₹{price.gst.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between items-center">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          ₹{price.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Purchase {messageBundle} Messages
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pricing Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20 rounded-2xl p-6 mt-12"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg">How it works</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Pay ₹10/month for platform access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Get 3 free messages with each match</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Purchase message bundles as needed (minimum 5 messages for ₹50 + GST)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Each message costs ₹10, bundles can be customized to your needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>All prices include 18% GST</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Do message bundles expire?",
                a: "No, your purchased message bundles never expire. Use them whenever you're ready to connect!"
              },
              {
                q: "Can I cancel my subscription?",
                a: "Yes, you can cancel your platform subscription anytime. Your access will continue until the end of your billing period."
              },
              {
                q: "Are there any hidden fees?",
                a: "No hidden fees! The only costs are the ₹10/month platform fee and any message bundles you choose to purchase."
              },
              {
                q: "How do the 3 free messages work?",
                a: "For each match you connect with, your first 3 messages are completely free. This applies to every new match individually."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
              >
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
