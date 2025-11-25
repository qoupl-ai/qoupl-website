import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Safety & Security - qoupl",
  description: "Safety and security guidelines for qoupl dating application",
};

export default function SafetySecurity() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Safety & Security
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Your safety is our top priority
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
            <h2 className="text-xl font-bold mb-3">Our Commitment to You</h2>
            <p className="text-muted-foreground leading-relaxed">
              At qoupl, we're committed to creating a safe environment for
              everyone. We use advanced technology, human moderation, and
              continuous safety improvements to protect our community. However,
              your safety also depends on how you use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              Platform Security Features
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">🔐 End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All messages are encrypted so only you and your match can read
                  them.
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">📸 Photo Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Users can verify their identity by taking a real-time selfie.
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">🤖 AI Moderation</h3>
                <p className="text-sm text-muted-foreground">
                  24/7 automated systems detect and remove inappropriate content.
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">👥 Human Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our safety team reviews reports and moderates content.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Online Safety Tips
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">Protect Your Privacy</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Don't share personal information early:</strong> Avoid
                sharing your full name, home address, workplace, or financial
                details until you know someone well.
              </li>
              <li>
                <strong>Use the in-app features:</strong> Keep conversations on
                qoupl initially. Don't rush to share phone numbers or social
                media.
              </li>
              <li>
                <strong>Protect your identity:</strong> Be mindful of background
                details in photos that might reveal your location.
              </li>
              <li>
                <strong>Create a strong password:</strong> Use a unique password
                for your qoupl account and enable two-factor authentication.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              Recognize Red Flags
            </h3>
            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border-l-4 border-red-500 mb-6">
              <h4 className="font-semibold mb-3 text-red-900 dark:text-red-100 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Warning Signs
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-red-800 dark:text-red-200">
                <li>Asking for money or financial assistance</li>
                <li>Pushing to move communication off the platform quickly</li>
                <li>Inconsistent stories or vague answers about themselves</li>
                <li>Profile photos that look professional or model-like</li>
                <li>Refusing to have extended conversations before meeting</li>
                <li>Declaring love or strong feelings very quickly</li>
                <li>Making you feel pressured or uncomfortable</li>
                <li>Asking for intimate photos</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Meeting in Person Safely
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">Before the Date</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Chat extensively first:</strong> Have meaningful conversations
                and get to know them well before meeting in person.
              </li>
              <li>
                <strong>Choose a public place:</strong> Meet in a busy, public
                location during daytime if possible.
              </li>
              <li>
                <strong>Tell someone:</strong> Share your plans, location, and
                expected return time with a friend or family member.
              </li>
              <li>
                <strong>Research the venue:</strong> Choose a familiar location
                where you feel comfortable.
              </li>
              <li>
                <strong>Plan your transportation:</strong> Arrange your own way to
                and from the date.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">During the Date</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Stay alert:</strong> Avoid drinking too much alcohol and
                never leave your drink unattended.
              </li>
              <li>
                <strong>Keep your phone charged:</strong> Ensure you can contact
                someone if needed.
              </li>
              <li>
                <strong>Trust your instincts:</strong> If something feels wrong,
                leave immediately.
              </li>
              <li>
                <strong>Don't feel obligated:</strong> You can end the date at any
                time for any reason.
              </li>
              <li>
                <strong>Check in with friends:</strong> Send periodic updates to
                your emergency contact.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Safety Checklist</h3>
            <div className="bg-primary/5 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1">✅</div>
                  <div>
                    <strong>Public location</strong> - Coffee shop, restaurant, or
                    park
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">✅</div>
                  <div>
                    <strong>Daytime meeting</strong> - Better visibility and safety
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">✅</div>
                  <div>
                    <strong>Own transportation</strong> - Independent arrival and
                    departure
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">✅</div>
                  <div>
                    <strong>Friend informed</strong> - Someone knows your plans
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">✅</div>
                  <div>
                    <strong>Charged phone</strong> - Able to call for help
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              Financial Safety
            </h2>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border-l-4 border-yellow-500 mb-6">
              <h3 className="font-semibold mb-3 text-yellow-900 dark:text-yellow-100">
                Never Send Money
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                Never send money or financial information to someone you've met on
                qoupl, even if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-yellow-800 dark:text-yellow-200">
                <li>They claim to have an emergency</li>
                <li>They say they need help with travel expenses</li>
                <li>They promise to pay you back</li>
                <li>They claim to be in the military or overseas</li>
                <li>They send you money and ask you to send it elsewhere</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">Romance Scams</h3>
            <p className="text-muted-foreground mb-4">Be aware of common tactics:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Professing love quickly without meeting in person</li>
              <li>Creating elaborate stories about why they can't meet</li>
              <li>Asking for gift cards or wire transfers</li>
              <li>Requesting help with business or investment opportunities</li>
              <li>Claiming to need money for medical emergencies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Phone className="h-6 w-6 text-primary" />
              Reporting & Getting Help
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">Report in the App</h3>
            <p className="text-muted-foreground mb-4">
              You can report users or content for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Inappropriate photos or messages</li>
              <li>Suspicious or fraudulent behavior</li>
              <li>Harassment or threatening behavior</li>
              <li>Fake profiles or catfishing</li>
              <li>Underage users</li>
              <li>Hate speech or discrimination</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Reports are reviewed within 24 hours and kept confidential.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Emergency Contacts</h3>
            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-semibold mb-3 text-red-900 dark:text-red-100">
                In Case of Emergency
              </h4>
              <ul className="space-y-2 text-red-800 dark:text-red-200">
                <li>
                  <strong>Police Emergency:</strong> 100 (India)
                </li>
                <li>
                  <strong>Women's Helpline:</strong> 1091 (India)
                </li>
                <li>
                  <strong>Cyber Crime:</strong> 1930 (India)
                </li>
                <li>
                  <strong>National Commission for Women:</strong> 7827-170-170
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              Contact qoupl Safety Team
            </h3>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="text-muted-foreground mb-2">
                <strong>Email:</strong> safety@qoupl.ai
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Response Time:</strong> Within 24 hours
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>For urgent safety concerns:</strong> Use the in-app emergency
                report feature
              </p>
              <p className="text-muted-foreground">
                <strong>Support:</strong> Available 24/7 through the app
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <Link href="/community-guidelines" className="text-primary hover:underline">
                  Community Guidelines
                </Link>{" "}
                - Standards for respectful behavior
              </li>
              <li>
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                - How we protect your data
              </li>
              <li>
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                - Your rights and responsibilities
              </li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Remember</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="mt-1 text-primary">💜</div>
                <div>
                  <strong>Your safety comes first</strong> - Never compromise your
                  security for anyone.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-primary">💜</div>
                <div>
                  <strong>Trust your instincts</strong> - If something feels wrong,
                  it probably is.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-primary">💜</div>
                <div>
                  <strong>We're here to help</strong> - Don't hesitate to report
                  concerns or ask for support.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-primary">💜</div>
                <div>
                  <strong>Stay informed</strong> - Review these guidelines regularly
                  and stay updated on safety best practices.
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
