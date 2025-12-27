# qoupl Website - Complete Content Audit

**Date:** December 24, 2025
**Status:** Pre-Database Migration
**Purpose:** Foundation for Supabase schema design and CMS implementation

---

## Executive Summary

The qoupl website is a Next.js 16 (App Router) application with **12 main pages**, **20+ components**, and **100+ hardcoded content items**. All content is currently stored directly in React components. This audit documents the complete content structure to inform the database schema design.

---

## 1. Pages Inventory (12 Total)

| # | Route | Purpose | Key Content Types |
|---|-------|---------|-------------------|
| 1 | `/` | Landing page | Hero, features, testimonials, gallery |
| 2 | `/about` | Company story | Mission, values, timeline, team |
| 3 | `/features` | Product showcase | 4 tabbed categories, 12+ features |
| 4 | `/pricing` | Subscription pricing | Plans, message bundles, FAQ |
| 5 | `/faq` | Help center | 7 categories, 32 Q&A pairs |
| 6 | `/blog` | Articles | 6 blog posts with categories |
| 7 | `/careers` | Job opportunities | Values, open positions |
| 8 | `/contact` | Contact form | Form + contact info |
| 9 | `/safety` | Safety guidelines | Security features, tips |
| 10 | `/terms` | Legal | Terms of Service |
| 11 | `/privacy` | Legal | Privacy Policy |
| 12 | `/community-guidelines` | Rules | Community conduct |

---

## 2. Global Components (Appear on Every Page)

### Navbar
- **Links:** Home, About, Features, Safety & Security, Community Guidelines, FAQ
- **Features:** Theme toggle, mobile menu, scroll-triggered sticky behavior
- **Styling:** Glassmorphism with backdrop blur

### Footer
- **4-Column Layout:**
  1. **Brand:** Logo + social links (LinkedIn, Instagram)
  2. **Product:** Features, Pricing, FAQ, Waitlist
  3. **Company:** About, Blog, Careers, Contact
  4. **Legal:** Privacy, Terms, Community Guidelines, Safety
- **Social Media:**
  - LinkedIn: `linkedin.com/company/qoupl-ai`
  - Instagram: `instagram.com/qoupl.ai`
- **Copyright:** `© {currentYear} qoupl. All rights reserved. Made for meaningful connections.`

### Waitlist Modal
- **Form Fields:** Name, Email, Phone, Gender, Age (18-25), Looking For
- **Validation:** Age restriction (18-25 college students only)
- **Success State:** Confirmation message with confetti animation
- **Trigger:** "Join the Waitlist" buttons throughout site

---

## 3. Content Breakdown by Page

### Homepage (`/`)

**Hero Section:**
```
Tagline: "Be couple with qoupl"
Subtitle: "Find your vibe. Match your energy. Connect for real."
Waitlist Badge: "10,000+ On Waitlist"
CTA Button: "Join the Waitlist" (with "Free" badge)
Secondary Text: "Limited spots for early access"
```

**Floating Cards Carousel:**
- 16 images (10 women + 6 men)
- 3D rotation with mouse-tracking
- Auto-rotate every 4 seconds
- Images from `/public/images/women/` and `/public/images/men/`

**How It Works (5 Steps):**
1. Create Profile → "Set up your profile in minutes"
2. AI Matching → "Our AI finds your perfect matches"
3. Start Conversations → "Connect with meaningful chats"
4. Plan Dates → "Take it offline when ready"
5. Find Love → "Build lasting relationships"

**Product Features (3 Cards):**
1. **Smart AI Matching**
   - Icon: Heart
   - Color: Pink gradient
   - Text: "Advanced algorithms match you with compatible partners"

2. **Safe & Verified**
   - Icon: Shield
   - Color: Purple gradient
   - Text: "Verified profiles ensure authentic connections"

3. **Instant Connections**
   - Icon: Zap
   - Color: Violet gradient
   - Text: "Match and chat in real-time"

**Gallery:**
- 4 couple photos from `/public/images/coupl/`
- Bento grid layout

**Testimonials:**
- Instagram story-style cards
- User quotes and profile photos

