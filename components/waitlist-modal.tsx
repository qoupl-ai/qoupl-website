"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { useGlobalContent } from "@/components/global-content-provider";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const { waitlistModal } = useGlobalContent();
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

  if (!waitlistModal || waitlistModal.show === false) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Waitlist modal content is missing in CMS.");
    }
    return null;
  }

  const logoSrc = resolveStorageUrl(waitlistModal.logo?.image);
  const logoWidth = waitlistModal.logo?.width ?? 0;
  const logoHeight = waitlistModal.logo?.height ?? 0;
  const CloseIcon = resolveLucideIcon(waitlistModal.close_button?.icon);
  const DecorativeIcon = resolveLucideIcon(waitlistModal.decorative?.icon);
  const SelectIcon = resolveLucideIcon(waitlistModal.select_icon);

  const NameIcon = resolveLucideIcon(waitlistModal.form?.name?.icon);
  const EmailIcon = resolveLucideIcon(waitlistModal.form?.email?.icon);
  const PhoneIcon = resolveLucideIcon(waitlistModal.form?.phone?.icon);
  const LookingForIcon = resolveLucideIcon(waitlistModal.form?.looking_for?.icon);

  const SubmitIcon = resolveLucideIcon(waitlistModal.submit?.icon);
  const LoadingIcon = resolveLucideIcon(waitlistModal.submit?.loading_icon);
  const SuccessIcon = resolveLucideIcon(waitlistModal.success?.icon);
  const ConfettiIcon = resolveLucideIcon(waitlistModal.success?.confetti_icon);

  const requiredIndicator = waitlistModal.required_indicator || "";
  const closeLabel = waitlistModal.close_button?.aria_label || "";

  const form = waitlistModal.form || {};
  const nameField = form.name || {};
  const emailField = form.email || {};
  const phoneField = form.phone || {};
  const genderField = form.gender || {};
  const ageField = form.age || {};
  const lookingForField = form.looking_for || {};

  const genderOptions = (genderField.options || []).filter((option) => option.show !== false);
  const lookingForOptions = (lookingForField.options || []).filter((option) => option.show !== false);

  const showName = nameField.show !== false;
  const showEmail = emailField.show !== false;
  const showPhone = phoneField.show !== false;
  const showGender = genderField.show !== false;
  const showAge = ageField.show !== false;
  const showLookingFor = lookingForField.show !== false;
  const showPrivacyNote = waitlistModal.privacy_note?.show !== false;

  if ((!logoSrc || logoWidth <= 0 || logoHeight <= 0 || !CloseIcon || !SubmitIcon || !SuccessIcon) && process.env.NODE_ENV !== "production") {
    throw new Error("Waitlist modal is missing required media or icons.");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Age validation from CMS configuration
    const age = parseInt(formData.age);
    const minAge = ageField.min || 0;
    const maxAge = ageField.max || 0;
    if ((minAge > 0 && age < minAge) || (maxAge > 0 && age > maxAge)) {
      setError(waitlistModal.validation?.age_error || "");
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
        throw new Error(data.error || waitlistModal.validation?.submit_error || "");
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
      const fallbackMessage = waitlistModal.validation?.submit_error || "";
      setError(err instanceof Error ? err.message : fallbackMessage);
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
                    aria-label={closeLabel}
                  >
                    {CloseIcon && (
                      <CloseIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Logo Icon */}
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    {waitlistModal.logo?.show !== false && logoSrc && (
                      <Image
                        src={logoSrc}
                        alt={waitlistModal.logo?.alt || ""}
                        width={logoWidth}
                        height={logoHeight}
                        className="h-5 sm:h-6 w-auto brightness-0 invert"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1">
                        {waitlistModal.header?.title || ""}
                      </CardTitle>
                      <CardDescription className="text-white/90 text-xs sm:text-sm mt-0">
                        {waitlistModal.header?.subtitle || ""}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  {waitlistModal.decorative?.show !== false && DecorativeIcon && (
                    <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                      <DecorativeIcon className="h-20 w-20 sm:h-24 sm:w-24 fill-white" />
                    </div>
                  )}
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
                      {showName && (
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {nameField.label || ""}
                            {requiredIndicator && <span className="text-red-500"> {requiredIndicator}</span>}
                          </Label>
                          <div className="relative">
                            {NameIcon && (
                              <NameIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            )}
                            <Input
                              id="name"
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder={nameField.placeholder || ""}
                              className="pl-10 h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {showEmail && (
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {emailField.label || ""}
                            {requiredIndicator && <span className="text-red-500"> {requiredIndicator}</span>}
                          </Label>
                          <div className="relative">
                            {EmailIcon && (
                              <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            )}
                            <Input
                              id="email"
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={emailField.placeholder || ""}
                              className="pl-10 h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {showPhone && (
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {phoneField.label || ""}
                            {requiredIndicator && <span className="text-red-500"> {requiredIndicator}</span>}
                          </Label>
                          <div className="relative">
                            {PhoneIcon && (
                              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            )}
                            <Input
                              id="phone"
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder={phoneField.placeholder || ""}
                              className="pl-10 h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Gender */}
                      {showGender && (
                        <div className="space-y-1.5">
                          <Label htmlFor="gender" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {genderField.label || ""}
                            {requiredIndicator && <span className="text-red-500"> {requiredIndicator}</span>}
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
                              <option value="">{genderField.placeholder || ""}</option>
                              {genderOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {SelectIcon && (
                              <SelectIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Age */}
                      {showAge && (
                        <div className="space-y-1.5">
                          <Label htmlFor="age" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {ageField.label || ""}
                            {requiredIndicator && <span className="text-red-500"> {requiredIndicator}</span>}
                            {ageField.helper && (
                              <span className="text-xs text-gray-500 dark:text-gray-500 font-normal">
                                {` ${ageField.helper}`}
                              </span>
                            )}
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            name="age"
                            required
                            min={ageField.min || undefined}
                            max={ageField.max || undefined}
                            value={formData.age}
                            onChange={handleChange}
                            placeholder={ageField.placeholder || ""}
                            className="h-9 text-sm bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-[#662D91] focus-visible:ring-offset-0 focus-visible:border-[#662D91]"
                          />
                        </div>
                      )}

                      {/* Looking For */}
                      {showLookingFor && (
                        <div className="space-y-1.5">
                          <Label htmlFor="lookingFor" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {lookingForField.label || ""}
                            {requiredIndicator && <span className="text-red-500"> {requiredIndicator}</span>}
                          </Label>
                          <div className="relative">
                            {LookingForIcon && (
                              <LookingForIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            )}
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
                              <option value="">{lookingForField.placeholder || ""}</option>
                              {lookingForOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {SelectIcon && (
                              <SelectIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#662D91] to-[#8B3DB8] hover:from-[#662D91]/90 hover:to-[#8B3DB8]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-2 sm:mt-4"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            {LoadingIcon && (
                              <LoadingIcon className="h-5 w-5 animate-spin" />
                            )}
                            {waitlistModal.submit?.loading_text || ""}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {SubmitIcon && <SubmitIcon className="h-5 w-5 fill-white" />}
                            {waitlistModal.submit?.text || ""}
                          </span>
                        )}
                      </Button>

                      {/* Privacy Note */}
                      {showPrivacyNote && (
                        <p className="text-xs sm:text-sm text-center text-muted-foreground pt-2 leading-relaxed">
                          {waitlistModal.privacy_note?.prefix || ""}
                          {waitlistModal.privacy_note?.terms_url && waitlistModal.privacy_note?.terms_label && (
                            <>
                              {" "}
                              <a
                                href={waitlistModal.privacy_note.terms_url}
                                className="text-[#662D91] hover:underline font-medium"
                              >
                                {waitlistModal.privacy_note.terms_label}
                              </a>
                            </>
                          )}
                          {waitlistModal.privacy_note?.separator || ""}
                          {waitlistModal.privacy_note?.privacy_url && waitlistModal.privacy_note?.privacy_label && (
                            <>
                              {" "}
                              <a
                                href={waitlistModal.privacy_note.privacy_url}
                                className="text-[#662D91] hover:underline font-medium"
                              >
                                {waitlistModal.privacy_note.privacy_label}
                              </a>
                            </>
                          )}
                          {waitlistModal.privacy_note?.suffix || ""}
                        </p>
                      )}
                    </form>
                  ) : waitlistModal.success?.show !== false ? (
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
                          {SuccessIcon && (
                            <SuccessIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-white fill-white relative z-10" />
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Success Title */}
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3"
                      >
                        {waitlistModal.success?.title || ""}
                      </motion.h3>

                      {/* Success Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6"
                      >
                        {waitlistModal.success?.subtitle || ""}
                      </motion.p>

                      {/* Success Details */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-[#662D91]/10 to-[#8B3DB8]/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-[#662D91]/20"
                      >
                        <p className="text-sm sm:text-base text-foreground leading-relaxed">
                          {waitlistModal.success?.details || ""}
                        </p>
                      </motion.div>

                      {/* What's Next */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-muted-foreground"
                      >
                        {waitlistModal.success?.next_title && (
                          <p className="font-semibold text-foreground">
                            {waitlistModal.success.next_title}
                          </p>
                        )}
                        {(waitlistModal.success?.next_items || []).map((item, index) => (
                          <p key={`${item}-${index}`}>{item}</p>
                        ))}
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
                            {ConfettiIcon && (
                              <ConfettiIcon className="h-4 w-4 text-[#662D91]" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
