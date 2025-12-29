"use client";

import { Users } from "lucide-react";
import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";

interface ContentSection {
  heading?: string;
  content?: string;
  items?: string[];
}

interface CommunityGuidelinesClientProps {
  content: {
    title?: string;
    lastUpdated?: string;
    sections?: ContentSection[];
  };
}

export default function CommunityGuidelinesClient({ content }: CommunityGuidelinesClientProps) {
  return (
    <LegalPageLayout
      title={content.title || "Community Guidelines"}
      lastUpdated={content.lastUpdated}
      icon={<Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
    >
      {content.sections && content.sections.length > 0 ? (
        content.sections.map((section, idx) => {
          const isImportant = 
            section.heading?.toLowerCase().includes('college student exclusivity') || 
            section.heading?.toLowerCase().includes('exclusivity') ||
            section.heading?.toLowerCase().includes('zero tolerance') ||
            section.heading?.toLowerCase().includes("do's") ||
            section.heading?.toLowerCase().includes("don'ts");
          
          return (
            <LegalSection
              key={idx}
              heading={section.heading || ""}
              content={section.content}
              items={section.items}
              isImportant={isImportant}
              index={idx}
            />
          );
        })
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No content available at this time.</p>
        </div>
      )}
    </LegalPageLayout>
  );
}
