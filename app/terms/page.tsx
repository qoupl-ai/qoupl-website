import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Terms of Service - qoupl",
  description: "Terms of Service for qoupl dating application",
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: November 20, 2025
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using qoupl ("the Service"), you agree to be bound
              by these Terms of Service ("Terms"). If you do not agree to these
              Terms, please do not use the Service. These Terms constitute a
              legally binding agreement between you and Xencus Technologies Private
              Limited (operating as "qoupl," "we," "us," or "our"), a company incorporated
              under the laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To use qoupl, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Be between 18 to 25 years of age (both inclusive)</li>
              <li>Be legally capable of entering into binding contracts under Indian law</li>
              <li>Not be prohibited from using the Service under applicable laws</li>
              <li>Not have been previously banned or suspended from the Service</li>
              <li>Create only one account (multiple accounts are prohibited)</li>
              <li>Provide accurate and truthful information</li>
              <li>Complete mandatory age verification using government-issued ID documents</li>
            </ul>
            <h3 className="text-xl font-semibold mb-3 mt-6">
              Age Verification Requirement
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              During account creation, you will be required to verify your age by uploading
              a government-issued identification document such as a Driving License, PAN Card,
              Aadhaar Card, or Passport. This verification is mandatory and ensures our platform
              remains safe and age-appropriate. Violation of age requirements will result in
              immediate account termination and permanent ban from the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Impersonate any person or entity</li>
              <li>Upload inappropriate, offensive, or explicit content</li>
              <li>Solicit money or financial information from users</li>
              <li>Promote commercial activities or spam</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Attempt to hack, reverse engineer, or compromise the Service</li>
              <li>Violate any applicable laws, including Indian laws</li>
              <li>Post content that violates intellectual property rights</li>
              <li>Engage in any discriminatory behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Content</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Your Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of content you post. By posting content, you
              grant qoupl a worldwide, non-exclusive, royalty-free license to use,
              display, reproduce, and distribute your content on the Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Content Guidelines</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content must comply with our Community Guidelines. Prohibited
              content includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Nudity or sexually explicit material</li>
              <li>Violence, hate speech, or harassment</li>
              <li>Illegal activities or substances</li>
              <li>Minors or content involving minors</li>
              <li>Spam, scams, or fraudulent schemes</li>
              <li>Copyrighted material without permission</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Content Moderation</h3>
            <p className="text-muted-foreground leading-relaxed">
              We use AI-powered moderation and human review to monitor content. We
              reserve the right to remove any content that violates these Terms or
              our Community Guidelines without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Safety and Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your safety is our priority:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Report suspicious or inappropriate behavior immediately</li>
              <li>Use caution when meeting users in person</li>
              <li>Meet in public places for first meetings</li>
              <li>Never share financial information with other users</li>
              <li>Trust your instincts and prioritize your safety</li>
              <li>Review our Safety Guidelines before using the Service</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              qoupl is not responsible for the conduct of users off the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Premium Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              qoupl may offer premium features through subscription or one-time
              purchases:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Payments are processed through secure third-party providers</li>
              <li>Prices are in Indian Rupees (INR) unless otherwise stated</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Refunds are subject to our Refund Policy</li>
              <li>Premium features are subject to availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service, including its design, features, code, and content
              (excluding user-generated content), is owned by qoupl and protected
              by Indian and international copyright, trademark, and intellectual
              property laws. You may not copy, modify, distribute, or create
              derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Suspend or terminate your account at any time</li>
              <li>Remove content that violates these Terms</li>
              <li>Ban users who violate our policies</li>
              <li>Modify or discontinue the Service</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You may delete your account at any time through the app settings.
              Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We do not guarantee matches or romantic outcomes</li>
              <li>We do not conduct background checks on users</li>
              <li>We are not responsible for user conduct or interactions</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We do not verify the accuracy of user information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by Indian law, qoupl shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including loss of profits, data, or goodwill,
              arising from your use of the Service. Our total liability shall not
              exceed the amount paid by you (if any) for the Service in the past
              twelve months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless qoupl, its affiliates,
              officers, directors, employees, and agents from any claims, damages,
              losses, liabilities, and expenses (including legal fees) arising from
              your use of the Service, violation of these Terms, or infringement
              of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising from these Terms or the
              Service shall be subject to the exclusive jurisdiction of the courts
              in Noida, Uttar Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              In case of any dispute, you agree to first attempt to resolve it
              through good faith negotiations with us. If the dispute cannot be
              resolved within 30 days, it may be submitted to arbitration under
              the Indian Arbitration and Conciliation Act, 1996.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may modify these Terms at any time. We will notify you of
              significant changes via email or in-app notification. Your continued
              use of the Service after changes constitutes acceptance of the
              updated Terms. If you do not agree, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="font-semibold mb-2">Xencus Technologies Private Limited</p>
              <p className="text-muted-foreground">(Operating as qoupl)</p>
              <p className="text-muted-foreground">Email: legal@qoupl.ai</p>
              <p className="text-muted-foreground">Support: support@qoupl.ai</p>
              <p className="text-muted-foreground">Phone: +91 9103732229</p>
              <p className="text-muted-foreground">
                Registered Office: B-98, Sector -2, Noida, Uttar Pradesh 201301, India
              </p>
            </div>
          </section>

          <section className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
            <p className="text-sm text-muted-foreground">
              By using qoupl, you acknowledge that you have read, understood, and
              agree to be bound by these Terms of Service and our Privacy Policy.
              If you are using the Service on behalf of an organization, you
              represent that you have the authority to bind that organization to
              these Terms.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
