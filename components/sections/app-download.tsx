"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { Sparkles, Heart, Bell, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import WaitlistModal from "@/components/waitlist-modal";
import { Button } from "@/components/ui/button";

interface AppDownloadProps {
  data: Record<string, any>;
}

export default function AppDownload({ data = {} }: AppDownloadProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted && resolvedTheme === 'dark';

  // Launch date: March 4, 2026
  const launchDate = new Date('2026-03-04T00:00:00').getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  const title = data?.title || "qoupl is Launching Soon";
  const subtitle = data?.subtitle || "Be among the first college students to experience the future of dating! Join our waitlist today and get exclusive early access when we launch on iOS and Android.";
  
  // Handle benefits - can be array of strings or array of objects
  const benefitsRaw = data?.benefits || [
    "Get notified before official launch",
    "Exclusive early access to the app",
    "Special perks for early members",
    "Help shape the future of qoupl"
  ];
  const benefits = benefitsRaw.map((benefit: string | { text?: string; icon?: string; showIcon?: boolean }) => 
    typeof benefit === 'string' ? benefit : (benefit.text || '')
  ).filter(Boolean);
  
  const ctaText = data?.cta?.text || "Join the Waitlist";
  const ctaSubtext = data?.cta?.subtext || "Limited spots available for early access";

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">

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
              <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-sm font-semibold">{data?.badge?.text || "Coming Soon"}</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
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
                    <Heart className="h-4 w-4 text-primary fill-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => setIsWaitlistModalOpen(true)}
                className="bg-[#662D91] hover:bg-[#7a35a8] text-white font-semibold shadow-lg hover:shadow-xl"
              >
                <Bell className="h-4 w-4" strokeWidth={1.5} />
                {ctaText}
              </Button>
            </motion.div>

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
                className={`relative z-10 ${mounted && isDark ? 'bg-[#161616]' : 'bg-muted'} rounded-xl shadow-lg p-6 md:p-8 border border-border`}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${mounted && isDark ? 'bg-[#662D91]/20' : 'bg-[#662D91]/10'} mb-4`}>
                    <Calendar className={`h-3.5 w-3.5 ${mounted && isDark ? 'text-[#9333ea]' : 'text-[#662D91]'}`} strokeWidth={1.5} />
                    <span className={`text-xs font-semibold ${mounted && isDark ? 'text-[#9333ea]' : 'text-[#662D91]'}`}>March 4, 2026</span>
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl mb-2 text-foreground">Launching Soon on</h3>
                  <p className="text-sm text-muted-foreground">
                    App Store & Play Store
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {timeRemaining.days}
                    </div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {timeRemaining.hours}
                    </div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {timeRemaining.minutes}
                    </div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {timeRemaining.seconds}
                    </div>
                    <div className="text-xs text-muted-foreground">Seconds</div>
                  </div>
                </div>

                {/* Platform Badges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/30 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                      <div className="relative h-5 w-5 flex items-center justify-center">
                        <Image
                          src="https://agbuefpfkgknbboeeyqa.supabase.co/storage/v1/object/public/brand-assets/brand-logo/app-store.png"
                          alt="App Store"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-normal text-muted-foreground">Coming to</div>
                      <div className="text-sm font-semibold text-foreground">App Store</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/30 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                      <div className="relative h-5 w-5 flex items-center justify-center">
                        <Image
                          src="https://agbuefpfkgknbboeeyqa.supabase.co/storage/v1/object/public/brand-assets/brand-logo/playstore.png"
                          alt="Google Play Store"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-normal text-muted-foreground">Coming to</div>
                      <div className="text-sm font-semibold text-foreground">Google Play</div>
                    </div>
                  </div>
                </div>

              </motion.div>

              {/* Decorative Images */}
              {(() => {
                // Handle both old format (array of strings) and new format (array of objects)
                const decorativeImages = data?.images?.decorative || [];
                const image1 = decorativeImages[0];
                const image2 = decorativeImages[1];
                
                const getImagePath = (img: string | { image?: string; alt?: string }) => {
                  if (typeof img === 'string') return img;
                  return img?.image || '';
                };
                
                const getImageAlt = (img: string | { image?: string; alt?: string }, defaultAlt: string) => {
                  if (typeof img === 'string') return defaultAlt;
                  return img?.alt || defaultAlt;
                };
                
                return (
                  <>
                    {image1 && (
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
                          src={getStorageUrl("couple-photos", getImagePath(image1))}
                          alt={getImageAlt(image1, "qoupl preview")}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                    
                    {image2 && (
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
                          src={getStorageUrl("couple-photos", getImagePath(image2))}
                          alt={getImageAlt(image2, "qoupl preview")}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </>
                );
              })()}
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