**App Download CTA:**
- iOS and Android badges
- "Coming Soon" messaging

---

### About Page (`/about`)

**Hero:**
- 5-image bento grid (couple photos)
- Floating waitlist badge

**Mission & Vision:**
```
Mission Title: "Bringing People Together"
Mission Text: "qoupl is built on the belief that everyone deserves meaningful connections..."

Vision Title: "The Future of Dating"
Vision Text: "We're creating a platform where authenticity meets innovation..."
```

**Core Values (4):**
1. **Authenticity First**
   - Icon: Heart (purple)
   - Text: "We celebrate genuine connections and real personalities"

2. **Safety & Trust**
   - Icon: Shield (purple)
   - Text: "Your safety is our top priority, with verified profiles and AI moderation"

3. **Innovation**
   - Icon: Sparkles (purple)
   - Text: "Cutting-edge AI technology to enhance your dating experience"

4. **College Community**
   - Icon: Users (purple)
   - Text: "Exclusively for college students aged 18-25"

**Timeline (4 Milestones):**
```
2024: "qoupl Founded" - "Our journey began with a vision..."
2024: "Platform Development" - "Built our AI-powered matching..."
2025: "Beta Testing" - "Selected group of college students..."
2025: "Future Plans" - "Expanding features and reach..."
```

**Why Choose qoupl (6 Features):**
1. AI-Powered Matching
2. Verified Profiles
3. Safe & Secure
4. College-Exclusive
5. Smart Features
6. Love Stories

---

### Features Page (`/features`)

**4 Tabbed Categories:**

**Tab 1: Smart Matching**
- Image: `/public/qoupl/3.png`
- Features:
  1. **AI-Powered Algorithm** - "Advanced machine learning analyzes your preferences..."
  2. **Compatibility Score** - "See how well you match with potential partners..."
  3. **Learning Preferences** - "The more you use qoupl, the better it understands you"
  4. **Smart Filters** - "Customize your search with detailed preferences..."

**Tab 2: Safety & Trust**
- Image: `/public/qoupl/1.png`
- Features:
  1. **Photo Verification** - "Ensure profiles are real with our photo verification system"
  2. **College ID Verification** - "Exclusive to verified college students"
  3. **End-to-End Encryption** - "Your conversations are private and secure"
  4. **24/7 AI Moderation** - "Automated monitoring for inappropriate content"

**Tab 3: Rich Communication**
- Image: `/public/qoupl/4.png`
- Features:
  1. **Smart Icebreakers** - "AI-generated conversation starters..."
  2. **Photo & Video Sharing** - "Share moments with your matches securely"
  3. **Voice Messages** - "Add a personal touch to your conversations"
  4. **Real-time Chat** - "Instant messaging with online status indicators"

**Tab 4: Premium Experience**
- Image: `/public/qoupl/6.png`
- Features:
  1. **See Who Likes You** - "Know who's interested before you match"
  2. **Profile Boost** - "Get more visibility in your area"
  3. **Travel Mode** - "Connect with people in cities you're visiting"
  4. **Unlimited Likes** - "No daily limit on connections"

**Additional Features Grid (8):**
- Location-Based Matching
- Incognito Mode
- Super Likes
- Smart Alerts
- Activity Status
- Privacy Controls
- Date Planning Tools
- Instant Matching

---

### Pricing Page (`/pricing`)

**Platform Access:**
```
Price: ₹10/month
Title: "Monthly Subscription"
Subtitle: "Full platform access"
Features (8):
- AI-powered matching algorithm
- Advanced profile customization
- Photo verification badge
- End-to-end encrypted messaging
- See who views your profile
- Priority customer support
- Profile boost once a month
- Unlimited profile views
```

**Free Messages:**
```
Count: 3 messages per match
Note: "Start every conversation for free"
```

**Message Bundles:**
```
Bundle 1: 5 messages → ₹50 + GST (18%) = ₹59
Bundle 2: 10 messages → ₹100 + GST (18%) = ₹118 [POPULAR]
Bundle 3: 20 messages → ₹200 + GST (18%) = ₹236
Bundle 4: 50 messages → ₹500 + GST (18%) = ₹590
Custom: 5-100 messages (slider) → Calculated dynamically
```

