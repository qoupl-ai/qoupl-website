"use client";


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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-[#662D91] bg-clip-text text-transparent">
          {content.title || "Community Guidelines"}
        </h1>
        {content.lastUpdated && (
          <p className="text-muted-foreground mb-8">
            Last Updated: {content.lastUpdated}
          </p>
        )}

        {/* Content will be rendered from database sections */}
        {content.sections && content.sections.length > 0 ? (
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {content.sections.map((section, idx) => {
              // Special styling for important sections (like College Student Exclusivity)
              const isImportant = section.heading?.toLowerCase().includes('college student exclusivity') || 
                                 section.heading?.toLowerCase().includes('exclusivity')
              
              if (isImportant) {
                return (
                  <div key={idx} className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      {section.heading}
                    </h2>
                    {section.content && (
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </div>
                )
              }
              
              return (
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
              )
            })}
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

