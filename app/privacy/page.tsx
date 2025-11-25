import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Privacy Policy - qoupl",
  description: "Privacy Policy for qoupl dating application",
};

export default function PrivacyPolicy() {
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

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: November 20, 2025
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to qoupl ("we," "our," or "us"). We are committed to
              protecting your privacy and personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our mobile application and services
              (collectively, the "Service"). This policy complies with the
              Information Technology Act, 2000, and the Information Technology
              (Reasonable Security Practices and Procedures and Sensitive
              Personal Data or Information) Rules, 2011 of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              2.1 Personal Information
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect the following personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Name, age, and date of birth (must be between 18-25 years to use our service)</li>
              <li>Email address and phone number</li>
              <li>Gender and gender preferences</li>
              <li>Location data (with your permission)</li>
              <li>Profile photos</li>
              <li>Bio and personal interests</li>
              <li>Educational and professional information</li>
              <li>Social media account information (if you choose to link)</li>
              <li>Government-issued ID documents (for age verification purposes only - Driving License, PAN Card, Aadhaar Card, or Passport)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              2.2 Usage Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Device information (type, OS, unique identifiers)</li>
              <li>IP address and browser type</li>
              <li>App usage data and interactions</li>
              <li>Messages and communications on the platform</li>
              <li>Preferences and settings</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              2.3 Sensitive Personal Data
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Under Indian law, certain data is classified as "Sensitive Personal
              Data or Information" (SPDI). This includes passwords, financial
              information, health data, sexual orientation, and biometric
              information. We handle all SPDI with enhanced security measures and
              only collect it with your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your information for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Providing and improving our dating service</li>
              <li>Creating and managing your account</li>
              <li>Matching you with compatible users using AI algorithms</li>
              <li>Facilitating communication between users</li>
              <li>Personalizing your experience</li>
              <li>Sending notifications and updates</li>
              <li>Ensuring safety and preventing fraud</li>
              <li>Complying with legal obligations</li>
              <li>Analytics and service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Other Users:</strong> Your profile information is visible
                to other users as part of the dating service
              </li>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who help
                us operate our service (hosting, analytics, payment processing)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by Indian law
                or government authorities
              </li>
              <li>
                <strong>Safety & Protection:</strong> To protect rights, property,
                and safety of our users
              </li>
              <li>
                <strong>Business Transfers:</strong> In case of merger,
                acquisition, or sale of assets
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>End-to-end encryption for messages</li>
              <li>Secure data storage with encryption at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>24/7 AI-powered content moderation</li>
              <li>Photo verification systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under Indian law, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data</li>
              <li>Object to certain processing activities</li>
              <li>Lodge a complaint with authorities</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@qoupl.ai
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as your account is active or
              as needed to provide services. After account deletion, we may retain
              certain information for legal compliance, fraud prevention, and
              safety purposes for up to 3 years as permitted by Indian law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Age Restrictions & Verification</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our service is exclusively for individuals aged 18 to 25 years. We do not
              knowingly collect information from minors (under 18) or individuals outside
              this age range. If we discover that someone outside the eligible age range
              has provided us with personal information, we will delete it immediately.
            </p>
            <h3 className="text-xl font-semibold mb-3 mt-6">
              Age Verification Process
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              During account creation, all users will be required to verify their age using
              government-issued identification documents, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Driving License</li>
              <li>PAN Card</li>
              <li>Aadhaar Card</li>
              <li>Passport</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These documents are used solely for age verification purposes and are handled
              with the highest security standards. We do not store full copies of your ID
              documents after verification is complete. Only the verification status and
              your date of birth are retained.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data may be transferred to and processed in countries outside
              India. We ensure appropriate safeguards are in place to protect your
              information in accordance with this Privacy Policy and applicable
              laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes via email or app notification. Your
              continued use of the Service after changes constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For questions about this Privacy Policy or our privacy practices:
            </p>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="font-semibold mb-2">Xencus Technologies Private Limited</p>
              <p className="text-muted-foreground">(Operating as qoupl)</p>
              <p className="text-muted-foreground">Email: privacy@qoupl.ai</p>
              <p className="text-muted-foreground">Support: support@qoupl.ai</p>
              <p className="text-muted-foreground">Phone: +91 9103732229</p>
              <p className="text-muted-foreground">
                Address: B-98, Sector -2, Noida, Uttar Pradesh 201301, India
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Grievance Officer</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In accordance with the Information Technology Act, 2000, and rules
              made thereunder, we have appointed a Grievance Officer to address
              your concerns:
            </p>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="font-semibold mb-2">Grievance Officer</p>
              <p className="text-muted-foreground">Name: Shashank Kumar</p>
              <p className="text-muted-foreground">Email: grievance@qoupl.ai</p>
              <p className="text-muted-foreground">
                Response Time: Within 48 hours of complaint
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