**Calculation:**
- Price per message: ₹10
- GST: 18%
- Formula: `(messages × ₹10) × 1.18`

**Pricing FAQ (4 Q&A):**
1. Do message bundles expire? → "No, your message credits never expire..."
2. Can I cancel my subscription? → "Yes, you can cancel anytime..."
3. Are there any hidden fees? → "No, all prices are transparent..."
4. How do the 3 free messages work? → "You get 3 free messages per match..."

---

### FAQ Page (`/faq`)

**7 Categories, 32 Total Questions:**

**Category 1: Getting Started (4 Q&A)**
```
Q: How do I create an account on qoupl?
A: Download the app, sign up with email/phone, complete profile...

Q: Is qoupl free to use?
A: Yes! Basic features are free. 3 free messages per match...

Q: Who can join qoupl?
A: College students aged 18-25 only...

Q: How do I verify my profile?
A: Photo verification + college ID verification...
```

**Category 2: Matching & Discovery (4 Q&A)**
```
Q: How does the matching algorithm work?
A: AI analyzes profile, preferences, behavior, interests...

Q: Can I filter matches by specific criteria?
A: Yes - age, distance, interests, education...

Q: What if I run out of matches?
A: Expand search radius, update preferences, boost profile...

Q: Can I undo a swipe?
A: Premium feature - rewind last swipe...
```

**Category 3: Messaging & Communication (4 Q&A)**
```
Q: How do I start a conversation?
A: Match first, then send message (3 free per match)...

Q: Are messages encrypted?
A: Yes, end-to-end encryption for privacy...

Q: Can I send photos or videos?
A: Yes, securely share media (scanned for inappropriate content)...

Q: What if someone sends inappropriate messages?
A: Report immediately - reviewed within 24 hours...
```

**Category 4: Safety & Privacy (4 Q&A)**
```
Q: How does qoupl ensure my safety?
A: Photo verification, ID checks, AI moderation, encryption, reporting...

Q: Can I hide my profile?
A: Yes, incognito mode (premium) or pause account...

Q: What information is visible?
A: Name, age, photos, bio, interests (not phone/email)...

Q: How do I report suspicious behavior?
A: Click report button → select reason → submit...
```

**Category 5: Premium Features (4 Q&A)**
```
Q: What is qoupl Plus?
A: Premium subscription - see likes, unlimited swipes, boost, travel mode...

Q: How much does qoupl Plus cost?
A: ₹10/month platform access + message bundles...

Q: Can I cancel my subscription?
A: Yes, anytime - access until period ends...

Q: Is there a refund policy?
A: Within 48 hours if unused, contact support@qoupl.ai...
```

**Category 6: Profile & Account (4 Q&A)**
```
Q: How do I edit my profile?
A: Settings → Edit Profile → Save changes...

Q: What makes a good profile?
A: Clear photos, genuine bio, interests, complete info...

Q: Can I link social media?
A: Yes, Instagram/Spotify (optional, increases trust)...

Q: How do I delete my account?
A: Settings → Account → Delete Account (permanent)...
```

**Category 7: Technical Support (4 Q&A)**
```
Q: The app is not working properly
A: Update app, restart device, clear cache, contact support...

Q: I'm not receiving notifications
A: Check settings → enable notifications → allow permissions...

Q: I can't log in to my account
A: Reset password → verify email → contact support if persists...

Q: Can I use qoupl on multiple devices?
A: Yes, same account on multiple devices (not simultaneously)...
```

**Category 8: Success & Tips (4 Q&A)**
```
Q: How can I increase my matches?
A: Complete profile, quality photos, active, update preferences...

Q: How long until I get a match?
A: Varies - optimize profile, be patient...

Q: What's the best first message?
A: Personalized, reference profile, ask question...

Q: How do I know when to meet in person?
A: Multiple conversations, video call first, public place, trust instinct...
```

---

### Blog Page (`/blog`)

**6 Blog Posts:**

