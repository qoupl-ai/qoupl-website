"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { useGlobalContent } from "@/components/global-content-provider";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, icon, children }: LegalPageLayoutProps) {
  const { legalUi } = useGlobalContent();

  if (!legalUi) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Legal UI content is missing in CMS.');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Compact & Modern */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/3 via-transparent to-transparent dark:from-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            {icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 dark:bg-primary/15 mb-4 text-primary"
              >
                {icon}
              </motion.div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-[#662D91] via-[#8B3DB8] to-[#662D91] bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {lastUpdated && (
              <p className="text-xs md:text-sm text-muted-foreground">
                {legalUi.last_updated_label || ''}{" "}
                <span className="text-foreground/80">{lastUpdated}</span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section - Optimized Typography */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Max width optimized for 50-75 characters per line */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface LegalSectionProps {
  heading: string;
  content?: string;
  items?: LegalItemValue[];
  isImportant?: boolean;
  index: number;
}

// Helper function to highlight important terms with brand color
function highlightImportantTerms(text: string, terms: string[]): ReactNode {
  if (!text) return null;

  let parts: (string | ReactNode)[] = [text];

  terms.forEach(term => {
    const newParts: (string | ReactNode)[] = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        const regex = new RegExp(`(${term})`, 'gi');
        const splitParts = part.split(regex);
        splitParts.forEach((splitPart, i) => {
          if (i % 2 === 1) {
            // This is the matched term
            newParts.push(
              <span key={`${term}-${i}`} className="font-semibold text-[#662D91] dark:text-[#8B3DB8]">
                {splitPart}
              </span>
            );
          } else if (splitPart) {
            newParts.push(splitPart);
          }
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return <>{parts}</>;
}

// Clean item text by removing emoji markers
function cleanItemText(item: string): string {
  return item.replace(/^[✅❌⚠️🔒📍]/, '').trim();
}

type LegalItemValue =
  | string
  | {
      text?: string
      icon?: string
      show?: boolean
    }

function normalizeItem(item: LegalItemValue) {
  if (typeof item === 'string') {
    return {
      text: cleanItemText(item),
      icon: undefined,
      show: true,
    }
  }

  return {
    text: item?.text ?? '',
    icon: item?.icon,
    show: item?.show !== false,
  }
}

export function LegalSection({ heading, content, items, isImportant, index }: LegalSectionProps) {
  const { legalUi } = useGlobalContent();

  if (!legalUi) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Legal UI content is missing in CMS.');
    }
    return null;
  }

  const highlightTerms = legalUi.highlight_terms || [];
  const DefaultIcon = resolveLucideIcon(legalUi.default_item_icon);

  if (!DefaultIcon && items && items.length > 0 && process.env.NODE_ENV !== 'production') {
    throw new Error('Legal UI default item icon is missing or invalid.');
  }

  const headingId = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const normalizedItems = (items || [])
    .map((item) => normalizeItem(item as LegalItemValue))
    .filter((item) => item.show && item.text.length > 0)

  return (
    <motion.section
      id={headingId}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={`mb-8 md:mb-10 scroll-mt-20 ${
        isImportant
          ? "bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 dark:from-primary/8 dark:via-primary/5 dark:to-primary/8 border-l-3 border-primary pl-5 md:pl-6 pr-4 py-5 md:py-6 rounded-r-lg"
          : "pb-6 border-b border-border/30"
      }`}
    >
      {/* H2: 28px (1.75rem) on desktop, 24px (1.5rem) on mobile */}
      <h2 className={`mb-4 font-bold tracking-tight ${
        isImportant
          ? "text-2xl md:text-3xl text-foreground"
          : "text-xl md:text-2xl text-foreground"
      }`}>
        {highlightImportantTerms(heading, highlightTerms)}
      </h2>

      {/* Body text: 16px (1rem) on mobile, 17px (1.0625rem) on desktop */}
      {content && (
        <p className="text-[15px] md:text-base text-muted-foreground leading-[1.6] mb-5 font-normal">
          {highlightImportantTerms(content, highlightTerms)}
        </p>
      )}

      {normalizedItems.length > 0 && (
        <ul className="space-y-3 mt-5">
          {normalizedItems.map((item, i) => {
            const ItemIcon = resolveLucideIcon(item.icon) || DefaultIcon;

            return (
              <li
                key={`${item.text}-${i}`}
                className="flex items-start gap-3 text-[15px] md:text-base text-muted-foreground leading-[1.6] group"
              >
                <span className="shrink-0">
                  {ItemIcon && <ItemIcon className="h-4 w-4 text-primary shrink-0 mt-1" />}
                </span>
                <span className="flex-1 group-hover:text-foreground/90 transition-colors">
                  {highlightImportantTerms(item.text, highlightTerms)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </motion.section>
  );
}
