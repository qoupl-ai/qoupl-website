"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Mail, Phone, User, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

    // Age validation for 18-25 years only
    const age = parseInt(formData.age);
    if (age < 18 || age > 25) {
      setError('Sorry! qoupl is only available for individuals aged 18 to 25 years.');
      setIsSubmitting(false);
      return;
    }

    // Simulate submission delay for better UX
    setTimeout(() => {
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
    }, 1500);
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

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Header */}
              <div className="relative bg-gradient-to-br from-[#a855f7] to-[#ec4899] p-8 text-white">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Decorative heart with centered logo */}
                <div className="absolute top-4 left-4 opacity-20">
                  <Heart className="h-12 w-12 fill-white" />
                </div>
                <div className="absolute top-4 left-4 h-12 w-12 flex items-center justify-center">
                  <Image
                    src="/images/quoupl.svg"
                    alt="qoupl"
                    width={32}
                    height={12}
                    className="h-3 w-auto brightness-0 invert"
                  />
                </div>

                {/* Header Content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10"
                >
                  <h2 className="text-3xl font-bold mb-2 mt-8">Find Your Match</h2>
                  <p className="text-white/90 text-sm">
                    Join thousands finding love through qoupl
                  </p>
                </motion.div>

                {/* Decorative heart bottom right */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <Heart className="h-16 w-16 fill-white" />
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error Message */}
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Gender & Age Row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Age */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Age * (18-25 only)
                        </label>
                        <input
                          type="number"
                          name="age"
                          required
                          min="18"
                          max="25"
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="21"
                        />
                      </div>
                    </div>

                    {/* Looking For */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Looking For *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          name="lookingFor"
                          required
                          value={formData.lookingFor}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select preference</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777] text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Joining...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Heart className="h-5 w-5 fill-white" />
                          Join Waitlist
                        </span>
                      )}
                    </Button>

                    {/* Privacy Note */}
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      By joining, you agree to our{" "}
                      <a href="/terms" className="text-[#a855f7] hover:underline">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-[#a855f7] hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                ) : (
                  // Success Message
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-12"
                  >
                    {/* Animated Success Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-full relative"
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
                        className="absolute inset-0 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-full"
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
                        <Heart className="h-12 w-12 text-white fill-white relative z-10" />
                      </motion.div>
                    </motion.div>

                    {/* Success Title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3"
                    >
                      You're On The List!
                    </motion.h3>

                    {/* Success Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-gray-600 dark:text-gray-400 mb-6"
                    >
                      Thank you for showing interest in qoupl
                    </motion.p>

                    {/* Success Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-[#a855f7]/10 to-[#ec4899]/10 rounded-2xl p-6 mb-4"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        We're thrilled to have you on board! You'll be among the first to know when qoupl launches.
                        We'll send you exclusive early access and special perks.
                      </p>
                    </motion.div>

                    {/* What's Next */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <p className="font-semibold text-gray-700 dark:text-gray-300">What's next?</p>
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
                          <Sparkles className="h-4 w-4 text-[#a855f7]" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