```javascript
Post 1:
  Title: "The Future of AI in Online Dating"
  Category: Technology
  Date: November 15, 2025
  Read Time: 5 min
  Excerpt: "Explore how artificial intelligence is revolutionizing..."
  Image: "indian-student-goes-first-lesson.jpg"

Post 2:
  Title: "Building Authentic Connections in a Digital World"
  Category: Relationships
  Date: November 10, 2025
  Read Time: 7 min
  Excerpt: "In an era of swipes and likes, learn how to create..."
  Image: "hannah-skelly-_wQqLdsgr4I-unsplash.jpg"

Post 3:
  Title: "Safety First: Your Guide to Secure Online Dating"
  Category: Safety
  Date: November 5, 2025
  Read Time: 6 min
  Excerpt: "Essential tips and best practices for staying safe..."
  Image: "medium-shot-man-with-paperwork.jpg"

Post 4:
  Title: "The Psychology of Modern Romance"
  Category: Psychology
  Date: November 1, 2025
  Read Time: 8 min
  Excerpt: "Understanding the psychological aspects of digital dating..."
  Image: "boy-giving-piggy-back-ride-his-girlfriend.jpg"

Post 5:
  Title: "Creating the Perfect Dating Profile"
  Category: Tips & Tricks
  Date: October 28, 2025
  Read Time: 4 min
  Excerpt: "Step-by-step guide to crafting a profile that stands out..."
  Image: "Gemini_Generated_Image_6cx31l6cx31l6cx3.png"

Post 6:
  Title: "The Importance of Emotional Intelligence in Relationships"
  Category: Relationships
  Date: October 25, 2025
  Read Time: 6 min
  Excerpt: "How emotional intelligence can help you build stronger..."
  Image: "Gemini_Generated_Image_l957byl957byl957.png"
```

**Categories:** Technology, Relationships, Safety, Psychology, Tips & Tricks

---

### Careers Page (`/careers`)

**Hero:**
```
Title: "Build the Future of Dating"
Subtitle: "Join Our Team"
Description: "We're looking for passionate individuals who want to make a difference..."
```

**Team Values (4):**
```
1. Passion-Driven
   "We're passionate about creating meaningful connections"

2. Collaborative
   "We believe in the power of teamwork and diverse perspectives"

3. Innovation
   "We're constantly pushing the boundaries of what's possible"

4. Excellence
   "We strive for excellence in everything we do"
```

**CTA:**
```
"No open positions at the moment"
"Check back soon or send your resume to careers@qoupl.ai"
```

---

### Contact Page (`/contact`)

**Contact Information:**
```
Email: support@qoupl.ai
Phone: +91 9103732229
Address: B-98, Sector-2, Noida, UP 201301
```

**Support Channels:**
```
Primary: support@qoupl.ai
Secondary: help@qoupl.ai
```

**Contact Form Fields:**
- Name (text, required)
- Email (email, required)
- Subject (text, required)
- Message (textarea, required)

---

### Safety Page (`/safety`)

**Our Commitment:**
```
"Your safety and security are our top priorities. We've built qoupl with multiple layers of protection to ensure you can focus on making meaningful connections with confidence."
```

**Security Features (4):**
```
1. End-to-End Encryption
   "All messages are encrypted end-to-end..."

2. Photo Verification
   "Verify your profile with a real-time photo..."

3. AI Moderation
   "24/7 automated monitoring..."

4. Human Review
   "Dedicated safety team reviews reports..."
```

**Online Safety Tips:**
```
Protect Your Privacy:
- Don't share personal info early
- Use qoupl's in-app messaging
- Be cautious with external links
- Trust your instincts

Red Flags to Watch (8):
- Asks for money
- Refuses video calls
- Shares sob stories
- Pressures to move off-platform
- Profile inconsistencies
- Aggressive/controlling
- Too good to be true
- Avoids meeting in person
```

**Meeting in Person:**
```
Before:
- Multiple conversations first
- Video call verification
- Tell friend/family
- Meet in public place

During:
- Stay in public areas
- Arrange own transportation
- Stay sober
- Trust instincts
```

---

### Terms of Service (`/terms`)

