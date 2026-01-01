"use client";

import { motion } from "framer-motion";
import { Heart, Mail, Phone, User, Users, Sparkles, ChevronDown, Zap, Star, Shield, Lock, Sparkles as SparklesIcon, MessageCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface WaitlistPageData {
  sections: Array<{
    type: string;
    content: Record<string, any>;
  }>;
}

interface WaitlistPageClientProps {
  data?: WaitlistPageData;
}

export default function WaitlistPageClient({ data }: WaitlistPageClientProps = { data: { sections: [] } }) {
  // Extract sections from data
  const heroSection = data?.sections?.find(s => s.type === 'hero');
  const benefitsSection = data?.sections?.find(s => s.type === 'benefits');
  const whyJoinSection = data?.sections?.find(s => s.type === 'why-join');
  const whatToExpectSection = data?.sections?.find(s => s.type === 'what-to-expect');
  const successSection = data?.sections?.find(s => s.type === 'success-message');

  const hero = heroSection?.content || {};
  const benefits = benefitsSection?.content?.items || [];
  const whyJoin = whyJoinSection?.content || {};
  const whatToExpect = whatToExpectSection?.content?.steps || [];
  const successContent = successSection?.content || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    lookingFor: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Age validation for 18-25 years only and college student requirement
    const age = parseInt(formData.age);
    if (age < 18 || age > 25) {
      setError('Sorry! qoupl is exclusively for college students aged 18 to 25 years. You must be a current college student to join.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          age: formData.age,
          lookingFor: formData.lookingFor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      // Success
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          gender: "",
          age: "",
          lookingFor: "",
        });
      }, 5000);
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'Failed to join waitlist. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#662D91]/10 dark:bg-[#662D91]/15 mb-6 text-[#662D91]"
            >
              <Heart className="h-8 w-8 md:h-10 md:w-10 fill-[#662D91]" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-foreground">
              {hero.title || "Join the Waitlist"}
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {hero.description || "Be among the first to find your perfect match on qoupl. Get exclusive early access, special perks, and be part of a community built exclusively for college students."}
            </p>

            {/* Benefits Grid */}
            {benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8"
              >
                {benefits.map((benefit: any, index: number) => {
                  const IconMap: Record<string, any> = {
                    'zap': Zap,
                    'star': Star,
                    'shield': Shield,
                  };
                  const Icon = IconMap[benefit.icon?.toLowerCase()] || Zap;
                  return (
                    <div key={index} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-[#662D91]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#662D91]" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {whyJoin.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {whyJoin.title}
                </h2>
                {whyJoin.description && (
                  <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                    {whyJoin.description}
                  </p>
                )}
              </motion.div>
            )}

            {whyJoin.features && whyJoin.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyJoin.features.map((feature: any, index: number) => {
                  const IconMap: Record<string, any> = {
                    'sparkles': SparklesIcon,
                    'lock': Lock,
                    'message-circle': MessageCircle,
                    'trending-up': TrendingUp,
                  };
                  const Icon = IconMap[feature.icon?.toLowerCase()] || SparklesIcon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                      className="flex gap-4 p-6 bg-card border border-border rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#662D91]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-[#662D91]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {whatToExpectSection?.content?.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {whatToExpectSection.content.title}
                </h2>
                {whatToExpectSection.content.description && (
                  <p className="text-base text-muted-foreground">
                    {whatToExpectSection.content.description}
                  </p>
                )}
              </motion.div>
            )}

            <div className="space-y-6">
              {(whatToExpect.length > 0 ? whatToExpect : [
                {
                  step: "1",
                  title: "Join the Waitlist",
                  description: "Fill out the form below with your details. It only takes a minute!",
                },
                {
                  step: "2",
                  title: "Get Confirmation",
                  description: "You'll receive a confirmation email with all the details about your waitlist position.",
                },
                {
                  step: "3",
                  title: "Stay Updated",
                  description: "We'll keep you informed about launch updates, exclusive features, and early access opportunities.",
                },
                {
                  step: "4",
                  title: "Early Access",
                  description: "When we launch, you'll be among the first to access qoupl with special perks and priority features.",
                },
              ]).map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-[#662D91] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{item.step || (idx + 1).toString()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card border border-border rounded-xl p-6 md:p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                        {error}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="pl-10 h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="pl-10 h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="pl-10 h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-sm font-semibold">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className={cn(
                          "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
                          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#662D91] focus-visible:ring-offset-0",
                          "disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        )}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Age */}
                  <div className="space-y-1.5">
                    <Label htmlFor="age" className="text-sm font-semibold">
                      Age <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground font-normal">(18-25)</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      name="age"
                      required
                      min="18"
                      max="25"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="21"
                      className="h-10 text-sm"
                    />
                  </div>

                  {/* Looking For */}
                  <div className="space-y-1.5">
                    <Label htmlFor="lookingFor" className="text-sm font-semibold">
                      Looking For <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <select
                        id="lookingFor"
                        name="lookingFor"
                        required
                        value={formData.lookingFor}
                        onChange={handleChange}
                        className={cn(
                          "flex h-10 w-full rounded-md border bg-background pl-10 pr-10 py-2 text-sm",
                          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#662D91] focus-visible:ring-offset-0",
                          "disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        )}
                      >
                        <option value="">Select preference</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="both">Both</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full font-semibold bg-[#662D91] hover:bg-[#662D91]/90 text-white mt-4"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-white" />
                        Join Waitlist
                      </span>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <p className="text-xs text-center text-muted-foreground pt-2 leading-relaxed">
                    qoupl is exclusively for college students aged 18-25. By joining, you agree to our{" "}
                    <a href="/terms" className="text-[#662D91] hover:underline font-medium">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#662D91] hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </motion.div>
            ) : (
              // Success Message
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-border rounded-xl p-8 md:p-12 text-center relative"
              >
                {/* Animated Success Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mb-6 inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-[#662D91] rounded-full relative"
                >
                  {/* Pulsing ring effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-[#662D91] rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="h-12 w-12 md:h-14 md:w-14 text-white fill-white relative z-10" />
                  </motion.div>
                </motion.div>

                {/* Success Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-3"
                >
                  You're On The List!
                </motion.h3>

                {/* Success Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-muted-foreground mb-6"
                >
                  Thank you for showing interest in qoupl
                </motion.p>

                {/* Success Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#662D91]/10 rounded-xl p-6 mb-6 border border-[#662D91]/20"
                >
                  <p className="text-base text-foreground leading-relaxed">
                    We're thrilled to have you on board! You'll be among the first to know when qoupl launches.
                    We'll send you exclusive early access and special perks.
                  </p>
                </motion.div>

                {/* What's Next */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2 text-sm md:text-base text-muted-foreground"
                >
                  <p className="font-semibold text-foreground">What's next?</p>
                  <p>📧 Check your inbox for a confirmation email</p>
                  <p>💜 Follow us on social media for updates</p>
                  <p>🎉 Get ready to find your perfect match!</p>
                </motion.div>

                {/* Confetti-like sparkles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [-20, -100],
                        scale: [0, 1, 0.5],
                        x: [0, (i % 2 === 0 ? 1 : -1) * 50],
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.2 + i * 0.1,
                        ease: "easeOut",
                      }}
                      className="absolute left-1/2 top-1/4"
                    >
                      <Sparkles className="h-4 w-4 text-[#662D91]" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

