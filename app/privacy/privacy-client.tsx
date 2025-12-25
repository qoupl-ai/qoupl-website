"use client";

import { FileText } from "lucide-react";
import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";

interface PrivacyClientProps {
  content: {
    title?: string;
    lastUpdated?: string;
    sections?: any[];
  };
}

export default function PrivacyClient({ content }: PrivacyClientProps) {
  return (
    <LegalPageLayout
      title={content.title || "Privacy Policy"}
      lastUpdated={content.lastUpdated}
      icon={<FileText className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
    >
      {content.sections && content.sections.length > 0 ? (
        content.sections.map((section, idx) => (
          <LegalSection
            key={idx}
            heading={section.heading || ""}
            content={section.content}
            items={section.items}
            isImportant={section.heading?.toLowerCase().includes('rights') || 
                        section.heading?.toLowerCase().includes('grievance')}
            index={idx}
          />
        ))
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No content available at this time.</p>
        </div>
      )}
    </LegalPageLayout>
  );
}
