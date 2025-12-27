"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";

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
}

function FAQItemComponent({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-primary transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <div className="flex-shrink-0">
          {isOpen ? (
            <Minus className="h-5 w-5 text-primary" />
          ) : (
            <Plus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-5 pr-12 text-muted-foreground leading-relaxed animate-in fade-in-50 slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQClient({ faqs }: FAQClientProps) {
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
      <div className="container mx-auto px-4 py-16 max-w-6xl">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-[#662D91] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about qoupl. Can&apos;t find what you&apos;re
            looking for? Contact our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <h2 className="text-xl font-bold text-primary">
                  {category.category}
                </h2>
              </div>
              <div className="bg-card rounded-lg border p-6">
                {category.questions.map((faq, faqIndex) => (
                  <FAQItemComponent
                    key={faqIndex}
                    question={faq.q}
                    answer={faq.a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-[#662D91]/10 p-8 rounded-lg border border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@qoupl.ai"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
            >
              Email Support
            </a>
            <a
              href="mailto:help@qoupl.ai"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/10 transition-colors font-semibold"
            >
              Get Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

