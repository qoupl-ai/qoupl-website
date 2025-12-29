/**
 * Populate Legal Content Script
 * 
 * Populates comprehensive legal content for:
 * - Privacy Policy (DPDPA 2023, IT Act 2000 compliant)
 * - Terms of Service (Indian law compliant)
 * - Community Guidelines (with Do's and Don'ts)
 * - Safety & Security (comprehensive safety guidelines)
 * 
 * Run: npm run populate:legal
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Import admin client after env vars are loaded
import { adminClient } from '../lib/supabase/admin'

const currentDate = new Date().toISOString().split('T')[0]

// ============================================================================
// PRIVACY POLICY - DPDPA 2023 & IT Act 2000 Compliant
// ============================================================================

const privacyPolicyContent = {
  title: "Privacy Policy",
  lastUpdated: currentDate,
  sections: [
    {
      heading: "1. Introduction",
      content: "Welcome to qoupl. This Privacy Policy explains how Xencus Technologies Private Limited ('we', 'our', or 'us') collects, uses, discloses, and protects your personal information when you use our dating platform qoupl ('Service'). This policy is compliant with the Digital Personal Data Protection Act, 2023 (DPDPA), the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011."
    },
    {
      heading: "2. Information We Collect",
      content: "We collect information that you provide directly to us and information collected automatically when you use our Service.",
      items: [
        "Personal Information: Name, email address, phone number, date of birth, gender, profile photos, educational institution details, government-issued ID information (for verification purposes only), and preferences",
        "Profile Information: Bio, interests, relationship preferences, location (city/state), and photos",
        "Usage Data: App interactions, messages sent/received, matches, swipe patterns, and feature usage",
        "Device Information: Device type, operating system, unique device identifiers, IP address, and mobile network information",
        "Location Data: Approximate location based on IP address and city-level location (with your consent)",
        "Payment Information: Processed securely through third-party payment processors (we do not store full payment card details)"
      ]
    },
    {
      heading: "3. How We Use Your Information",
      content: "We use your information to provide, maintain, and improve our Service, and to comply with legal obligations.",
      items: [
        "To create and manage your account and profile",
        "To provide matching services and show you potential matches",
        "To facilitate communication between users",
        "To process payments and manage subscriptions",
        "To send you service-related notifications and updates",
        "To detect, prevent, and address fraud, abuse, and security issues",
        "To comply with legal obligations under Indian law",
        "To conduct research and analytics to improve our Service",
        "To enforce our Terms of Service and Community Guidelines"
      ]
    },
    {
      heading: "4. Legal Basis for Processing (DPDPA 2023)",
      content: "Under the Digital Personal Data Protection Act, 2023, we process your personal data based on the following legal grounds:",
      items: [
        "Consent: You have provided explicit consent for processing your personal data",
        "Legitimate Interest: To provide and improve our Service, ensure security, and prevent fraud",
        "Legal Obligation: To comply with applicable Indian laws and regulations",
        "Contractual Necessity: To perform our contract with you (Terms of Service)"
      ]
    },
    {
      heading: "5. Data Sharing and Disclosure",
      content: "We do not sell your personal information. We may share your information only in the following circumstances:",
      items: [
        "With Other Users: Your profile information (name, photos, bio, interests) is visible to other users as part of the matching service",
        "Service Providers: With third-party service providers who perform services on our behalf (cloud hosting, payment processing, analytics)",
        "Legal Requirements: When required by law, court order, or government regulation in India",
        "Safety and Security: To protect the rights, property, or safety of qoupl, our users, or others",
        "Business Transfers: In connection with any merger, sale, or acquisition of our business"
      ]
    },
    {
      heading: "6. Data Retention",
      content: "We retain your personal information for as long as your account is active or as needed to provide our Service. We may retain certain information after account deletion as required by law or for legitimate business purposes (e.g., fraud prevention). Deleted data is permanently removed within 30 days, except where retention is required by law."
    },
    {
      heading: "7. Your Rights Under DPDPA 2023",
      content: "As a data principal under the Digital Personal Data Protection Act, 2023, you have the following rights:",
      items: [
        "Right to Access: Request access to your personal data we hold",
        "Right to Correction: Request correction of inaccurate or incomplete data",
        "Right to Erasure: Request deletion of your personal data (subject to legal obligations)",
        "Right to Data Portability: Request a copy of your data in a structured, machine-readable format",
        "Right to Withdraw Consent: Withdraw consent for data processing at any time",
        "Right to Grievance Redressal: File a complaint with the Data Protection Board of India"
      ]
    },
    {
      heading: "8. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information, including:",
      items: [
        "Encryption of data in transit (SSL/TLS) and at rest",
        "Regular security assessments and vulnerability testing",
        "Access controls and authentication mechanisms",
        "Secure data centers with physical security measures",
        "Employee training on data protection and privacy"
      ]
    },
    {
      heading: "9. Government-Issued ID Verification",
      content: "To ensure age compliance and platform safety, we require verification using government-issued identification documents. We collect and process the following information from your ID:",
      items: [
        "Document type (Aadhaar, PAN, Voter ID, Driving License, or Passport)",
        "Name as it appears on the ID",
        "Date of birth",
        "Photo from the ID document (for verification purposes)",
        "Document number (partially masked for security)",
        "We do NOT store full document numbers or sensitive details like Aadhaar number in plain text",
        "ID documents are encrypted and stored securely",
        "ID information is used solely for age and identity verification",
        "We comply with all applicable data protection laws regarding ID document handling",
        "ID documents may be retained as required by law or for fraud prevention, but are deleted when no longer needed"
      ]
    },
    {
      heading: "10. Children's Privacy",
      content: "qoupl is exclusively for users aged 18-25. We do not knowingly collect personal information from individuals under 18 years of age. If we become aware that we have collected information from a minor, we will take steps to delete such information immediately."
    },
    {
      heading: "11. International Data Transfers",
      content: "Your data is primarily stored and processed in India. If we transfer data outside India, we ensure appropriate safeguards are in place as required by Indian law, including contractual clauses and adequacy decisions."
    },
    {
      heading: "12. Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
    },
    {
      heading: "13. Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes."
    },
    {
      heading: "14. Contact Information",
      content: "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:",
      items: [
        "Email: privacy@qoupl.ai",
        "Address: B-98, Sector-2, Noida, Uttar Pradesh 201301, India",
        "Phone: +91 9103732229"
      ]
    },
    {
      heading: "15. Grievance Officer (IT Act 2000)",
      content: "In accordance with the Information Technology Act, 2000 and Rules made thereunder, we have appointed a Grievance Officer. You may contact the Grievance Officer at:",
      items: [
        "Name: Shashank Kumar",
        "Email: grievance@qoupl.ai",
        "Address: B-98, Sector-2, Noida, Uttar Pradesh 201301, India",
        "Response Time: Within 30 days as per IT Act requirements"
      ]
    }
  ]
}

// ============================================================================
// TERMS OF SERVICE - Indian Law Compliant
// ============================================================================

const termsOfServiceContent = {
  title: "Terms of Service",
  lastUpdated: currentDate,
  sections: [
    {
      heading: "1. Acceptance of Terms",
      content: "By accessing or using qoupl ('Service'), operated by Xencus Technologies Private Limited ('Company', 'we', 'us', or 'our'), you agree to be bound by these Terms of Service ('Terms'). If you disagree with any part of these Terms, you may not access the Service. These Terms constitute a legally binding agreement between you and the Company under Indian law."
    },
    {
      heading: "2. Eligibility",
      content: "You must meet the following criteria to use qoupl:",
      items: [
        "You must be at least 18 years old and not more than 25 years old",
        "You must be a current college or university student",
        "You must verify your age and identity using a valid government-issued identification document (Aadhaar Card, PAN Card, Voter ID, Driving License, or Passport)",
        "You must be legally capable of entering into binding contracts under Indian law",
        "You must not be prohibited from using the Service under applicable laws",
        "You must provide accurate and truthful information during registration and verification",
        "You must not use forged, fake, or invalid identification documents - doing so will result in immediate account termination and may lead to legal action"
      ]
    },
    {
      heading: "3. Account Registration and Security",
      content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      items: [
        "You must provide accurate, current, and complete information during registration",
        "You must maintain and update your information to keep it accurate",
        "You are responsible for safeguarding your password and account",
        "You must notify us immediately of any unauthorized use of your account",
        "You may not share your account with others or create multiple accounts",
        "We reserve the right to suspend or terminate accounts that violate these Terms"
      ]
    },
    {
      heading: "4. User Conduct and Prohibited Activities",
      content: "You agree not to engage in any of the following prohibited activities:",
      items: [
        "Harassment, bullying, or threatening behavior towards other users",
        "Posting false, misleading, or fraudulent information",
        "Impersonating another person or entity",
        "Sharing explicit, pornographic, or offensive content",
        "Soliciting money, gifts, or financial transactions from other users",
        "Using the Service for commercial purposes or spam",
        "Attempting to hack, reverse engineer, or compromise the Service",
        "Violating any applicable Indian laws or regulations",
        "Interfering with or disrupting the Service or servers",
        "Collecting or harvesting information about other users without consent"
      ]
    },
    {
      heading: "5. Content and Intellectual Property",
      content: "You retain ownership of content you post on qoupl. However, by posting content, you grant us a license to use, display, and distribute such content on the Service.",
      items: [
        "You own the content you post (photos, text, etc.)",
        "You grant us a worldwide, royalty-free license to use your content on the Service",
        "You represent that you have the right to post the content and it does not violate any third-party rights",
        "We reserve the right to remove any content that violates these Terms or Community Guidelines",
        "All Service features, design, and technology are our intellectual property"
      ]
    },
    {
      heading: "6. Premium Features and Payments",
      content: "qoupl offers premium features through subscriptions and in-app purchases. Payment terms are as follows:",
      items: [
        "All payments are processed through secure third-party payment gateways",
        "Subscription fees are charged in advance on a recurring basis",
        "Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes",
        "Refunds are subject to our refund policy and applicable Indian consumer protection laws",
        "We reserve the right to change pricing with 30 days' notice",
        "Auto-renewal can be cancelled at any time through your account settings"
      ]
    },
    {
      heading: "7. Matching and Communication",
      content: "Our matching algorithm uses various factors to suggest potential matches. We do not guarantee matches or successful relationships.",
      items: [
        "Matches are suggestions based on our algorithm - we do not guarantee compatibility",
        "You are responsible for your interactions with other users",
        "We are not responsible for the conduct of any user",
        "We may monitor communications to ensure compliance with our Terms and Community Guidelines",
        "Report any inappropriate behavior through in-app reporting features"
      ]
    },
    {
      heading: "8. Safety and Reporting",
      content: "Your safety is our priority. We provide tools and features to help you stay safe:",
      items: [
        "Report users who violate our Terms or Community Guidelines",
        "Block users who make you feel uncomfortable",
        "Use our safety features (photo verification, profile verification)",
        "Never share personal financial information or send money to other users",
        "Meet in public places for first dates and inform friends/family",
        "Trust your instincts - if something feels wrong, it probably is"
      ]
    },
    {
      heading: "9. Termination",
      content: "We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.",
      items: [
        "You may delete your account at any time through account settings",
        "We may suspend or terminate accounts that violate these Terms",
        "Upon termination, your right to use the Service will immediately cease",
        "We may retain certain information as required by law or for legitimate business purposes"
      ]
    },
    {
      heading: "10. Disclaimers and Limitation of Liability",
      content: "To the maximum extent permitted by Indian law:",
      items: [
        "The Service is provided 'as is' without warranties of any kind",
        "We do not guarantee the accuracy, completeness, or usefulness of any information on the Service",
        "We are not responsible for any damages arising from your use of the Service",
        "Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim",
        "We are not responsible for the conduct of any user or third party"
      ]
    },
    {
      heading: "11. Indemnification",
      content: "You agree to indemnify and hold harmless Xencus Technologies Private Limited, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms."
    },
    {
      heading: "12. Dispute Resolution and Governing Law",
      content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India. We encourage users to first contact us to resolve any disputes amicably."
    },
    {
      heading: "13. Changes to Terms",
      content: "We reserve the right to modify these Terms at any time. We will notify users of material changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance of the new Terms."
    },
    {
      heading: "14. Severability",
      content: "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect."
    },
    {
      heading: "15. Contact Information",
      content: "For questions about these Terms, please contact us at:",
      items: [
        "Email: legal@qoupl.ai",
        "Address: B-98, Sector-2, Noida, Uttar Pradesh 201301, India",
        "Phone: +91 9103732229"
      ]
    }
  ]
}

// ============================================================================
// COMMUNITY GUIDELINES - With Do's and Don'ts
// ============================================================================

const communityGuidelinesContent = {
  title: "Community Guidelines",
  lastUpdated: currentDate,
  sections: [
    {
      heading: "Our Commitment",
      content: "qoupl is a safe, respectful, and inclusive community for college students aged 18-25. These Community Guidelines help ensure everyone has a positive experience. By using qoupl, you agree to follow these guidelines. Violations may result in warnings, temporary suspensions, or permanent bans."
    },
    {
      heading: "College Student Exclusivity",
      content: "qoupl is exclusively for current college and university students aged 18-25. You must be enrolled in a recognized educational institution to use our platform. We verify your age and identity using government-issued identification documents (Aadhaar, PAN, Voter ID, Driving License, or Passport). Non-students or users outside the age range will be removed from the platform."
    },
    {
      heading: "Do's - What We Encourage",
      content: "Here's how to have a great experience on qoupl:",
      items: [
        "Be Authentic: Use real photos and accurate information about yourself",
        "Be Respectful: Treat everyone with kindness and respect, regardless of their background, beliefs, or preferences",
        "Be Clear About Intentions: Communicate honestly about what you're looking for",
        "Report Inappropriate Behavior: Help keep the community safe by reporting users who violate guidelines",
        "Verify Your Profile: Complete photo verification and profile verification for better matches",
        "Respect Boundaries: Accept 'no' gracefully and respect others' decisions",
        "Use Appropriate Language: Keep conversations respectful and appropriate",
        "Meet Safely: When meeting in person, choose public places and inform friends/family",
        "Be Patient: Building connections takes time - be patient and genuine",
        "Follow Age Restrictions: Only use the platform if you're between 18-25 years old"
      ]
    },
    {
      heading: "Don'ts - What's Not Allowed",
      content: "The following behaviors are strictly prohibited and will result in immediate action:",
      items: [
        "No Harassment: Do not harass, bully, threaten, or intimidate other users",
        "No Hate Speech: Do not post content that promotes hatred, discrimination, or violence based on race, religion, gender, sexual orientation, or other protected characteristics",
        "No Explicit Content: Do not share sexually explicit, pornographic, or offensive images or messages",
        "No Scams or Fraud: Do not attempt to scam, defraud, or solicit money from other users",
        "No Fake Profiles: Do not create fake profiles, impersonate others, or use someone else's photos",
        "No Spam: Do not send unsolicited messages, advertisements, or promotional content",
        "No Minors: Do not use the platform if you're under 18 or over 25 years old",
        "No Illegal Activities: Do not use the platform for any illegal activities or to promote illegal content",
        "No Sharing Personal Information: Do not share personal contact information (phone, email, social media) in your profile or early conversations",
        "No Inappropriate Photos: Do not post photos containing nudity, violence, weapons, or illegal substances",
        "No Unsolicited Sexual Content: Do not send unsolicited sexual messages or images",
        "No Commercial Use: Do not use the platform for commercial purposes, selling products, or promoting businesses"
      ]
    },
    {
      heading: "Profile Guidelines",
      content: "Your profile is your first impression. Keep it authentic and appropriate:",
      items: [
        "Use clear, recent photos of yourself (no group photos as primary photo)",
        "No photos with filters that significantly alter your appearance",
        "No photos containing other people without their consent",
        "Write a genuine bio that reflects who you are",
        "No contact information (phone, email, social media handles) in your bio",
        "No links to external websites or promotional content",
        "Keep your profile information accurate and up-to-date"
      ]
    },
    {
      heading: "Messaging Guidelines",
      content: "Respectful communication is key to building meaningful connections:",
      items: [
        "Start conversations with genuine interest and respect",
        "Respond to messages in a timely and respectful manner",
        "If you're not interested, politely decline rather than ignoring",
        "No unsolicited sexual content or explicit messages",
        "No harassment, threats, or abusive language",
        "Respect when someone doesn't want to continue the conversation",
        "Report any inappropriate messages immediately"
      ]
    },
    {
      heading: "Photo and Content Standards",
      content: "All photos and content must meet our standards:",
      items: [
        "Photos must be of you (no stock photos, celebrities, or other people)",
        "No photos containing nudity, sexual content, or explicit imagery",
        "No photos with weapons, drugs, or illegal activities",
        "No photos promoting hate speech or discriminatory content",
        "No photos with contact information or external links",
        "Content must be appropriate for a college student audience",
        "We reserve the right to remove any content that violates these standards"
      ]
    },
    {
      heading: "Reporting and Enforcement",
      content: "We take violations seriously. Here's how we handle reports:",
      items: [
        "Report inappropriate behavior through in-app reporting features",
        "All reports are reviewed by our moderation team",
        "Violations may result in warnings, temporary suspensions, or permanent bans",
        "Severe violations (harassment, illegal activity) result in immediate permanent bans",
        "We may share information with law enforcement when required by law",
        "Appeals can be submitted through our support team"
      ]
    },
    {
      heading: "Age Verification",
      content: "qoupl is exclusively for users aged 18-25. We verify age and identity through:",
      items: [
        "Government-issued identification document (Aadhaar Card, PAN Card, Voter ID, Driving License, or Passport)",
        "Date of birth verification from the government-issued ID",
        "Photo verification to ensure profile matches the ID document",
        "Identity verification to confirm you are the person in the ID document",
        "Users found to be outside the age range or with invalid/forged documents will be immediately removed and may face legal action"
      ]
    },
    {
      heading: "Zero Tolerance Policy",
      content: "The following violations result in immediate permanent ban:",
      items: [
        "Harassment, threats, or violence",
        "Sharing explicit content involving minors",
        "Fraud, scams, or financial exploitation",
        "Impersonation or identity theft",
        "Illegal activities or promotion of illegal content",
        "Hate speech or discriminatory behavior"
      ]
    },
    {
      heading: "Appeal Process",
      content: "If you believe your account was suspended or banned in error, you can appeal:",
      items: [
        "Contact our support team at support@qoupl.ai",
        "Provide your account information and explanation",
        "Appeals are reviewed within 7-10 business days",
        "We will notify you of the decision via email"
      ]
    },
    {
      heading: "Contact Us",
      content: "Questions about these guidelines? Contact us at:",
      items: [
        "Email: community@qoupl.ai",
        "Support: support@qoupl.ai",
        "Address: B-98, Sector-2, Noida, Uttar Pradesh 201301, India"
      ]
    }
  ]
}

// ============================================================================
// SAFETY & SECURITY - Comprehensive Safety Guidelines
// ============================================================================

const safetyContent = {
  title: "Safety & Security",
  lastUpdated: currentDate,
  sections: [
    {
      heading: "Your Safety is Our Priority",
      content: "At qoupl, we're committed to creating a safe environment for college students to connect. This page provides essential safety information and resources to help you stay safe while using our platform and meeting people in person."
    },
    {
      heading: "Online Safety Tips",
      content: "Protect yourself while using qoupl:",
      items: [
        "Keep Personal Information Private: Don't share your phone number, email, home address, or social media handles until you're comfortable and have met in person",
        "Use In-App Messaging: Keep conversations on qoupl until you've built trust",
        "Verify Profiles: Look for verified badges and complete your own verification",
        "Trust Your Instincts: If something feels off, it probably is - trust your gut",
        "Report Suspicious Behavior: Report users who ask for money, share inappropriate content, or make you uncomfortable",
        "Block When Needed: Don't hesitate to block users who make you feel uncomfortable",
        "Be Wary of Scams: Never send money, gift cards, or financial information to anyone you meet online",
        "Research Your Match: Do a quick online search before meeting (but respect privacy)",
        "Video Chat First: Consider a video call before meeting in person",
        "Keep Your Account Secure: Use a strong password and enable two-factor authentication if available"
      ]
    },
    {
      heading: "Meeting in Person - Safety Guidelines",
      content: "When you're ready to meet someone in person, follow these safety guidelines:",
      items: [
        "Meet in Public: Always meet in a well-lit, public place for the first few dates",
        "Tell Someone: Inform a friend or family member about your plans, including who you're meeting, where, and when",
        "Share Your Location: Share your live location with a trusted friend during the date",
        "Arrange Your Own Transportation: Drive yourself or use a ride-sharing service - don't rely on your date for transportation",
        "Stay Sober: Avoid excessive alcohol consumption and never leave your drink unattended",
        "Trust Your Instincts: If you feel uncomfortable at any point, leave immediately",
        "Keep Your Phone Charged: Ensure your phone is fully charged and easily accessible",
        "Don't Go Home Together: Avoid going to your date's home or bringing them to yours on the first meeting",
        "Have an Exit Plan: Plan how you'll leave if you need to end the date early",
        "Take Your Time: There's no rush - take time to get to know someone before meeting"
      ]
    },
    {
      heading: "Red Flags to Watch For",
      content: "Be cautious if someone:",
      items: [
        "Asks for money, gift cards, or financial assistance",
        "Refuses to video chat or meet in person after extended conversation",
        "Pressures you to move conversations off the platform quickly",
        "Asks for explicit photos or sends unsolicited sexual content",
        "Has inconsistent stories or information that doesn't add up",
        "Gets angry or aggressive when you set boundaries",
        "Tries to isolate you from friends or family",
        "Shows signs of controlling or manipulative behavior",
        "Has a profile with very few photos or vague information",
        "Asks for personal information too early in the conversation"
      ]
    },
    {
      heading: "Photo Verification",
      content: "We offer photo verification to help ensure profiles are authentic:",
      items: [
        "Complete photo verification to show you're a real person",
        "Verified profiles are more likely to get matches",
        "Look for the verification badge on other users' profiles",
        "Verification helps prevent fake profiles and catfishing"
      ]
    },
    {
      heading: "Reporting and Blocking",
      content: "We provide tools to help you stay safe:",
      items: [
        "Report users who violate our Community Guidelines",
        "Block users who make you feel uncomfortable",
        "All reports are reviewed by our safety team",
        "We take action against users who violate our policies",
        "You can report even after unmatching or blocking"
      ]
    },
    {
      heading: "Age Verification",
      content: "qoupl is exclusively for college students aged 18-25. We verify age and identity through:",
      items: [
        "Government-issued identification document (Aadhaar Card, PAN Card, Voter ID, Driving License, or Passport)",
        "Date of birth verification from the government-issued ID",
        "Photo verification to match profile with the ID document",
        "Identity verification to confirm authenticity",
        "Users outside the age range or with invalid documents are immediately removed"
      ]
    },
    {
      heading: "Data Security",
      content: "We protect your data with industry-standard security measures:",
      items: [
        "End-to-end encryption for sensitive communications",
        "Secure data storage in compliance with Indian data protection laws",
        "Regular security audits and vulnerability assessments",
        "Limited access to personal data by authorized personnel only",
        "Compliance with Digital Personal Data Protection Act, 2023"
      ]
    },
    {
      heading: "Privacy Controls",
      content: "You have control over your privacy:",
      items: [
        "Control who can see your profile",
        "Manage your visibility settings",
        "Choose what information to share",
        "Delete your account and data at any time",
        "Access and download your data"
      ]
    },
    {
      heading: "Support Resources",
      content: "If you need help or have concerns:",
      items: [
        "In-App Support: Use the 'Report' or 'Help' features in the app",
        "Email Support: support@qoupl.ai",
        "Safety Team: safety@qoupl.ai",
        "Emergency: Contact local authorities (100 for police in India)",
        "Crisis Support: Reach out to mental health helplines if needed"
      ]
    },
    {
      heading: "Legal Compliance",
      content: "qoupl complies with all applicable Indian laws and regulations:",
      items: [
        "Information Technology Act, 2000",
        "Digital Personal Data Protection Act, 2023",
        "Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021",
        "Consumer Protection Act, 2019",
        "All content moderation and user safety measures comply with Indian regulations"
      ]
    },
    {
      heading: "Emergency Contacts (India)",
      content: "In case of emergency:",
      items: [
        "Police: 100",
        "Women's Helpline: 1091",
        "Cyber Crime: 1930 or cybercrime.gov.in",
        "Medical Emergency: 108",
        "Mental Health Helpline: 1800-599-0019 (Vandrevala Foundation)"
      ]
    },
    {
      heading: "Remember",
      content: "Your safety is more important than being polite. If you feel uncomfortable, unsafe, or threatened at any point, prioritize your safety:",
      items: [
        "Leave the situation immediately",
        "Contact authorities if needed",
        "Report the user on qoupl",
        "Reach out to our support team",
        "Talk to someone you trust"
      ]
    }
  ]
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function populateLegalContent() {
  console.log('🚀 Starting legal content population...\n')

  try {
    // Get page IDs
    const { data: pages, error: pagesError } = await adminClient
      .from('pages')
      .select('id, slug')
      .in('slug', ['privacy', 'terms', 'community-guidelines', 'safety'])

    if (pagesError) {
      throw new Error(`Failed to fetch pages: ${pagesError.message}`)
    }

    const pageMap = new Map((pages || []).map((p: { slug: string; id: string }) => [p.slug, p.id]))

    // Helper function to create/update section
    async function upsertSection(pageSlug: string, content: any) {
      const pageId = pageMap.get(pageSlug)
      if (!pageId) {
        console.error(`Page not found: ${pageSlug}`)
        return
      }

      // Check if section exists
      const { data: existing } = await adminClient
        .from('sections')
        .select('id')
        .eq('page_id', pageId)
        .eq('component_type', 'content')
        .maybeSingle()

      const sectionData = {
        page_id: pageId,
        component_type: 'content',
        order_index: 0,
        content: content,
        published: true,
      }

      if (existing) {
        // Update existing
        const { error } = await adminClient
          .from('sections')
          .update(sectionData)
          .eq('id', existing.id)

        if (error) throw error
        console.log(`Updated ${pageSlug} content`)
      } else {
        // Create new
        const { error } = await adminClient
          .from('sections')
          .insert(sectionData)

        if (error) throw error
        console.log(`Created ${pageSlug} content`)
      }
    }

    // Populate all legal pages
    await upsertSection('privacy', privacyPolicyContent)
    await upsertSection('terms', termsOfServiceContent)
    await upsertSection('community-guidelines', communityGuidelinesContent)
    await upsertSection('safety', safetyContent)

    console.log('\n✨ Legal content population completed successfully!')
  } catch (error) {
    console.error('Error populating legal content:', error)
    process.exit(1)
  }
}

// Run the script
populateLegalContent()

