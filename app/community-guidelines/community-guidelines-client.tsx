"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Shield, Users, MessageCircle } from "lucide-react";

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
  // For now, render the original content structure
  // This will be replaced with database content once migrated
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

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-[#662D91] bg-clip-text text-transparent">
          {content.title || "Community Guidelines"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {content.lastUpdated ? `Last Updated: ${content.lastUpdated}` : "Building a respectful and safe community together"}
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
          // Fallback: Render original hardcoded content
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Welcome to qoupl! Our mission is to help people find meaningful
                connections in a safe, respectful environment. These Community
                Guidelines help maintain a positive experience for everyone.
              </p>
            </section>

            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                College Student Exclusivity (18-25 Years Only)
              </h3>
              <p className="text-muted-foreground">
                qoupl is exclusively for college students aged 18 to 25 years. All users must
                verify their college student status during account creation using a valid college/university ID card.
                We only accept college ID cards for verification - no other identification documents are accepted.
                Users who are not current college students or are outside this age range are not permitted to use our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-primary/5 p-6 rounded-lg">
                <Heart className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Be Authentic</h3>
                <p className="text-sm text-muted-foreground">
                  Use real photos and honest information. Authenticity builds trust.
                </p>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <Shield className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Stay Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Protect your personal information and report suspicious behavior.
                </p>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <Users className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Respect Everyone</h3>
                <p className="text-sm text-muted-foreground">
                  Treat others with kindness regardless of their background.
                </p>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <MessageCircle className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Communicate Clearly</h3>
                <p className="text-sm text-muted-foreground">
                  Be honest about your intentions and respect boundaries.
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. Profile Guidelines</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">✓ Do:</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use recent, clear photos of yourself</li>
                <li>Write an honest and genuine bio</li>
                <li>Show your personality and interests</li>
                <li>Use photos that clearly show your face</li>
                <li>Keep your information up to date</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 mt-6">✗ Don&apos;t:</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use photos of other people or celebrities</li>
                <li>Post heavily edited or misleading photos</li>
                <li>Include nudity or sexually explicit content</li>
                <li>Show weapons, drugs, or illegal activities</li>
                <li>Include minors in your photos</li>
                <li>Use group photos as your main profile picture</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Communication Standards</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">Respectful Messaging</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Start conversations politely and respectfully</li>
                <li>Accept &quot;no&quot; gracefully if someone isn&apos;t interested</li>
                <li>Respect response times - people are busy</li>
                <li>Avoid sending unsolicited explicit messages</li>
                <li>Don&apos;t spam or send repetitive messages</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 mt-6">Topics to Avoid</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Sexual content in initial conversations</li>
                <li>Requests for money or financial information</li>
                <li>Excessive negativity or complaints</li>
                <li>Offensive jokes or inappropriate humor</li>
                <li>Political or religious debates (unless mutually interested)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Prohibited Behavior</h2>
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border-l-4 border-red-500 mb-6">
                <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                  Zero Tolerance Violations
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                  The following behaviors will result in immediate account
                  termination and may be reported to authorities:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-red-800 dark:text-red-200 text-sm">
                  <li>Any content involving minors</li>
                  <li>Non-consensual intimate images</li>
                  <li>Threats, violence, or harassment</li>
                  <li>Hate speech or discrimination</li>
                  <li>Human trafficking or prostitution</li>
                  <li>Scams or financial fraud</li>
                </ul>
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-6">Other Prohibited Activities</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Catfishing:</strong> Impersonating someone else</li>
                <li><strong>Spam:</strong> Promotional content or advertisements</li>
                <li><strong>Bots:</strong> Using automated systems</li>
                <li><strong>Selling:</strong> Commercial transactions on the platform</li>
                <li><strong>Multiple Accounts:</strong> Creating fake profiles</li>
                <li><strong>Harassment:</strong> Persistent unwanted contact</li>
                <li><strong>Doxing:</strong> Sharing private information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Safety Guidelines</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">Meeting in Person</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Meet in public places for first dates</li>
                <li>Tell a friend or family member where you&apos;re going</li>
                <li>Arrange your own transportation</li>
                <li>Stay sober and alert during first meetings</li>
                <li>Trust your instincts - leave if uncomfortable</li>
                <li>Have extensive conversations before meeting in person</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 mt-6">Protecting Your Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Don&apos;t share your home address early on</li>
                <li>Avoid sharing financial information</li>
                <li>Be cautious with personal phone numbers</li>
                <li>Don&apos;t send money to people you haven&apos;t met</li>
                <li>Keep conversations on the platform initially</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Reporting & Blocking</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">When to Report</h3>
              <p className="text-muted-foreground mb-4">Report users who:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violate these Community Guidelines</li>
                <li>Make you feel unsafe or uncomfortable</li>
                <li>Request money or financial information</li>
                <li>Send inappropriate or explicit content</li>
                <li>Appear to be outside the 18-25 age range (under 18 or over 25) or not a current college student</li>
                <li>Use fake photos or impersonate others</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 mt-6">How We Respond</h3>
              <p className="text-muted-foreground mb-4">When you report someone:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Reports are reviewed within 24 hours</li>
                <li>Your report is anonymous and confidential</li>
                <li>We may request additional information</li>
                <li>Violators may be warned, suspended, or banned</li>
                <li>Serious violations are reported to authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Content Moderation</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use a combination of AI technology and human moderators to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Screen photos before they appear on profiles</li>
                <li>Monitor messages for inappropriate content</li>
                <li>Detect and remove fake accounts</li>
                <li>Verify user photos for authenticity</li>
                <li>Respond to user reports quickly</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Inclusive Community</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                qoupl welcomes people of all:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Religions and beliefs</li>
                <li>Ethnicities and cultures</li>
                <li>Gender identities and expressions</li>
                <li>Sexual orientations</li>
                <li>Abilities and disabilities</li>
                <li>Backgrounds and experiences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Discrimination, hate speech, or harassment based on these
                characteristics is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Violations may result in:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Warning:</strong> First-time minor violations</li>
                <li><strong>Content Removal:</strong> Inappropriate photos or messages</li>
                <li><strong>Temporary Suspension:</strong> Repeated or serious violations</li>
                <li><strong>Permanent Ban:</strong> Severe or zero-tolerance violations</li>
                <li><strong>Legal Action:</strong> Illegal activities reported to authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Updates to Guidelines</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Community Guidelines as our platform evolves. We
                will notify you of significant changes through the app. Continued
                use of qoupl constitutes acceptance of updated guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact & Support</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Need help or have questions about these guidelines?
              </p>
              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="text-muted-foreground mb-2">📧 Email: support@qoupl.ai</p>
                <p className="text-muted-foreground mb-2">
                  🛡️ Safety Team: safety@qoupl.ai
                </p>
                <p className="text-muted-foreground">
                  📱 In-App Support: Available 24/7 through the app
                </p>
              </div>
            </section>

            <section className="bg-[#662D91]/5 dark:bg-[#662D91]/20 p-6 rounded-lg border-l-4 border-primary">
              <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
              <p className="text-sm text-muted-foreground">
                By following these guidelines, you help create a welcoming space for
                everyone to find meaningful connections. Together, we can build a
                community based on respect, safety, and authenticity. Happy dating! 💜
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

