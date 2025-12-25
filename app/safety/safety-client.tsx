"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

interface SafetyClientProps {
  content: {
    title?: string;
    lastUpdated?: string;
    sections?: any[];
  };
}

export default function SafetyClient({ content }: SafetyClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold bg-[#662D91] bg-clip-text text-transparent">
            {content.title || "Safety & Security"}
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          {content.lastUpdated ? `Last Updated: ${content.lastUpdated}` : "Your safety is our top priority"}
        </p>

        {/* Content will be rendered from database sections */}
        {content.sections && content.sections.length > 0 ? (
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {content.sections.map((section, idx) => (
              <section key={idx}>
                {section.heading && <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>}
                {section.content && <p className="text-muted-foreground leading-relaxed">{section.content}</p>}
                {section.items && (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {section.items.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        ) : (
          // Fallback: Note that content needs to be migrated
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border-l-4 border-yellow-500">
            <p className="text-yellow-800 dark:text-yellow-200">
              Safety & Security content is being migrated to the database. 
              Please run the migration script or add content through the CMS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

