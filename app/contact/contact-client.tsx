"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { resolveLucideIcon } from "@/lib/utils/icons";
import type {
  ContactHeroSectionData,
  ContactInfoDetailsSectionData,
  ContactInfoSectionData,
} from "@/types/section";

interface ContactClientProps {
  hero?: ContactHeroSectionData;
  contactInfo?: ContactInfoSectionData;
  contactInfoDetails?: ContactInfoDetailsSectionData;
}

const hasText = (value?: string | null) => (value ?? "").trim().length > 0;

export default function ContactClient({
  hero,
  contactInfo,
  contactInfoDetails,
}: ContactClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroTitle = hero?.title ?? "";
  const heroSubtitle = hero?.subtitle ?? "";
  const heroBadgeText = hero?.badge?.text ?? "";
  const HeroBadgeIcon = resolveLucideIcon(hero?.badge?.icon);
  const showHeroBadge = hero?.badge?.show === true && hasText(heroBadgeText);
  const showHeroSection =
    !!hero && (showHeroBadge || hasText(heroTitle) || hasText(heroSubtitle));

  if (hero && !showHeroSection && process.env.NODE_ENV !== "production") {
    throw new Error("Contact hero section has no visible content.");
  }

  const rawContactItems = Array.isArray(contactInfo?.items)
    ? contactInfo.items.filter((item) => item.show !== false)
    : [];

  const contactItems = rawContactItems
    .map((item) => {
      const title = item.title ?? "";
      const details = item.details ?? "";
      const icon = resolveLucideIcon(item.icon);
      const hasContent = hasText(title) || hasText(details);

      return {
        title,
        details,
        link: item.link ?? null,
        icon,
        hasContent,
      };
    })
    .filter((item) => item.hasContent && item.icon);

  if (
    rawContactItems.some(
      (item) =>
        (hasText(item.title) || hasText(item.details)) && !resolveLucideIcon(item.icon)
    ) &&
    process.env.NODE_ENV !== "production"
  ) {
    throw new Error("Contact info items must define valid icons.");
  }

  const contactInfoTitle = contactInfo?.title ?? "";
  const showContactInfoSection =
    !!contactInfo && (hasText(contactInfoTitle) || contactItems.length > 0);

  if (contactInfo && !showContactInfoSection && process.env.NODE_ENV !== "production") {
    throw new Error("Contact info section has no visible content.");
  }

  const rawInfoItems = Array.isArray(contactInfoDetails?.items)
    ? contactInfoDetails.items.filter((item) => item.show !== false)
    : [];

  const infoItems = rawInfoItems
    .map((item) => {
      const title = item.title ?? "";
      const description = item.description ?? "";
      const icon = resolveLucideIcon(item.icon);
      const hasContent = hasText(title) || hasText(description);

      return {
        title,
        description,
        icon,
        hasContent,
      };
    })
    .filter((item) => item.hasContent && item.icon);

  if (
    rawInfoItems.some(
      (item) =>
        (hasText(item.title) || hasText(item.description)) && !resolveLucideIcon(item.icon)
    ) &&
    process.env.NODE_ENV !== "production"
  ) {
    throw new Error("Contact info detail items must define valid icons.");
  }

  const detailsTitle = contactInfoDetails?.title ?? "";
  const detailsDescription = contactInfoDetails?.description ?? "";

  const faqLink = contactInfoDetails?.faq_link;
  const faqLinkText = faqLink?.text ?? "";
  const faqLinkTitle = faqLink?.title ?? "";
  const faqLinkDescription = faqLink?.description ?? "";
  const faqLinkUrl = faqLink?.url ?? "";
  const faqLinkIcon = resolveLucideIcon(faqLink?.icon);
  const showFaqLink =
    faqLink?.show !== false &&
    (hasText(faqLinkTitle) || hasText(faqLinkDescription) || hasText(faqLinkText));

  const form = contactInfoDetails?.form;
  const showForm = form?.show !== false;
  const requiredIndicator = form?.required_indicator ?? "";
  const SubmitIcon = resolveLucideIcon(form?.submit_icon);
  const SuccessIcon = resolveLucideIcon(form?.success_icon);

  const requiredFormFields = [
    form?.title,
    form?.name_label,
    form?.name_placeholder,
    form?.email_label,
    form?.email_placeholder,
    form?.subject_label,
    form?.subject_placeholder,
    form?.message_label,
    form?.message_placeholder,
    form?.submit_text,
    form?.sending_text,
    form?.success_title,
    form?.success_message,
  ];

  const hasFormFields = requiredFormFields.every((value) => hasText(value ?? ""));
  const showFormSection = showForm && hasFormFields;

  if (showForm && !hasFormFields && process.env.NODE_ENV !== "production") {
    throw new Error("Contact form data is missing required fields.");
  }

  const showDetailsSection =
    !!contactInfoDetails &&
    (hasText(detailsTitle) ||
      hasText(detailsDescription) ||
      infoItems.length > 0 ||
      showFaqLink ||
      showFormSection);

  if (contactInfoDetails && !showDetailsSection && process.env.NODE_ENV !== "production") {
    throw new Error("Contact info details section has no visible content.");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "");
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      if (hasText(form?.toast_success)) {
        toast.success(form?.toast_success);
      }

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);

      const errorMessage = err instanceof Error ? err.message : "";
      const fallbackMessage = errorMessage || (form?.error_message ?? "");
      const toastFallback = form?.toast_error ?? "";

      setError(hasText(fallbackMessage) ? fallbackMessage : null);

      if (hasText(errorMessage)) {
        toast.error(errorMessage);
      } else if (hasText(toastFallback)) {
        toast.error(toastFallback);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {showHeroSection && (
        <section className="relative overflow-hidden bg-[#662D91]/5 dark:bg-[#662D91]/10 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              {showHeroBadge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
                >
                  {HeroBadgeIcon && <HeroBadgeIcon className="h-4 w-4" />}
                  <span className="text-sm font-semibold">{heroBadgeText}</span>
                </motion.div>
              )}

              {hasText(heroTitle) && (
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                  {heroTitle}
                </h1>
              )}

              {hasText(heroSubtitle) && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {heroSubtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#662D91]/10 rounded-full blur-3xl" />
        </section>
      )}

      {/* Contact Info Cards */}
      {showContactInfoSection && (
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {hasText(contactInfoTitle) && (
              <h2 className="text-3xl font-bold text-center mb-12">
                {contactInfoTitle}
              </h2>
            )}
            {contactItems.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {contactItems.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={`${info.title}-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -8 }}
                      className="group relative"
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-[#662D91] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                      {/* Card */}
                      <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#662D91] mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          {Icon && <Icon className="h-8 w-8 text-white" />}
                        </div>

                        {hasText(info.title) && (
                          <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                        )}

                        {hasText(info.details) && (
                          <>
                            {info.link ? (
                              <a
                                href={info.link}
                                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                              >
                                {info.details}
                              </a>
                            ) : (
                              <p className="text-muted-foreground">{info.details}</p>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Contact Form */}
            {showDetailsSection && (
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Form */}
                {showFormSection && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-[#662D91]/10 rounded-3xl blur-xl" />

                    <form
                      onSubmit={handleSubmit}
                      className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-10"
                    >
                      <h2 className="text-3xl font-bold mb-6">{form?.title}</h2>

                      {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                      )}

                      {isSubmitted ? (
                        <div className="text-center py-8">
                          {SuccessIcon && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4"
                            >
                              <SuccessIcon className="h-8 w-8 text-white" />
                            </motion.div>
                          )}
                          {hasText(form?.success_title) && (
                            <h3 className="text-2xl font-bold mb-2">{form?.success_title}</h3>
                          )}
                          {hasText(form?.success_message) && (
                            <p className="text-muted-foreground">{form?.success_message}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-semibold mb-2">
                              {form?.name_label}
                              {hasText(requiredIndicator) && (
                                <span className="text-red-500"> {requiredIndicator}</span>
                              )}
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                              placeholder={form?.name_placeholder}
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2">
                              {form?.email_label}
                              {hasText(requiredIndicator) && (
                                <span className="text-red-500"> {requiredIndicator}</span>
                              )}
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                              placeholder={form?.email_placeholder}
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                              {form?.subject_label}
                              {hasText(requiredIndicator) && (
                                <span className="text-red-500"> {requiredIndicator}</span>
                              )}
                            </label>
                            <input
                              type="text"
                              id="subject"
                              value={formData.subject}
                              onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                              placeholder={form?.subject_placeholder}
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="message" className="block text-sm font-semibold mb-2">
                              {form?.message_label}
                              {hasText(requiredIndicator) && (
                                <span className="text-red-500"> {requiredIndicator}</span>
                              )}
                            </label>
                            <textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                              }
                              rows={6}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none"
                              placeholder={form?.message_placeholder}
                              required
                            />
                          </div>

                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                            className="w-full py-4 bg-[#662D91] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                {form?.sending_text}
                              </>
                            ) : (
                              <>
                                {SubmitIcon && <SubmitIcon className="h-5 w-5" />}
                                {form?.submit_text}
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* Info Section */}
                {(hasText(detailsTitle) || hasText(detailsDescription) || infoItems.length > 0 || showFaqLink) && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="space-y-8"
                  >
                    {hasText(detailsTitle) && (
                      <div>
                        <h2 className="text-3xl font-bold mb-6">{detailsTitle}</h2>
                        {hasText(detailsDescription) && (
                          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            {detailsDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {infoItems.length > 0 && (
                      <div className="space-y-6">
                        {infoItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <div key={`${item.title}-${index}`} className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-[#662D91] flex items-center justify-center">
                                  {Icon && <Icon className="h-6 w-6 text-white" />}
                                </div>
                              </div>
                              <div>
                                {hasText(item.title) && (
                                  <h3 className="font-bold mb-2">{item.title}</h3>
                                )}
                                {hasText(item.description) && (
                                  <p className="text-muted-foreground">{item.description}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* FAQ Link */}
                    {showFaqLink && (
                      <div className="bg-[#662D91]/5 rounded-2xl p-6 border border-primary/20">
                        {hasText(faqLinkTitle) && (
                          <h3 className="font-bold mb-2">{faqLinkTitle}</h3>
                        )}
                        {hasText(faqLinkDescription) && (
                          <p className="text-muted-foreground mb-4">{faqLinkDescription}</p>
                        )}
                        {hasText(faqLinkText) && hasText(faqLinkUrl) && (
                          <Link
                            href={faqLinkUrl}
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300"
                          >
                            {faqLinkText}
                            {faqLinkIcon && <faqLinkIcon className="h-4 w-4 rotate-180" />}
                          </Link>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
