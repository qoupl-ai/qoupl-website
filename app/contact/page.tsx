"use client";

import { Mail, Phone, MapPin, Send, MessageSquare, Heart, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@qoupl.ai",
      link: "mailto:support@qoupl.ai",
      color: "bg-[#662D91]"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 9103732229",
      link: "tel:+919103732229",
      color: "bg-[#662D91]"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "B-98, Sector-2, Noida, UP 201301",
      link: null,
      color: "bg-[#662D91]"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-8 md:pb-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#662D91] bg-[#662D91]/10 border border-[#662D91]/20 mb-6"
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>We&apos;re Here to Help</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Have questions about qoupl? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="relative h-full bg-card border border-border rounded-xl p-6 text-center hover:border-[#662D91]/30 transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${info.color} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-lg font-bold mb-2">{info.title}</h3>

                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-sm text-muted-foreground hover:text-[#662D91] transition-colors duration-300"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{info.details}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <form
                onSubmit={handleSubmit}
                className="relative bg-card border border-border rounded-xl p-6 md:p-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Send us a Message</h2>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 mb-4"
                    >
                      <CheckCircle className="h-7 w-7 text-white" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for contacting us. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#662D91]/50 transition-all duration-300 text-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#662D91]/50 transition-all duration-300 text-sm"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#662D91]/50 transition-all duration-300 text-sm"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#662D91]/50 transition-all duration-300 resize-none text-sm"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
                )}
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Let&apos;s Connect</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Whether you have questions about features, need technical support, or just want to say hello, we&apos;re here for you.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team is dedicated to providing you with the best possible experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[#662D91] flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      We value your feedback and are constantly working to improve qoupl.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="rounded-xl p-5 border border-border">
                <h3 className="text-base font-bold mb-2">Looking for quick answers?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our FAQ page for instant answers to common questions.
                </p>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#662D91] hover:underline"
                >
                  Visit FAQ
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" strokeWidth={1.5} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
