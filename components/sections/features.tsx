"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Zap,
  Users,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Smart Matching",
    description:
      "Our AI-powered algorithm finds compatible matches based on your interests, values, and preferences.",
    color: "bg-[#662D91]",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Your privacy is our priority. Mandatory college ID verification and safety features keep college students protected.",
    color: "bg-[#662D91]",
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description:
      "Connect with people instantly. No waiting, no games, just genuine conversations.",
    color: "bg-[#662D91]",
  },
  {
    icon: Users,
    title: "College Community",
    description:
      "Join a vibrant community of college students looking for meaningful relationships with their peers.",
    color: "bg-[#662D91]",
  },
  {
    icon: MessageCircle,
    title: "Rich Messaging",
    description:
      "Express yourself with photos, voice messages, video calls, and more.",
    color: "bg-[#662D91]",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description:
      "Beautiful, intuitive interface designed for the best dating experience.",
    color: "bg-[#662D91]",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      {/* Background */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="text-[#662D91]">
              qoupl
            </span>
            ?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of dating for college students with features designed to help you
            find genuine connections with your peers.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={item}>
                <div className="h-full rounded-lg border-2 border-border bg-card hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 group">
                  <div className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" strokeWidth={1} />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
