'use client'

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
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

interface FAQListProps {
  questions: Array<{ q: string; a: string }>;
}

export function FAQList({ questions }: FAQListProps) {
  return (
    <>
      {questions.map((faq, faqIndex) => (
        <FAQItem
          key={faqIndex}
          question={faq.q}
          answer={faq.a}
        />
      ))}
    </>
  );
}