**Key Sections:**
```
Last Updated: November 20, 2025

1. Acceptance of Terms
2. Eligibility
   - Must be 18-25 years old
   - Must be a college student
   - Must verify college ID (mandatory)
3. Account Registration
4. Mandatory College ID Verification
5. Prohibited Conduct
6. Content Guidelines
7. Intellectual Property
8. Limitation of Liability
9. Termination
10. Governing Law (India)
```

---

### Privacy Policy (`/privacy`)

**Data Collection:**
```
Personal Information Collected:
- Name, age, date of birth
- Email address, phone number
- Gender, sexual orientation
- Location data
- Photos and profile images
- Bio and interests
- College/university information
- Social media profiles (optional)
- College ID card (mandatory)

Usage Information:
- Device information
- IP address
- Browser type
- App interactions
- Messages sent/received
- Matches and preferences
```

**Legal Compliance:**
```
- Information Technology Act, 2000 (India)
- Reasonable Security Practices & Procedures
- Sensitive Personal Data protection
```

**Key Requirements:**
```
- College ID card mandatory (no other ID types accepted)
- Age verification (18-25 years)
- Consent for data collection
```

---

### Community Guidelines (`/community-guidelines`)

**Core Rules:**
```
1. College Student Exclusivity
   "qoupl is exclusively for college students aged 18-25"
   "Must provide valid college ID"

2. Be Authentic
   "Use real photos"
   "Provide honest information"
   "Don't impersonate others"

3. Stay Safe
   "Protect personal information"
   "Report suspicious activity"
   "Don't share financial info"

4. Respect Everyone
   "Treat others with kindness"
   "No harassment or hate speech"
   "No discrimination"

5. Communicate Clearly
   "No spam or solicitation"
   "Keep conversations respectful"
   "Use appropriate language"
```

---

## 4. Image Assets Inventory

### Directory Structure:
```
/public/
├── images/
│   ├── coupl/                    # 4 couple photos
│   │   ├── hannah-skelly-_wQqLdsgr4I-unsplash.jpg
│   │   ├── boy-giving-piggy-back-ride-his-girlfriend.jpg
│   │   ├── man-loving-her-wife-holding-open-book...jpg
│   │   └── young-couple-valentines-day...jpg
│   ├── men/                      # 6 male profiles
│   │   ├── Gemini_Generated_Image_*.png (6 files)
│   └── women/                    # 10 female profiles
│       ├── Gemini_Generated_Image_*.png (10 files)
├── qoupl/                        # App screenshots
│   ├── 1.png (verification screen)
│   ├── 2.png
│   ├── 3.png (matching screen)
│   ├── 4.png (chat screen)
│   ├── 5.png
│   └── 6.png (premium features)
└── [logo/icon files]
```

### Image Usage Map:
| Component | Count | Source Directory |
|-----------|-------|------------------|
| Hero carousel | 16 | `/images/women/` + `/images/men/` |
| About hero grid | 4 | `/images/coupl/` |
| Gallery section | 4 | `/images/coupl/` |
| Feature tabs | 4 | `/qoupl/` |
| Blog posts | 6 | Mixed from `/images/` |
| Testimonials | Variable | `/images/women/` |

**Total Images to Migrate:** ~30 files

---

## 5. Database Schema Requirements

Based on this audit, the following database structure is recommended:

### **Tables Needed:**

#### 1. `pages`
```sql
- id (uuid, pk)
- slug (text, unique)
- title (text)
- description (text)
- metadata (jsonb)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. `sections`
```sql
- id (uuid, pk)
- page_id (uuid, fk -> pages)
- component_type (text) -- 'hero', 'features', 'gallery', etc.
- order_index (integer)
- content (jsonb) -- flexible JSON config
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. `blog_posts`
```sql
- id (uuid, pk)
- title (text)
- slug (text, unique)
- excerpt (text)
- content (text) -- full article
- category (text)
- author (text)
- publish_date (timestamp)
- read_time (integer) -- minutes
- featured_image (text) -- storage path
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. `faqs`
```sql
- id (uuid, pk)
- category (text)
- question (text)
- answer (text)
- order_index (integer)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. `features`
```sql
- id (uuid, pk)
- category (text) -- 'smart_matching', 'safety', etc.
- title (text)
- description (text)
- icon (text) -- lucide icon name
- order_index (integer)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. `pricing_plans`
```sql
- id (uuid, pk)
- plan_type (text) -- 'subscription', 'bundle'
- name (text)
- price (numeric)
- currency (text)
- features (jsonb) -- array of features
- popular (boolean)
- order_index (integer)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 7. `global_content`
```sql
- id (uuid, pk)
- key (text, unique) -- 'navbar', 'footer', 'contact_info'
- content (jsonb)
- updated_at (timestamp)
```

