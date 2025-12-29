"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { Sparkles, Heart, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import WaitlistModal from "@/components/waitlist-modal";

interface AppDownloadProps {
  data: Record<string, any>;
}

export default function AppDownload({ data = {} }: AppDownloadProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const title = data?.title || "qoupl is Launching Soon";
  const subtitle = data?.subtitle || "Be among the first college students to experience the future of dating! Join our waitlist today and get exclusive early access when we launch on iOS and Android.";
  const benefits = data?.benefits || [
    "Get notified before official launch",
    "Exclusive early access to the app",
    "Special perks for early members",
    "Help shape the future of qoupl"
  ];
  const ctaText = data?.cta?.text || "Join the Waitlist";
  const ctaSubtext = data?.cta?.subtext || "Limited spots available for early access";

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Coming Soon</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {subtitle}
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-primary fill-primary" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => setIsWaitlistModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#662D91] text-white shadow-lg hover:shadow-xl transition-all font-semibold text-lg"
            >
              <Bell className="h-5 w-5" />
              {ctaText}
            </motion.button>

            {ctaSubtext && (
              <p className="mt-4 text-sm text-muted-foreground">
                {ctaSubtext}
              </p>
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
                <div className="text-center mb-6">
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
                    <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-bold text-2xl mb-2">Launching Soon</h3>
                  <p className="text-muted-foreground">
                    iOS & Android
                  </p>
                </div>

                {/* Platform Badges - Greyed Out */}
                <div className="space-y-3 opacity-50">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center">
                      <div className="relative h-5 w-5 flex items-center justify-center">
                        {mounted && (
                          <Image
                            src={isDark ? "/images/brand-logo/apple-dark.png" : "/images/brand-logo/apple.png"}
                            alt="Apple logo"
                            width={20}
                            height={20}
                            className="object-contain opacity-60"
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-normal text-muted-foreground">Coming to</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center">
                      <div className="relative h-5 w-5 flex items-center justify-center">
                        {mounted && (
                          <Image
                            src={isDark ? "/images/brand-logo/android-dark.png" : "/images/brand-logo/android.png"}
                            alt="Android logo"
                            width={20}
                            height={20}
                            className="object-contain opacity-60"
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-normal text-muted-foreground">Coming to</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Join <span className="font-semibold text-primary">10,000+</span> on the waitlist
                  </p>
                </div>
              </motion.div>

              {/* Decorative Images */}
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
                  src={getStorageUrl("couple-photos", "qoupl_couple_03.jpg")}
                  alt="qoupl preview"
                  fill
                  className="object-cover"
                />
              </motion.div>

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
                  src={getStorageUrl("couple-photos", "qoupl_couple_05.jpg")}
                  alt="qoupl preview"
                  fill
                  className="object-cover"
                />
              </motion.div>
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
