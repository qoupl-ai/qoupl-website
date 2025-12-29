"use client";

import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";
import { resolveLucideIcon } from "@/lib/utils/icons";

interface CommunityGuidelinesClientProps {
  content: {
    title?: string;
    icon?: string;
    showIcon?: boolean;
    lastUpdated?: string;
    sections?: Array<{
      heading?: string;
      content?: string;
      items?: Array<{ text?: string; icon?: string; show?: boolean }>;
      isImportant?: boolean;
      show?: boolean;
    }>;
  };
}

export default function CommunityGuidelinesClient({ content }: CommunityGuidelinesClientProps) {
  const PageIcon = resolveLucideIcon(content.icon);
  const showIcon = content.showIcon !== false;

  if (showIcon && !PageIcon && process.env.NODE_ENV !== "production") {
    throw new Error("Community guidelines icon is missing or invalid in CMS.");
  }

  const sections = (content.sections || []).filter((section) => section.show !== false);

  return (
    <LegalPageLayout
      title={content.title || ""}
      lastUpdated={content.lastUpdated}
      icon={
        showIcon && PageIcon ? (
          <PageIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        ) : undefined
      }
    >
      {sections.map((section, idx) => (
        <LegalSection
          key={idx}
          heading={section.heading || ""}
          content={section.content}
          items={section.items}
          isImportant={section.isImportant}
          index={idx}
        />
      ))}
    </LegalPageLayout>
  );
}
