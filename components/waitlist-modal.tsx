"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Mail, Phone, User, Users, Sparkles, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
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

      // Reset after 5 seconds and close
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
        onClose();
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container - Responsive */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="relative w-full max-w-md my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl overflow-hidden rounded-3xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800">
                {/* Header with Gradient */}
                <CardHeader className="relative bg-gradient-to-br from-[#662D91] to-[#8B3DB8] text-white p-4 sm:p-5 md:p-6 space-y-0">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 z-10 group"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
                  </button>

                  {/* Logo Icon */}
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <Image
                      src="/images/quoupl.svg"
                      alt="qoupl"
                      width={40}
                      height={15}
                      className="h-5 sm:h-6 w-auto brightness-0 invert"
                    />
                    <div>
                      <CardTitle className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1">
                        Find Your Match
                      </CardTitle>
                      <CardDescription className="text-white/90 text-xs sm:text-sm mt-0">
                        Join thousands of college students finding love
                      </CardDescription>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                    <Heart className="h-20 w-20 sm:h-24 sm:w-24 fill-white" />
                  </div>
                </CardHeader>

                {/* Form Content */}
                <CardContent className="p-4 sm:p-5 md:p-6">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        >
                          <p className="text-sm sm:text-base text-red-600 dark:text-red-400 leading-relaxed">
                            {error}
                          </p>
                        </motion.div>
                      )}
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                          <Input
                            id="name"
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="pl-10 h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="pl-10 h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                          <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="pl-10 h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-1.5">
                        <Label htmlFor="gender" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
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
                              "flex h-9 w-full rounded-md border bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm",
                              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]",
                              "disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                              "text-gray-900 dark:text-white"
                            )}
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        </div>
                      </div>

                      {/* Age */}
                      <div className="space-y-1.5">
                        <Label htmlFor="age" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Age <span className="text-red-500">*</span> <span className="text-xs text-gray-500 dark:text-gray-500 font-normal">(18-25)</span>
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
                          className="h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                        />
                      </div>

                      {/* Looking For */}
                      <div className="space-y-1.5">
                        <Label htmlFor="lookingFor" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Looking For <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                          <select
                            id="lookingFor"
                            name="lookingFor"
                            required
                            value={formData.lookingFor}
                            onChange={handleChange}
                            className={cn(
                              "flex h-9 w-full rounded-md border bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 pl-10 pr-10 py-2 text-sm",
                              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]",
                              "disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                              "text-gray-900 dark:text-white"
                            )}
                          >
                            <option value="">Select preference</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="both">Both</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full font-semibold bg-gradient-to-r from-[#662D91] to-[#8B3DB8] hover:from-[#662D91]/90 hover:to-[#8B3DB8]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-2 sm:mt-4"
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
                      <p className="text-xs sm:text-sm text-center text-muted-foreground pt-2 leading-relaxed">
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
                  ) : (
                    // Success Message
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-4 sm:py-6 md:py-8"
                    >
                      {/* Animated Success Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="mb-4 sm:mb-6 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-[#662D91] to-[#8B3DB8] rounded-full relative"
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
                          className="absolute inset-0 bg-gradient-to-br from-[#662D91] to-[#8B3DB8] rounded-full"
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
                          <Heart className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-white fill-white relative z-10" />
                        </motion.div>
                      </motion.div>

                      {/* Success Title */}
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3"
                      >
                        You're On The List!
                      </motion.h3>

                      {/* Success Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6"
                      >
                        Thank you for showing interest in qoupl
                      </motion.p>

                      {/* Success Details */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-[#662D91]/10 to-[#8B3DB8]/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-[#662D91]/20"
                      >
                        <p className="text-sm sm:text-base text-foreground leading-relaxed">
                          We're thrilled to have you on board! You'll be among the first to know when qoupl launches.
                          We'll send you exclusive early access and special perks.
                        </p>
                      </motion.div>

                      {/* What's Next */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-muted-foreground"
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
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
