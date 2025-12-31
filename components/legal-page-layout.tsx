"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  MapPin,
  Info
} from "lucide-react";
import { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, icon, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Clean & Modern */}
      <section className="relative overflow-hidden border-b border-border py-12 md:py-16">
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
                className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#662D91]/10 dark:bg-[#662D91]/15 mb-4 text-[#662D91]"
              >
                {icon}
              </motion.div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-foreground">
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last Updated: <span className="text-foreground/80">{lastUpdated}</span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section - Optimized Typography */}
      <section className="py-12 md:py-16">
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
  items?: string[];
  isImportant?: boolean;
  index: number;
}

// Helper function to highlight important terms with brand color
function highlightImportantTerms(text: string): ReactNode {
  // Only highlight truly essential terms that users need to notice
  const importantTerms = [
    'qoupl', // Brand name
    'Grievance Officer', // Important contact information
  ];

  if (!text) return null;

  let parts: (string | ReactNode)[] = [text];
  
  importantTerms.forEach(term => {
    const newParts: (string | ReactNode)[] = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        // Use word boundaries and exclude matches within email addresses or URLs
        const regex = new RegExp(`\\b(${term})\\b`, 'gi');
        const splitParts = part.split(regex);
        splitParts.forEach((splitPart, i) => {
          if (i % 2 === 1) {
            // Check if this match is part of an email or URL
            const beforeMatch = splitParts[i - 1] || '';
            const afterMatch = splitParts[i + 1] || '';
            
            // Check for email pattern (text before @ or @ after)
            const isInEmail = beforeMatch.endsWith('@') || 
                             afterMatch.startsWith('@') || 
                             /@/.test(beforeMatch.slice(-10)) ||
                             /@/.test(afterMatch.slice(0, 10));
            
            // Check for URL pattern (:// or www. before, or .com/.ai/etc after)
            const isInUrl = beforeMatch.includes('://') || 
                           beforeMatch.includes('www.') ||
                           /\.(com|ai|org|net|io|edu|gov)/i.test(afterMatch);
            
            // Only highlight if not part of email/URL
            if (!isInEmail && !isInUrl) {
              newParts.push(
                <span key={`${term}-${i}`} className="font-semibold text-[#662D91]">
                  {splitPart}
                </span>
              );
            } else {
              newParts.push(splitPart);
            }
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

// Icon mapping for different item types
function getItemIcon(item: string) {
  if (item.startsWith('✅') || item.toLowerCase().includes('do') || item.toLowerCase().includes('should') || item.toLowerCase().includes('must') || item.toLowerCase().includes('be authentic') || item.toLowerCase().includes('be respectful')) {
    return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-1" />;
  }
  if (item.startsWith('❌') || item.toLowerCase().includes("don't") || item.toLowerCase().includes('avoid') || item.toLowerCase().includes('prohibited') || item.toLowerCase().includes('no harassment') || item.toLowerCase().includes('no ')) {
    return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-1" />;
  }
  if (item.startsWith('⚠️') || item.toLowerCase().includes('warning') || item.toLowerCase().includes('caution') || item.toLowerCase().includes('red flags') || item.toLowerCase().includes('asks for')) {
    return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />;
  }
  if (item.startsWith('🔒') || item.toLowerCase().includes('security') || item.toLowerCase().includes('privacy') || item.toLowerCase().includes('encrypted') || item.toLowerCase().includes('keep personal') || item.toLowerCase().includes('account secure')) {
    return <Lock className="h-4 w-4 text-[#662D91] shrink-0 mt-1" />;
  }
  if (item.startsWith('📍') || item.toLowerCase().includes('location') || item.toLowerCase().includes('address') || item.toLowerCase().includes('meet in') || item.toLowerCase().includes('share your location')) {
    return <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />;
  }
  return <Info className="h-4 w-4 text-[#662D91] shrink-0 mt-1" />;
}

// Clean item text by removing emoji markers
function cleanItemText(item: string): string {
  return item.replace(/^[✅❌⚠️🔒📍]/, '').trim();
}

export function LegalSection({ heading, content, items, isImportant, index }: LegalSectionProps) {
  const headingId = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  return (
    <motion.section
      id={headingId}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={`mb-8 md:mb-10 scroll-mt-20 ${
        isImportant
          ? "bg-card border border-[#662D91]/20 rounded-xl pl-5 md:pl-6 pr-4 py-5 md:py-6"
          : "pb-6 border-b border-border"
      }`}
    >
      {/* H2: Clean typography */}
      <h2 className={`mb-4 font-bold tracking-tight ${
        isImportant 
          ? "text-xl md:text-2xl text-foreground" 
          : "text-lg md:text-xl text-foreground"
      }`}>
        {highlightImportantTerms(heading)}
      </h2>
      
      {/* Body text */}
      {content && (
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
          {highlightImportantTerms(content)}
        </p>
      )}
      
      {items && items.length > 0 && (
        <ul className="space-y-3 mt-5">
          {items.map((item, i) => {
            const cleanItem = cleanItemText(item);
            const icon = getItemIcon(item);
            
            return (
              <li
                key={i}
                className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed group"
              >
                <span className="shrink-0">
                  {icon}
                </span>
                <span className="flex-1 group-hover:text-foreground/90 transition-colors">
                  {highlightImportantTerms(cleanItem)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </motion.section>
  );
}
