"use client";

import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

interface FAQClientProps {
  faqs: FAQCategory[];
  pageContent?: {
    title?: string;
    description?: string;
    cta?: {
      title?: string;
      description?: string;
      email?: string;
      emailText?: string;
      contactText?: string;
    };
  };
}

function FAQItemComponent({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:text-title transition-colors group"
      >
        <span className="text-fluid-base font-semibold leading-snug pr-4 text-title group-hover:text-primary flex-1">{question}</span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus className="h-4 w-4 text-secondary-text" strokeWidth={1.5} />
          ) : (
            <Plus className="h-4 w-4 text-secondary-text" strokeWidth={1.5} />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-4 px-1 text-fluid-sm text-paragraph leading-relaxed animate-in fade-in-50 slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQClient({ faqs, pageContent }: FAQClientProps) {
  if (!faqs || faqs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center py-16">
            <p className="text-muted-foreground">No FAQs available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-fluid-6xl font-bold leading-tight mb-3 text-title">
            {pageContent?.title || "Frequently Asked Questions"}
          </h1>
          <p className="text-fluid-base text-paragraph leading-relaxed max-w-prose mx-auto">
            {pageContent?.description || "Find answers to common questions about qoupl. Can't find what you're looking for? Contact our support team."}
          </p>
        </div>

        {/* FAQ Categories - Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              {/* Category Header */}
              <div className="mb-1">
                <h2 className="text-fluid-2xl font-bold leading-snug text-primary">
                  {category.category}
                </h2>
              </div>
              
              {/* FAQ Items */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="divide-y divide-border">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="px-5">
                      <FAQItemComponent
                        question={faq.q}
                        answer={faq.a}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {pageContent?.cta && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-4">
            <HelpCircle className="h-6 w-6 text-secondary-text" strokeWidth={1.5} />
          </div>
            {pageContent.cta.title && (
              <h3 className="text-fluid-2xl font-bold leading-snug mb-2 text-title">{pageContent.cta.title}</h3>
            )}
            {pageContent.cta.description && (
          <p className="text-fluid-sm text-paragraph leading-relaxed mb-6">
                {pageContent.cta.description}
          </p>
            )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {pageContent.cta.email && (
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-white"
            >
                  <a href={`mailto:${pageContent.cta.email}`}>
                    {pageContent.cta.emailText || "Email Support"}
              </a>
            </Button>
              )}
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <Link href="/contact">
                  {pageContent.cta.contactText || "Contact Us"}
              </Link>
            </Button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

