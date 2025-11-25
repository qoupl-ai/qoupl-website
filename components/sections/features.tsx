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
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Your privacy is our priority. Advanced verification and safety features keep you protected.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description:
      "Connect with people instantly. No waiting, no games, just genuine conversations.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Active Community",
    description:
      "Join a vibrant community of genuine people looking for meaningful relationships.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageCircle,
    title: "Rich Messaging",
    description:
      "Express yourself with photos, voice messages, video calls, and more.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description:
      "Beautiful, intuitive interface designed for the best dating experience.",
    color: "from-violet-500 to-purple-500",
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
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-50/30 to-background dark:via-purple-950/10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              qoupl
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of dating with features designed to help you
            find genuine connections.
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
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 group hover:shadow-xl">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
