"use client";

import { Heart, Shield, Zap, MessageCircle, Sparkles, Check, Lock, Eye, Star, Filter, Bell, Users, MapPin, Camera, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useState } from "react";
import WaitlistModal from "@/components/waitlist-modal";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Shield, Zap, MessageCircle, Sparkles, Check, Lock, Eye, Star, Filter, Bell, Users, MapPin, Camera, Phone
};

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

interface FeatureCategory {
  id?: string;
  title: string;
  icon?: string;
  color?: string;
  image?: string;
  coupleImage?: string;
  features?: Feature[];
}

interface FeaturesClientProps {
  categories: FeatureCategory[];
}

export default function FeaturesClient({ categories }: FeaturesClientProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("matching");

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <p className="text-muted-foreground">No features available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  // Process categories from database
  const featureCategories = categories.map(cat => {
    const IconComponent = cat.icon ? iconMap[cat.icon] || Sparkles : Sparkles;
    let imageUrl = cat.image;
    let coupleImageUrl = cat.coupleImage;
    
    // Process image URLs
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      if (imageUrl.includes('/')) {
        const [bucket, ...rest] = imageUrl.split('/');
        imageUrl = getStorageUrl(bucket, rest.join('/'));
      } else {
        imageUrl = getStorageUrl("app-screenshots", imageUrl);
      }
    }
    
    if (coupleImageUrl && !coupleImageUrl.startsWith('http') && !coupleImageUrl.startsWith('/')) {
      if (coupleImageUrl.includes('/')) {
        const [bucket, ...rest] = coupleImageUrl.split('/');
        coupleImageUrl = getStorageUrl(bucket, rest.join('/'));
      } else {
        coupleImageUrl = getStorageUrl("couple-photos", coupleImageUrl);
      }
    }

    return {
      id: cat.id || cat.title.toLowerCase().replace(/\s+/g, '-'),
      title: cat.title,
      icon: IconComponent,
      color: cat.color || "bg-[#662D91]",
      image: imageUrl || getStorageUrl("app-screenshots", "qoupl_screenshot_03.png"),
      coupleImage: coupleImageUrl || getStorageUrl("couple-photos", "qoupl_couple_01.jpg"),
      features: cat.features?.map(f => ({
        icon: f.icon ? iconMap[f.icon] || Heart : Heart,
        title: f.title,
        description: f.description,
      })) || [],
    };
  });

  const activeCategory = featureCategories.find(cat => cat.id === activeTab) || featureCategories[0] || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#662D91]/5 dark:bg-[#662D91]/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Powerful Features for{" "}
                <span className="bg-[#662D91] bg-clip-text text-transparent">
                  Meaningful Connections
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to find your perfect match, all in one place.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Categories Tabs */}
      {activeCategory && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {featureCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id!)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                    activeTab === category.id
                      ? 'bg-primary text-white'
                      : 'bg-card border hover:border-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.title}</span>
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
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {activeCategory.title}
                  </h2>
                  <div className="space-y-4">
                    {activeCategory.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={idx} className="flex gap-4">
                          <div className={`w-12 h-12 ${activeCategory.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <FeatureIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src={activeCategory.image}
                    alt={activeCategory.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our waitlist and be among the first to try qoupl!
            </p>
            <button
              onClick={() => setIsWaitlistModalOpen(true)}
              className="px-8 py-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
            >
              Join the Waitlist
            </button>
          </motion.div>
        </div>
      </section>

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}

