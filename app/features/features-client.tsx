"use client";

import { Heart, Shield, Zap, MessageCircle, Sparkles, Check, Lock, Eye, Star, Filter, Bell, Users, MapPin, Camera, Phone, ArrowRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { useState, useEffect } from "react";
import WaitlistModal from "@/components/waitlist-modal";
import { Button } from "@/components/ui/button";

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
  // Early return BEFORE hooks
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

  // Now render the main content component
  return <FeaturesContent categories={categories} />;
}

// Extracted component to fix Rules of Hooks violation
function FeaturesContent({ categories }: FeaturesClientProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

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

    const categoryId = cat.id || cat.title.toLowerCase().replace(/\s+/g, '-');
    
    // Debug: Log category processing
    if (process.env.NODE_ENV === 'development') {
      console.log('[Process Category]', {
        originalId: cat.id,
        originalTitle: cat.title,
        computedId: categoryId
      });
    }

    return {
      id: categoryId,
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

  // Set initial active tab to first category - use useMemo to derive initial state
  const initialTab = featureCategories.length > 0 ? featureCategories[0].id || "" : "";

  // Initialize activeTab only once when component mounts
  useEffect(() => {
    if (!activeTab || activeTab === "") {
      setActiveTab(initialTab);
      if (process.env.NODE_ENV === 'development') {
        console.log('[FeaturesClient] Setting initial tab to:', initialTab, featureCategories[0]?.title);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const activeCategory = featureCategories.find(cat => cat.id === activeTab) || featureCategories[0] || null;

  // Determine if we should show detailed sections - use multiple checks for reliability
  // Based on actual DB structure: categories are "AI-Powered Algorithm", "Compatibility Score", etc.
  const shouldShowDetailedSections = (() => {
    if (!activeCategory) return false;
    
    const id = (activeCategory.id || '').toLowerCase().trim();
    const title = (activeCategory.title || '').toLowerCase().trim();
    
    // Check for AI-Powered Algorithm (first category based on terminal output)
    if (id === 'ai-powered-algorithm' || title === 'ai-powered algorithm' || title.includes('ai-powered')) {
      return true;
    }
    
    // Check for Compatibility Score
    if (id === 'compatibility-score' || title === 'compatibility score' || title.includes('compatibility')) {
      return true;
    }
    
    // Check for Learning Preferences
    if (id === 'learning-preferences' || title === 'learning preferences' || title.includes('learning')) {
      return true;
    }
    
    // Check for Smart Filters
    if (id === 'smart-filters' || title === 'smart filters' || (title.includes('filter') && !title.includes('compatibility'))) {
      return true;
    }
    
    // First category check (AI-Powered Algorithm should be first)
    if (featureCategories.length > 0 && featureCategories[0]?.id === activeCategory.id) {
      return true;
    }
    
    return false;
  })();

  // Helper function to check if category is Smart Matching
  // Based on seed script: id='matching', title='Smart Matching'
  // This function uses multiple fallback checks to ensure it always works
  const isSmartMatching = (category: typeof activeCategory) => {
    if (!category) return false;
    
    const title = (category.title || '').trim();
    const id = (category.id || '').trim();
    const titleLower = title.toLowerCase();
    const idLower = id.toLowerCase();
    
    // Check 1: Match by ID (most reliable) - from seed script: id='matching'
    if (id === 'matching' || idLower === 'matching' || idLower === 'smart-matching') {
      return true;
    }
    
    // Check 2: Match by title - must contain "matching" but NOT "filter" or "filters"
    if (titleLower.includes('matching') && !titleLower.includes('filter')) {
      return true;
    }
    
    // Check 3: Exact title match
    if (titleLower === 'smart matching' || title === 'Smart Matching') {
      return true;
    }
    
    // Check 4: Check if it&apos;s the first category (Smart Matching should be first)
    const isFirstCategory = featureCategories.length > 0 && featureCategories[0]?.id === category.id;
    if (isFirstCategory && (titleLower.includes('smart') || titleLower.includes('matching'))) {
      return true;
    }
    
    return false;
  };

  // Debug logging in development - run only when activeCategory changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[FeaturesClient] Active Category:', activeCategory?.title, 'ID:', activeCategory?.id);
      console.log('[FeaturesClient] Is Smart Matching:', isSmartMatching(activeCategory));
      console.log('[FeaturesClient] All Categories:', featureCategories.map(c => ({ title: c.title, id: c.id })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]); // Only log when active category changes

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-10 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Features Designed for College Students
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Everything you need to find meaningful connections, all in one place. Discover how qoupl makes dating safe, smart, and enjoyable for college students.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Categories Tabs */}
      {activeCategory && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 overflow-x-auto pb-2">
              {featureCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id!)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm font-medium ${
                      activeTab === category.id
                        ? 'bg-[#662D91] text-white'
                        : 'bg-card border border-border hover:border-[#662D91]/30'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
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
                className="max-w-6xl mx-auto"
              >
                {/* Header Section - Only show for categories without detailed sections */}
                {!shouldShowDetailedSections && (
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                      {activeCategory.title}
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                      {activeCategory.title === 'Safety & Trust' && (
                        <>
                          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Your safety isn&apos;t negotiable—it&apos;s our foundation. We've built multiple layers of verification and protection to ensure qoupl remains a secure space exclusively for verified college students. Every user must complete college ID verification and photo verification before they can start matching.
                          </p>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            Our AI-powered moderation system works 24/7 to detect and remove inappropriate content, fake profiles, and suspicious behavior. Combined with end-to-end encryption for all messages and comprehensive privacy controls, you can focus on building connections without worrying about your safety.
                          </p>
                        </>
                      )}
                      {activeCategory.title === 'Communication' && (
                        <>
                          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Great relationships start with great conversations. qoupl provides rich communication tools that go beyond simple text messages. Share photos from your day, send voice messages to add personality to your conversations, and use smart conversation starters to break the ice naturally.
                          </p>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            Our messaging platform is designed to help you express yourself authentically and build deeper connections. With read receipts, typing indicators, and message reactions, you&apos;ll never wonder if someone is interested. All conversations are encrypted end-to-end, so your private messages stay private.
                          </p>
                        </>
                      )}
                      {activeCategory.title === 'Discovery' && (
                        <>
                          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Discover people who share your interests, values, and lifestyle within your college community. Our discovery features help you find connections beyond your immediate social circle, whether you&apos;re looking for someone in your major, someone who shares your hobbies, or someone who aligns with your relationship goals.
                          </p>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            With smart filters, location-based matching, and detailed profile insights, you can explore profiles that truly resonate with you. See who&apos;s online, discover mutual connections, and find people who are looking for the same type of relationship you are—all within your verified college community.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Features Grid - Only show if features exist */}
                {activeCategory.features && activeCategory.features.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-5 mb-10">
                    {activeCategory.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="group"
                      >
                        <div className="h-full bg-card border border-border rounded-xl p-6 hover:border-[#662D91]/30 transition-all duration-300">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${activeCategory.color} mb-4 group-hover:scale-105 transition-transform`}>
                            <FeatureIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                  </div>
                )}

                {/* Detailed Content Sections - Show specific content for each category */}
                <div className="space-y-8 mt-6">
                  {/* AI-Powered Algorithm Section - Only for AI-Powered Algorithm category */}
                  {(() => {
                    const id = (activeCategory?.id || '').toLowerCase().trim();
                    const title = (activeCategory?.title || '').toLowerCase().trim();
                    return id === 'ai-powered-algorithm' || title === 'ai-powered algorithm' || title.includes('ai-powered');
                  })() && (
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">AI-Powered Algorithm</h3>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed mb-6">
                        Our advanced machine learning system continuously analyzes your swiping patterns, conversation engagement, and profile interactions to understand your preferences. Unlike traditional dating apps that rely on simple filters, qoupl&apos;s AI algorithm learns from your behavior and gets smarter over time.
                      </p>
                      
                      {/* List with Icons - Single Column */}
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-6 w-6 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1.5">Behavioral Analysis</h4>
                            <p className="text-sm text-muted-foreground">Tracks your interactions to learn your preferences and understand what truly attracts you</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center flex-shrink-0">
                            <Heart className="h-6 w-6 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1.5">Personality Matching</h4>
                            <p className="text-sm text-muted-foreground">Matches based on compatible personality traits and communication styles</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center flex-shrink-0">
                            <Zap className="h-6 w-6 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1.5">Continuous Learning</h4>
                            <p className="text-sm text-muted-foreground">Improves suggestions with every interaction, getting smarter over time</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center flex-shrink-0">
                            <Star className="h-6 w-6 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1.5">Multi-Factor Analysis</h4>
                            <p className="text-sm text-muted-foreground">Considers interests, values, lifestyle, and relationship goals</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center flex-shrink-0">
                            <Users className="h-6 w-6 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1.5">Real-Time Adaptation</h4>
                            <p className="text-sm text-muted-foreground">Adjusts match suggestions based on your current preferences and behavior</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#662D91] flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-6 w-6 text-white" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1.5">Conversation Insights</h4>
                            <p className="text-sm text-muted-foreground">Analyzes conversation quality to identify meaningful connections</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-5 bg-muted dark:bg-[#161616] rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">How it works:</strong> When you swipe right on someone, our AI notes what caught your attention. When you start a conversation, it learns what topics resonate. When you exchange messages frequently, it understands connection quality. All this data feeds back into the algorithm, refining future match suggestions to be more aligned with your actual preferences, not just what you think you want.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Compatibility Score Section - Only for Compatibility Score category */}
                  {(() => {
                    const id = (activeCategory?.id || '').toLowerCase().trim();
                    const title = (activeCategory?.title || '').toLowerCase().trim();
                    return id === 'compatibility-score' || title === 'compatibility score' || title.includes('compatibility');
                  })() && (
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Compatibility Score</h3>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        Our algorithm analyzes multiple factors including shared interests, values alignment, communication style, and lifestyle preferences to calculate a comprehensive compatibility percentage. See detailed breakdowns of what makes you compatible before you even start chatting.
                      </p>
                      <div className="bg-muted dark:bg-[#161616] rounded-lg p-5 mb-4">
                        <h4 className="font-semibold text-base mb-4">How We Calculate Compatibility</h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#662D91] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold text-white">1</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-base mb-1.5">Shared Interests (30%)</h5>
                              <p className="text-sm text-muted-foreground">Common hobbies, activities, and passions you both enjoy</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#662D91] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold text-white">2</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-base mb-1.5">Values Alignment (25%)</h5>
                              <p className="text-sm text-muted-foreground">Core beliefs, life goals, and relationship expectations</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#662D91] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold text-white">3</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-base mb-1.5">Communication Style (20%)</h5>
                              <p className="text-sm text-muted-foreground">How you both prefer to communicate and express yourselves</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#662D91] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold text-white">4</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-base mb-1.5">Lifestyle Preferences (15%)</h5>
                              <p className="text-sm text-muted-foreground">Daily routines, social habits, and lifestyle choices</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#662D91] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold text-white">5</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-base mb-1.5">Personality Traits (10%)</h5>
                              <p className="text-sm text-muted-foreground">Compatible personality types and behavioral patterns</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        The more you use qoupl, the smarter our matching becomes. Every interaction helps refine your compatibility scores, ensuring you&apos;re connected with people who truly align with what you&apos;re looking for in a relationship.
                      </p>
                    </div>
                  )}

                  {/* Learning Preferences Section - Only for Learning Preferences category */}
                  {(() => {
                    const id = (activeCategory?.id || '').toLowerCase().trim();
                    const title = (activeCategory?.title || '').toLowerCase().trim();
                    return id === 'learning-preferences' || title === 'learning preferences' || title.includes('learning');
                  })() && (
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Heart className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Learning Preferences</h3>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        Every swipe, match, and conversation helps our AI understand you better. The system tracks which profiles you engage with most, what conversation topics resonate, and which matches lead to meaningful connections. Over time, your match suggestions become increasingly accurate and personalized.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-5 bg-muted dark:bg-[#161616] rounded-lg">
                          <div className="text-3xl font-bold text-[#662D91] dark:text-[#9333ea] mb-2">24/7</div>
                          <p className="text-sm text-muted-foreground">Continuous Learning</p>
                        </div>
                        <div className="text-center p-5 bg-muted dark:bg-[#161616] rounded-lg">
                          <div className="text-3xl font-bold text-[#662D91] dark:text-[#9333ea] mb-2">Real-time</div>
                          <p className="text-sm text-muted-foreground">Preference Updates</p>
                        </div>
                        <div className="text-center p-5 bg-muted dark:bg-[#161616] rounded-lg">
                          <div className="text-3xl font-bold text-[#662D91] dark:text-[#9333ea] mb-2">Better</div>
                          <p className="text-sm text-muted-foreground">Matches Over Time</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Smart Filters Section - Only for Smart Filters category */}
                  {(() => {
                    const id = (activeCategory?.id || '').toLowerCase().trim();
                    const title = (activeCategory?.title || '').toLowerCase().trim();
                    return id === 'smart-filters' || title === 'smart filters' || (title.includes('filter') && !title.includes('compatibility'));
                  })() && (
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Filter className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Smart Filters</h3>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        Find exactly what you&apos;re looking for with our comprehensive filtering system. Filter by major, interests, relationship goals, location, and more. Our smart discovery algorithm learns your preferences and surfaces profiles that match what you&apos;re seeking.
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed mb-6">
                        Whether you&apos;re looking for someone in your major, someone who shares your hobbies, or someone with similar relationship goals, our filters help you discover the right people efficiently. Save time by focusing on profiles that truly align with your preferences.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-base mb-1">Advanced Filters</h4>
                            <p className="text-sm text-muted-foreground">Filter by major, interests, age, location, and relationship goals</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-base mb-1">Location-Based</h4>
                            <p className="text-sm text-muted-foreground">Find matches on your campus or nearby colleges</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-base mb-1">Mutual Connections</h4>
                            <p className="text-sm text-muted-foreground">See shared friends and connections within your network</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-base mb-1">Activity Status</h4>
                            <p className="text-sm text-muted-foreground">See who&apos;s online and actively using the app</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 p-5 bg-muted dark:bg-[#161616] rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">How it works:</strong> Set your preferences once, and our smart filters will automatically show you profiles that match. You can combine multiple filters to narrow down your search, or let our AI suggest matches based on your filter preferences. The more you use filters, the better our system understands what you&apos;re looking for.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Content for Safety & Trust */}
                {activeCategory.title === 'Safety & Trust' && (
                  <div className="space-y-8 mt-12">
                    {/* Verification System Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Shield className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Multi-Layer Verification System</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Every qoupl user must complete two mandatory verification steps before they can start matching. This ensures that everyone on the platform is a verified college student, creating a safer and more authentic community.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">College ID Verification</h4>
                            <p className="text-xs text-muted-foreground">Mandatory verification using your official college ID ensures only verified students can join</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Photo Verification</h4>
                            <p className="text-xs text-muted-foreground">Real-time selfie verification confirms your identity matches your profile photos</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Age Verification</h4>
                            <p className="text-xs text-muted-foreground">Strict 18-25 age requirement enforced through ID verification</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Ongoing Monitoring</h4>
                            <p className="text-xs text-muted-foreground">Continuous verification checks ensure accounts remain authentic over time</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Moderation Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Eye className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">24/7 AI Moderation</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Our advanced AI moderation system works around the clock to monitor profiles, messages, and behavior patterns. It automatically detects and removes inappropriate content, fake profiles, spam, and users who violate our community guidelines.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        The system learns from user reports and continuously improves its detection capabilities. Combined with human review for complex cases, we maintain a safe environment where you can focus on building genuine connections without worrying about harassment or fake accounts.
                      </p>
                      <div className="bg-muted rounded-lg p-4 border border-border">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">What we monitor:</strong> Inappropriate photos, offensive language, spam messages, fake profiles, suspicious behavior patterns, and any content that violates our community standards. Users who violate these rules are immediately removed from the platform.
                        </p>
                      </div>
                    </div>

                    {/* Privacy & Security Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Lock className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Privacy & Data Protection</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Your privacy is paramount. All messages are encrypted end-to-end, meaning only you and your match can read your conversations. We never share your personal information with third parties, and you have complete control over who can see your profile and contact you.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-[#662D91] mb-1">End-to-End</div>
                          <p className="text-xs text-muted-foreground">Message Encryption</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-[#662D91] mb-1">Full</div>
                          <p className="text-xs text-muted-foreground">Privacy Controls</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-[#662D91] mb-1">Zero</div>
                          <p className="text-xs text-muted-foreground">Data Sharing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Content for Communication */}
                {activeCategory.title === 'Communication' && (
                  <div className="space-y-8 mt-12">
                    {/* Rich Messaging Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Rich Messaging Features</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Express yourself beyond words. Share photos from your day, send voice messages to add personality to your conversations, and use emojis and reactions to show how you&apos;re feeling. Our messaging platform is designed to help you build deeper connections through authentic communication.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        With read receipts and typing indicators, you&apos;ll always know when someone is engaged in the conversation. Message reactions let you respond quickly without typing, and our smart conversation starters help break the ice when you&apos;re not sure what to say.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Photo Sharing</h4>
                            <p className="text-xs text-muted-foreground">Share multiple photos in conversations to show your personality and daily life</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Voice Messages</h4>
                            <p className="text-xs text-muted-foreground">Send voice messages to add tone and personality to your conversations</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Message Reactions</h4>
                            <p className="text-xs text-muted-foreground">React to messages with emojis for quick, fun responses</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Smart Starters</h4>
                            <p className="text-xs text-muted-foreground">AI-suggested conversation starters based on shared interests</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Secure Communication Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Lock className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Secure & Private Messaging</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        All your conversations are protected with end-to-end encryption, meaning your messages are secure and private. Only you and your match can read your conversations—not even qoupl can access them. This ensures your private communications stay private.
                      </p>
                      <div className="bg-muted rounded-lg p-4 border border-border mt-6">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Your privacy matters:</strong> We use industry-standard encryption protocols to protect all messages. You can also control who can message you, block users if needed, and report any inappropriate behavior. Your safety and privacy are always our top priorities.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Content for Discovery */}
                {activeCategory.title === 'Discovery' && (
                  <div className="space-y-8 mt-12">
                    {/* Smart Discovery Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Filter className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Smart Discovery & Filters</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Find exactly what you&apos;re looking for with our comprehensive filtering system. Filter by major, interests, relationship goals, location, and more. Our smart discovery algorithm learns your preferences and surfaces profiles that match what you&apos;re seeking.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        Whether you&apos;re looking for someone in your major, someone who shares your hobbies, or someone with similar relationship goals, our filters help you discover the right people efficiently. Save time by focusing on profiles that truly align with your preferences.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Advanced Filters</h4>
                            <p className="text-xs text-muted-foreground">Filter by major, interests, age, location, and relationship goals</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Location-Based</h4>
                            <p className="text-xs text-muted-foreground">Find matches on your campus or nearby colleges</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Mutual Connections</h4>
                            <p className="text-xs text-muted-foreground">See shared friends and connections within your network</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Check className="h-5 w-5 text-[#662D91] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Activity Status</h4>
                            <p className="text-xs text-muted-foreground">See who&apos;s online and actively using the app</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Insights Section */}
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold">Detailed Profile Insights</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Every profile includes comprehensive information to help you make informed decisions. See compatibility scores, shared interests, mutual connections, and detailed answers to personality questions. This helps you understand potential matches before you even start a conversation.
                      </p>
                      <div className="bg-muted rounded-lg p-4 border border-border mt-6">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">What you&apos;ll see:</strong> Compatibility percentage, shared interests and hobbies, mutual friends, relationship goals, lifestyle preferences, and detailed profile information. All designed to help you find people who truly align with what you&apos;re looking for.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose qoupl?
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                qoupl is the only dating app built exclusively for college students, with mandatory verification, AI-powered matching, and comprehensive safety features designed to help you find meaningful connections in a safe, supportive environment.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                title: 'College-Exclusive',
                description: 'Connect only with verified college students aged 18-25. A community built for your campus life.'
              },
              {
                icon: Shield,
                title: 'Verified & Safe',
                description: 'Mandatory college ID and photo verification ensures everyone is who they say they are.'
              },
              {
                icon: Sparkles,
                title: 'AI-Powered',
                description: 'Advanced matching algorithm learns your preferences to suggest better matches over time.'
              },
              {
                icon: Heart,
                title: 'Meaningful Connections',
                description: 'Focus on building real relationships, not just casual swiping. Quality over quantity.'
              },
              {
                icon: Zap,
                title: 'Fast & Easy',
                description: 'Simple signup process gets you started in minutes. Start matching right away.'
              },
              {
                icon: MessageCircle,
                title: 'Rich Communication',
                description: 'Express yourself with photos, voice messages, and more. Build deeper connections.'
              }
            ].map((benefit, idx) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="h-full bg-card border border-border rounded-xl p-6 hover:border-[#662D91]/30 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#662D91] mb-4 group-hover:scale-105 transition-transform">
                      <BenefitIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Join thousands of college students who are already on the qoupl waitlist. Be among the first to experience our revolutionary dating platform when we launch.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Early access members will get priority access to all features, exclusive updates about our launch, and the opportunity to help shape the future of college dating. Don&apos;t miss out on being part of the qoupl community from day one.
              </p>
            </div>
            <Button
              onClick={() => setIsWaitlistModalOpen(true)}
              size="lg"
              className="px-8"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />
            </Button>
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
