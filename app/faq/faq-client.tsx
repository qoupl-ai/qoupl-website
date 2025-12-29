"use client";

import { useState, type ComponentType } from "react";
import { resolveLucideIcon } from "@/lib/utils/icons";

interface FAQItem {
  q: string;
  a: string;
  order_index?: number;
  show?: boolean;
}

interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

interface FAQClientProps {
  faqs: FAQCategory[];
  ui: {
    hero?: {
      title?: string;
      titleHighlight?: string;
      description?: string;
      show?: boolean;
    };
    icons?: {
      expand?: string;
      collapse?: string;
    };
    empty_state?: {
      show?: boolean;
      icon?: string;
      title?: string;
      description?: string;
    };
    cta?: {
      show?: boolean;
      title?: string;
      description?: string;
      primary?: {
        label?: string;
        link?: string;
        icon?: string;
        show?: boolean;
      };
      secondary?: {
        label?: string;
        link?: string;
        icon?: string;
        show?: boolean;
      };
    };
  };
}

function FAQItemComponent({
  question,
  answer,
  ExpandIcon,
  CollapseIcon,
}: {
  question: string;
  answer: string;
  ExpandIcon?: ComponentType<{ className?: string }>;
  CollapseIcon?: ComponentType<{ className?: string }>;
}) {
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
            CollapseIcon ? <CollapseIcon className="h-5 w-5 text-primary" /> : null
          ) : (
            ExpandIcon ? <ExpandIcon className="h-5 w-5 text-muted-foreground" /> : null
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

export default function FAQClient({ faqs, ui }: FAQClientProps) {
  const hero = ui.hero || {};
  const emptyState = ui.empty_state || {};
  const cta = ui.cta || {};
  const primaryCta = cta.primary || {};
  const secondaryCta = cta.secondary || {};

  const ExpandIcon = resolveLucideIcon(ui.icons?.expand);
  const CollapseIcon = resolveLucideIcon(ui.icons?.collapse);
  const EmptyIcon = resolveLucideIcon(emptyState.icon);
  const PrimaryIcon = resolveLucideIcon(primaryCta.icon);
  const SecondaryIcon = resolveLucideIcon(secondaryCta.icon);

  if ((!ExpandIcon || !CollapseIcon) && process.env.NODE_ENV !== "production") {
    throw new Error("FAQ icons are missing or invalid in CMS.");
  }
  if (emptyState.icon && !EmptyIcon && process.env.NODE_ENV !== "production") {
    throw new Error("FAQ empty state icon is missing or invalid in CMS.");
  }
  if (primaryCta.icon && !PrimaryIcon && process.env.NODE_ENV !== "production") {
    throw new Error("FAQ primary CTA icon is missing or invalid in CMS.");
  }
  if (secondaryCta.icon && !SecondaryIcon && process.env.NODE_ENV !== "production") {
    throw new Error("FAQ secondary CTA icon is missing or invalid in CMS.");
  }

  const showHero = hero.show !== false && (hero.title || hero.description);
  const showEmpty = emptyState.show !== false && !faqs.length;
  const showCta = cta.show !== false && (cta.title || cta.description || primaryCta.label || secondaryCta.label);

  const title = hero.title || "";
  const highlight = hero.titleHighlight || "";

  const renderTitle = () => {
    if (!highlight) return title;
    const index = title.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return title;
    const before = title.slice(0, index);
    const match = title.slice(index, index + highlight.length);
    const after = title.slice(index + highlight.length);
    return (
      <>
        {before}
        <span className="bg-[#662D91] bg-clip-text text-transparent">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">

        {showHero && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {renderTitle()}
            </h1>
            {hero.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {hero.description}
              </p>
            )}
          </div>
        )}

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
                    ExpandIcon={ExpandIcon || undefined}
                    CollapseIcon={CollapseIcon || undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {showEmpty && (
          <div className="text-center py-16">
            {EmptyIcon && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <EmptyIcon className="h-10 w-10 text-primary" />
              </div>
            )}
            {emptyState.title && (
              <h3 className="text-2xl font-bold mb-2">{emptyState.title}</h3>
            )}
            {emptyState.description && (
              <p className="text-muted-foreground">{emptyState.description}</p>
            )}
          </div>
        )}

        {showCta && (
          <div className="mt-16 text-center bg-[#662D91]/10 p-8 rounded-lg border border-primary/20">
            {cta.title && <h3 className="text-2xl font-bold mb-4">{cta.title}</h3>}
            {cta.description && (
              <p className="text-muted-foreground mb-6">{cta.description}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCta.show !== false && primaryCta.label && primaryCta.link && (
                <a
                  href={primaryCta.link}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
                >
                  {PrimaryIcon && <PrimaryIcon className="mr-2 h-4 w-4" />}
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta.show !== false && secondaryCta.label && secondaryCta.link && (
                <a
                  href={secondaryCta.link}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/10 transition-colors font-semibold"
                >
                  {SecondaryIcon && <SecondaryIcon className="mr-2 h-4 w-4" />}
                  {secondaryCta.label}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
