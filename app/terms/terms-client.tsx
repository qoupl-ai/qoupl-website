"use client";


interface TermsClientProps {
  content: {
    title?: string;
    lastUpdated?: string;
    sections?: any[];
  };
}

export default function TermsClient({ content }: TermsClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-[#662D91] bg-clip-text text-transparent">
          {content.title || "Terms of Service"}
        </h1>
        {content.lastUpdated && (
          <p className="text-muted-foreground mb-8">
            Last Updated: {content.lastUpdated}
          </p>
        )}

        {/* Content will be rendered from database sections */}
        {content.sections && content.sections.length > 0 ? (
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {content.sections.map((section, idx) => (
              <section key={idx}>
                {section.heading && (
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    {section.heading}
                  </h2>
                )}
                {section.content && (
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                )}
                {section.items && section.items.length > 0 && (
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
          <div className="text-center py-16">
            <p className="text-muted-foreground">No content available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

