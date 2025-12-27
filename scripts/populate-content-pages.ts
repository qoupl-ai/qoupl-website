/**
 * Populate Content Pages with Actual Content
 * 
 * Populates Community Guidelines, Safety, Privacy, and Terms pages with content sections.
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
dotenv.config({ path: join(process.cwd(), '.env.local') })
import { adminClient } from '../lib/supabase/admin'

async function getPageId(slug: string): Promise<string | null> {
  const { data, error } = await adminClient
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error(`❌ Page not found: ${slug}`, error?.message)
    return null
  }

  return data.id
}

async function updateContentPage(slug: string, sections: Array<{ heading?: string; content?: string; items?: string[] }>) {
  const pageId = await getPageId(slug)
  if (!pageId) return

  // Get existing content section
  const { data: existing } = await adminClient
    .from('sections')
    .select('id, content')
    .eq('page_id', pageId)
    .eq('component_type', 'content')
    .single()

  if (!existing) {
    console.error(`❌ Content section not found for ${slug}`)
    return
  }

  // Update with actual sections
  const { error } = await adminClient
    .from('sections')
    .update({
      content: {
        ...existing.content,
        sections: sections,
      },
    })
    .eq('id', existing.id)

  if (error) {
    console.error(`❌ Failed to update ${slug}:`, error.message)
  } else {
    console.log(`✅ Updated ${slug} with ${sections.length} sections`)
  }
}

async function populateCommunityGuidelines() {
  const sections = [
    {
      heading: "Welcome to qoupl",
      content: "Our mission is to help people find meaningful connections in a safe, respectful environment. These Community Guidelines help maintain a positive experience for everyone.",
    },
    {
      heading: "College Student Exclusivity (18-25 Years Only)",
      content: "qoupl is exclusively for college students aged 18 to 25 years. All users must verify their college student status during account creation using a valid college/university ID card. We only accept college ID cards for verification - no other identification documents are accepted. Users who are not current college students or are outside this age range are not permitted to use our platform.",
    },
    {
      heading: "1. Profile Guidelines",
      items: [
        "Use recent, clear photos of yourself",
        "Write an honest and genuine bio",
        "Show your personality and interests",
        "Use photos that clearly show your face",
        "Keep your information up to date",
      ],
    },
    {
      heading: "2. Communication Standards",
      items: [
        "Start conversations politely and respectfully",
        "Accept 'no' gracefully if someone isn't interested",
        "Respect response times - people are busy",
        "Avoid sending unsolicited explicit messages",
        "Don't spam or send repetitive messages",
      ],
    },
    {
      heading: "3. Prohibited Behavior",
      items: [
        "Any content involving minors",
        "Non-consensual intimate images",
        "Threats, violence, or harassment",
        "Hate speech or discrimination",
        "Human trafficking or prostitution",
        "Scams or financial fraud",
        "Catfishing: Impersonating someone else",
        "Spam: Promotional content or advertisements",
        "Bots: Using automated systems",
      ],
    },
    {
      heading: "4. Safety Guidelines",
      items: [
        "Meet in public places for first dates",
        "Tell a friend or family member where you're going",
        "Arrange your own transportation",
        "Stay sober and alert during first meetings",
        "Trust your instincts - leave if uncomfortable",
        "Don't share your home address early on",
        "Avoid sharing financial information",
      ],
    },
    {
      heading: "5. Reporting & Blocking",
      content: "Report users who violate these guidelines, make you feel unsafe, request money, send inappropriate content, or appear to be outside the 18-25 age range. Reports are reviewed within 24 hours and are anonymous and confidential.",
    },
  ]

  await updateContentPage('community-guidelines', sections)
}

async function populateSafety() {
  const sections = [
    {
      heading: "Your Safety is Our Top Priority",
      content: "At qoupl, we take your safety and security seriously. We've implemented multiple layers of protection to ensure you have a safe and positive experience on our platform.",
    },
    {
      heading: "Verification & Identity",
      items: [
        "Mandatory college ID verification for all users",
        "Photo verification with real-time selfie checks",
        "AI-powered fake profile detection",
        "Human moderation review process",
      ],
    },
    {
      heading: "Privacy Protection",
      items: [
        "End-to-end encryption for all messages",
        "Secure data storage and transmission",
        "No sharing of personal information with third parties",
        "You control who sees your profile information",
      ],
    },
    {
      heading: "Content Moderation",
      items: [
        "24/7 AI-powered content screening",
        "Automated detection of inappropriate content",
        "Human review of reported content",
        "Quick response to safety reports",
      ],
    },
    {
      heading: "Meeting Safely",
      items: [
        "Always meet in public places for first dates",
        "Tell someone you trust about your plans",
        "Arrange your own transportation",
        "Stay alert and trust your instincts",
        "Never share financial information",
      ],
    },
    {
      heading: "Report & Block",
      content: "If you encounter any suspicious behavior, harassment, or feel unsafe, use our report and block features. Our safety team reviews all reports within 24 hours and takes appropriate action.",
    },
  ]

  await updateContentPage('safety', sections)
}

async function populatePrivacy() {
  const sections = [
    {
      heading: "Information We Collect",
      items: [
        "Personal information: Name, age, email, phone number",
        "Profile information: Photos, bio, interests, preferences",
        "College information: University name, college ID verification",
        "Usage data: App interactions, matches, messages",
        "Device information: IP address, device type, location",
      ],
    },
    {
      heading: "How We Use Your Information",
      items: [
        "To provide and improve our services",
        "To verify your identity and college student status",
        "To match you with compatible users",
        "To ensure platform safety and security",
        "To communicate with you about your account",
      ],
    },
    {
      heading: "Data Security",
      content: "We use industry-standard encryption and security measures to protect your personal information. All data is stored securely and transmitted using encrypted connections.",
    },
    {
      heading: "Your Rights",
      items: [
        "Access your personal data",
        "Request correction of inaccurate data",
        "Request deletion of your account and data",
        "Opt-out of certain data processing",
        "File a complaint with data protection authorities",
      ],
    },
  ]

  await updateContentPage('privacy', sections)
}

async function populateTerms() {
  const sections = [
    {
      heading: "1. Acceptance of Terms",
      content: "By accessing and using qoupl, you accept and agree to be bound by these Terms of Service. If you do not agree, you may not use our services.",
    },
    {
      heading: "2. Eligibility",
      items: [
        "Must be 18-25 years old",
        "Must be a current college student",
        "Must verify college ID (mandatory)",
        "Must comply with all applicable laws",
      ],
    },
    {
      heading: "3. Account Registration",
      content: "You must provide accurate and complete information when creating your account. You are responsible for maintaining the security of your account credentials.",
    },
    {
      heading: "4. Mandatory College ID Verification",
      content: "All users must verify their college student status using a valid college/university ID card. We only accept college ID cards - no other identification documents are accepted. This verification is mandatory and must be completed before using the platform.",
    },
    {
      heading: "5. Prohibited Conduct",
      items: [
        "Harassment, bullying, or threatening behavior",
        "Sharing false or misleading information",
        "Impersonating others or creating fake accounts",
        "Spam, solicitation, or commercial activities",
        "Violating any applicable laws or regulations",
      ],
    },
    {
      heading: "6. Intellectual Property",
      content: "All content on qoupl, including text, graphics, logos, and software, is the property of qoupl and protected by copyright and other intellectual property laws.",
    },
    {
      heading: "7. Limitation of Liability",
      content: "qoupl is provided 'as is' without warranties. We are not liable for any damages arising from your use of the platform, including but not limited to interactions with other users.",
    },
    {
      heading: "8. Termination",
      content: "We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason we deem necessary to protect the platform and its users.",
    },
  ]

  await updateContentPage('terms', sections)
}

async function main() {
  console.log('🚀 Populating Content Pages...\n')

  await populateCommunityGuidelines()
  await populateSafety()
  await populatePrivacy()
  await populateTerms()

  console.log('\n✨ Content pages populated!')
}

main().catch(console.error)

