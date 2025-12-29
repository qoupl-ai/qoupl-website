"use client";

import { Shield, AlertTriangle } from "lucide-react";
import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";

interface SafetyClientProps {
  content: {
    title?: string;
    lastUpdated?: string;
    sections?: any[];
  };
}

export default function SafetyClient({ content }: SafetyClientProps) {
  return (
    <LegalPageLayout
      title={content.title || "Safety & Security"}
      lastUpdated={content.lastUpdated}
      icon={<Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
    >
      {content.sections && content.sections.length > 0 ? (
        content.sections.map((section, idx) => {
          const isImportant = 
            section.heading?.toLowerCase().includes('red flags') ||
            section.heading?.toLowerCase().includes('emergency') ||
            section.heading?.toLowerCase().includes('zero tolerance');
          
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