#### 8. `media`
```sql
- id (uuid, pk)
- filename (text)
- storage_path (text)
- bucket_name (text)
- file_type (text) -- 'image/jpeg', etc.
- alt_text (text)
- category (text) -- 'hero', 'blog', 'gallery', etc.
- metadata (jsonb)
- uploaded_at (timestamp)
```

#### 9. `waitlist_signups`
```sql
- id (uuid, pk)
- name (text)
- email (text)
- phone (text)
- gender (text)
- age (integer)
- looking_for (text)
- verified (boolean)
- signup_date (timestamp)
```

#### 10. `contact_submissions`
```sql
- id (uuid, pk)
- name (text)
- email (text)
- subject (text)
- message (text)
- status (text) -- 'new', 'replied', 'resolved'
- submitted_at (timestamp)
```

#### 11. `content_history`
```sql
- id (uuid, pk)
- entity_type (text) -- 'blog_post', 'faq', 'page', etc.
- entity_id (uuid)
- action (text) -- 'created', 'updated', 'published', 'deleted'
- snapshot (jsonb) -- full data snapshot
- performed_by (uuid) -- user_id
- performed_at (timestamp)
```

---

## 6. Supabase Storage Buckets

### Buckets to Create:
```
1. hero-images
   - Purpose: Carousel images (men/women)
   - Access: Public
   - Count: 16 images

2. couple-photos
   - Purpose: Gallery and about page
   - Access: Public
   - Count: 4 images

3. app-screenshots
   - Purpose: Feature showcase
   - Access: Public
   - Count: 6 images

4. blog-images
   - Purpose: Blog post featured images
   - Access: Public
   - Count: 6+ images

5. user-uploads
   - Purpose: Future user-generated content
   - Access: Authenticated
   - Count: Variable
```

---

## 7. Content Migration Priority

### Phase 1: Foundation
1. Global content (navbar, footer)
2. Contact information
3. Homepage hero section

### Phase 2: Static Pages
1. About page (mission, values, timeline)
2. Features page (4 categories)
3. Pricing page (plans, bundles)

### Phase 3: Dynamic Content
1. FAQ (32 Q&A pairs)
2. Blog posts (6 articles)
3. Testimonials

### Phase 4: Forms
1. Waitlist signups
2. Contact submissions
3. Publish history tracking

---

## 8. Key Findings & Recommendations

### Critical Observations:
1. **All content is hardcoded** - No database integration currently
2. **Forms don't submit** - API routes exist but not implemented
3. **Images are local** - Need migration to Supabase Storage
4. **No CMS exists** - Admins can't update content without code changes

### Success Metrics After Migration:
- ✅ 100+ content items moved to database
- ✅ ~30 images migrated to Supabase Storage
- ✅ CMS can CRUD all content types
- ✅ Publish history tracks all changes
- ✅ Zero hardcoded content in components
- ✅ Admins can update site without developers

---

## 9. Next Steps

1. ✅ **Content audit complete** (this document)
2. ⏳ Upgrade Supabase packages
3. ⏳ Create client architecture (server.ts, client.ts, admin.ts)
4. ⏳ Design and create database schema
5. ⏳ Set up Storage buckets and migrate images
6. ⏳ Build CMS at `/add-content`
7. ⏳ Refactor components to fetch from Supabase
8. ⏳ Implement publish history
9. ⏳ Set up authentication with Supabase Auth UI

---

**Document Version:** 1.0
**Last Updated:** December 24, 2025
**Audit Completed By:** Claude Sonnet 4.5
