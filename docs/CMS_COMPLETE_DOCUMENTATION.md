# CMS Complete Documentation

**Last Updated:** 2025-01-XX  
**Purpose:** Complete end-to-end documentation of the CMS system, website pages, sections, and functionality.

---

## Table of Contents

1. [Website Pages Overview](#website-pages-overview)
2. [Page-by-Page Section Breakdown](#page-by-page-section-breakdown)
3. [CMS System Architecture](#cms-system-architecture)
4. [CMS User Interface](#cms-user-interface)
5. [CMS Flow & Functionality](#cms-flow--functionality)
6. [Section Types & Data Structures](#section-types--data-structures)
7. [CMS Styling & Design System](#cms-styling--design-system)
8. [Complete User Journey](#complete-user-journey)

---

## Website Pages Overview

The website consists of **12 public pages** plus **1 special global content page**:

### Public Pages
1. **Home** (`/`) - Landing page
2. **About** (`/about`) - About us page
3. **Features** (`/features`) - Features showcase
4. **Pricing** (`/pricing`) - Pricing plans
5. **FAQ** (`/faq`) - Frequently asked questions
6. **Blog** (`/blog`) - Blog listing and posts
7. **Careers** (`/careers`) - Careers page
8. **Contact** (`/contact`) - Contact page
9. **Safety** (`/safety`) - Safety and security
10. **Privacy** (`/privacy`) - Privacy policy
11. **Terms** (`/terms`) - Terms of service
12. **Community Guidelines** (`/community-guidelines`) - Community guidelines

### Special Pages
- **Global Content** (`__global__`) - Site-wide content (Navbar, Footer, Social Links)

---

## Page-by-Page Section Breakdown

### 1. Home Page (`/`)

**Sections (in order):**

#### Section 1: Hero (animated-hero)
- **Title** - Main heading text
- **Tagline** - Secondary heading
- **Subtitle** - Descriptive text below tagline
- **CTA Button** - Call-to-action button with:
  - Button text
  - Subtext (optional badge text)
  - Badge label (e.g., "Free")
- **Image Carousel** - Floating cards carousel with:
  - Women images array (multiple image paths)
  - Men images array (multiple image paths)
  - Auto-rotating carousel animation
  - Magnetic hover effects

#### Section 2: How It Works (how-it-works)
- **Title** - Section heading
- **Steps Array** - Multiple step items, each containing:
  - Step number (e.g., "01", "02")
  - Step title
  - Step description
  - Step image (screenshot)

#### Section 3: Product Features (product-features)
- **Title** - Section heading
- **Subtitle** - Section description
- **Features Array** - Multiple feature items, each containing:
  - Icon (Heart, Shield, Zap, etc.)
  - Title
  - Description
  - Highlights array (bullet points)
  - Feature image
  - Color (background color code)

#### Section 4: Gallery (gallery)
- **Title** - Section heading
- **Subtitle** - Section description
- **Badge** - Optional badge with icon and text
- **Images Array** - Multiple gallery items, each containing:
  - Image path
  - Alt text
  - Title (couple name)
  - Story (couple story text)
- **CTA** - Call-to-action with text and highlight

#### Section 5: Testimonials (testimonials)
- **Title** - Section heading
- **Subtitle** - Section description
- **Testimonials Array** - Multiple testimonial items, each containing:
  - Name
  - Image (profile photo)
  - Text (testimonial content)
  - Location
  - Rating (1-5 stars)
  - Date/Badge (e.g., "Beta User")

#### Section 6: App Download (app-download)
- **Title** - Section heading
- **Subtitle** - Section description
- **Platforms Array** - Multiple platform items, each containing:
  - Platform name (iOS, Android)
  - Download link
  - Icon
- **Stats** - Optional statistics display:
  - Count number
  - Label text

#### Section 7: Coming Soon (coming-soon)
- **Title** - Section heading
- **Subtitle** - Section description
- **Badge** - Optional badge
- **CTA Button** - Call-to-action

---

### 2. About Page (`/about`)

**Sections (typical):**

#### Section 1: Hero (hero or contact-hero)
- Title
- Subtitle
- Background image (optional)

#### Section 2: Values (values)
- **Title** - Section heading
- **Values Array** - Multiple value items, each containing:
  - Title
  - Description
  - Icon (optional)

#### Section 3: Timeline (timeline)
- **Title** - Section heading
- **Events Array** - Multiple timeline items, each containing:
  - Year/Date
  - Title
  - Description
  - Image (optional)

#### Section 4: Why Join (why-join)
- **Title** - Section heading
- **Reasons Array** - Multiple reason items, each containing:
  - Title
  - Description
  - Icon
  - Image (optional)

#### Section 5: Content (content)
- Flexible content block with:
  - Title
  - Rich text content
  - Images
  - Custom HTML/JSX

---

### 3. Features Page (`/features`)

**Sections:**

#### Section 1: Feature Category (feature-category)
- **Title** - Section heading
- **Subtitle** - Section description
- **Categories Array** - Multiple feature categories, each containing:
  - Category name
  - Category description
  - **Features Array** - Features within category, each containing:
    - Feature title
    - Feature description
    - Icon
    - Image
    - Highlights array

---

### 4. Pricing Page (`/pricing`)

**Sections:**

#### Section 1: Pricing Hero (pricing-hero)
- **Title** - Section heading
- **Subtitle** - Section description
- **Badge** - Optional badge
- **CTA Button** - Call-to-action

#### Section 2: Pricing Plans (pricing-plans)
- **Title** - Section heading
- **Plans Array** - Multiple pricing plan items, each containing:
  - Plan name
  - Price (amount)
  - Billing period (monthly/yearly)
  - Description
  - Features array (included features list)
  - CTA button text
  - Popular badge (boolean)
  - Icon/Image (optional)

#### Section 3: Free Messages (free-messages)
- **Title** - Section heading
- **Message Count** - Number of free messages
- **Description** - Explanation text

#### Section 4: Message Bundles (message-bundles)
- **Title** - Section heading
- **Bundles Array** - Multiple message bundle items, each containing:
  - Bundle name
  - Message count
  - Price
  - Description

#### Section 5: Pricing Info (pricing-info)
- **Title** - Section heading
- **Info Items Array** - Multiple info items, each containing:
  - Title
  - Description
  - Icon (optional)

#### Section 6: Pricing FAQ (pricing-faq)
- **Title** - Section heading
- **Questions Array** - Multiple FAQ items, each containing:
  - Question
  - Answer

---

### 5. FAQ Page (`/faq`)

**Sections:**

#### Section 1: FAQ Category (faq-category)
- **Title** - Section heading
- **Subtitle** - Section description
- **Categories Array** - Multiple FAQ categories, each containing:
  - Category name
  - Category description
  - **Questions Array** - FAQs within category, each containing:
    - Question
    - Answer

---

### 6. Blog Page (`/blog`)

**Note:** Blog page displays blog posts directly from `blog_posts` table, not sections.

**Blog Post Structure:**
- Title
- Slug (URL-friendly identifier)
- Content (rich text/markdown)
- Excerpt
- Featured image
- Publish date
- Category
- Author
- Published status (boolean)

---

### 7. Contact Page (`/contact`)

**Sections:**

#### Section 1: Contact Hero (contact-hero)
- **Title** - Section heading
- **Subtitle** - Section description
- **Background image** (optional)

#### Section 2: Contact Info (contact-info)
- **Title** - Section heading
- **Info Items Array** - Multiple contact items, each containing:
  - Icon
  - Title
  - Description/Value
  - Link (optional)

#### Section 3: Contact Info Details (contact-info-details)
- **Title** - Section heading
- **Details Cards Array** - Multiple detail cards, each containing:
  - Title
  - Description
  - Icon
  - Contact method (email, phone, address)

#### Section 4: Contact Form
- Name field
- Email field
- Subject field
- Message field
- Submit button

---

### 8. Careers Page (`/careers`)

**Sections (typical):**
- Hero section
- Job listings (from database)
- Benefits section
- Application form

---

### 9. Safety Page (`/safety`)

**Sections (typical):**
- Hero section
- Safety features list
- Verification process
- Reporting mechanisms
- Trust indicators

---

### 10. Privacy Page (`/privacy`)

**Sections:**
- Content section with privacy policy text
- Last updated date
- Contact information

---

### 11. Terms Page (`/terms`)

**Sections:**
- Content section with terms of service text
- Last updated date
- Contact information

---

### 12. Community Guidelines Page (`/community-guidelines`)

**Sections:**
- Content section with guidelines text
- Rules list
- Enforcement information

---

### Global Content (`__global__`)

**Special sections that appear site-wide:**

#### Navbar Section (content with key="navbar")
- **Logo** - Logo image with:
  - Source path
  - Alt text
  - Width
  - Height
- **Links Array** - Navigation links, each containing:
  - href (page slug or URL)
  - label (display text)

#### Footer Section (content with key="footer")
- **Brand** - Brand information:
  - Description text
  - Logo (image with src, alt, width, height)
- **Columns** - Footer link columns:
  - **Product Column**:
    - Title
    - Links array (href, label)
  - **Company Column**:
    - Title
    - Links array (href, label)
  - **Legal Column**:
    - Title
    - Links array (href, label)
- **Copyright** - Copyright information:
  - Text
  - Company name

#### Social Links Section (content with key="social_links")
- **Links Array** - Social media links, each containing:
  - Icon (LinkedIn, Instagram, Twitter, etc.)
  - URL
  - Label

---

## CMS System Architecture

### Database Structure

#### Tables:
1. **pages** - Website pages
   - id, slug, title, description, published, created_at, updated_at

2. **sections** - Page sections
   - id, page_id, section_type, order_index, content (JSONB), published, created_at, updated_at

3. **content_history** - Audit trail
   - id, entity_type, entity_id, action, snapshot (JSONB), performed_by, performed_at

4. **global_content** - Global content items
   - id, key, content (JSONB), updated_at, updated_by

5. **blog_posts** - Blog posts
   - id, title, slug, content, excerpt, featured_image, publish_date, category_id, author_id, published

6. **faqs** - FAQ items
   - id, question, answer, category_id, order_index, published

7. **features** - Feature items
   - id, title, description, icon, image, category_id, order_index, published

8. **pricing_plans** - Pricing plans
   - id, name, price, billing_period, description, features, popular, published

9. **media** - Media files
   - id, filename, path, bucket, mime_type, size, uploaded_by, created_at

10. **admin_users** - Admin users
    - id, user_id, name, is_active, created_at

---

## CMS User Interface

### CMS Layout Structure

#### Sidebar Navigation (Left)
- **Width:** 200px (expanded) / 60px (collapsed)
- **Position:** Fixed left
- **Background:** CMS sidebar background color
- **Border:** Right border with CMS border color

**Navigation Items:**
1. **Dashboard** (`/add-content`)
   - Icon: LayoutDashboard
   - Shows stats cards and recent activity

2. **Pages** (`/add-content/pages`)
   - Icon: FileText
   - Lists all website pages

3. **Global Content** (`/add-content/global`)
   - Icon: Sparkles
   - Edit navbar, footer, social links

4. **Media** (`/add-content/media`)
   - Icon: ImageIcon
   - Media file management

5. **History** (`/add-content/history`)
   - Icon: History
   - Content change history

**Sidebar Features:**
- User profile section (bottom)
- Sign out button
- Sidebar mode toggle (Expanded/Collapsed/Hover)
- Theme toggle (Dark/Light/System)

#### Main Content Area
- **Margin Left:** 200px (when sidebar expanded) / 60px (when collapsed)
- **Background:** CMS main background color
- **Padding:** Container padding
- **Font:** Google Sans Flex

---

## CMS Flow & Functionality

### 1. Dashboard (`/add-content`)

**What You See:**
- **Page Title:** "CMS Dashboard"
- **Description:** "Manage all your website content from one place"

**Stats Grid:**
- 6 stat cards in grid layout (2 columns on tablet, 3 on desktop)
- Each card shows:
  - Icon (top right)
  - Title (e.g., "Blog Posts")
  - Count number (large, bold)
  - "Total items" label
  - Clickable to navigate to respective page

**Recent Activity Card:**
- Shows last 5 content changes
- Each activity item displays:
  - Action badge (Created/Updated/Deleted) with color:
    - Created: Green (#10b981)
    - Updated: Blue (#3b82f6)
    - Deleted: Red (#ef4444)
    - Published: Green (#10b981)
    - Unpublished: Orange (#f59e0b)
  - Entity type badge (Section/Page/Blog Post/etc.)
  - Entity title/name
  - Page context (for sections)
  - Timestamp
- "View All History" button at bottom

**Quick Actions Card:**
- 4 action buttons in grid:
  - Create Blog Post
  - Add FAQ
  - Add Feature
  - Upload Media

---

### 2. Pages List (`/add-content/pages`)

**What You See:**
- **Page Title:** "Pages"
- **Description:** "Manage all website pages and their sections"

**Pages Grid:**
- Cards in grid layout (2 columns on tablet, 3 on desktop)
- Each page card displays:
  - **Header:**
    - Eye icon (if published) / EyeOff icon (if unpublished)
    - Page title (bold)
    - Page slug (e.g., "/home")
    - Section count (e.g., "5 sections")
  - **Content:**
    - Page description (if available, truncated to 2 lines)
  - **Actions:**
    - "Edit" button (primary action, full width)
    - "View" button (ghost variant, opens page in new tab)

**Page Order:**
Pages are sorted by predefined order:
1. home
2. about
3. features
4. pricing
5. faq
6. blog
7. careers
8. contact
9. safety
10. privacy
11. terms
12. community-guidelines

---

### 3. Page Editor (`/add-content/pages/[slug]`)

**What You See:**
- **Header:**
  - Back button (arrow left icon)
  - Page title (large, bold)
  - Page slug (small, secondary text)
  - "Manage Posts" button (for blog page only)
  - "Add Section" button (plus icon)

**Blog Page Special:**
- If editing blog page, shows preview card:
  - "Blog Posts (X)" title
  - List of recent blog posts
  - Each post shows:
    - Title
    - Category badge
    - Published/Draft status
    - Edit button

**Sections List:**
- **Tip Banner:** Blue info box explaining drag-to-reorder functionality
- **Sortable Sections List:**
  - Each section displayed as a card
  - **Section Card Contains:**
    - **Drag Handle:** Grip icon on left (vertical dots)
    - **Icon:** Section type icon (Sparkles, Layout, Zap, etc.)
    - **Title:** Section title (from content or section type name)
    - **Metadata:**
      - Section type name (user-friendly label)
      - Order index (e.g., "in order 1")
      - Published/Draft badge
    - **Content Preview:** 
      - Collapsible preview area
      - Shows key content fields (title, subtitle, item counts, etc.)
      - Formatted based on section type
    - **Actions:**
      - Preview button (eye icon) - Opens preview dialog
      - History button (clock icon) - Opens rollback dialog
      - Edit button (pencil icon) - Opens section editor
      - Delete button (trash icon) - Deletes section

**Global Page Warning:**
- If editing `__global__` page, shows red alert:
  - Warning icon
  - "Caution: Global Content" title
  - Warning message about site-wide impact

**Empty State:**
- If no sections exist:
  - Card with "No Sections" title
  - Description explaining how to add sections
  - "Add Section" button

---

### 4. Section Editor Dialog

**What Opens:**
- Full-screen modal dialog
- **Header:**
  - Title: "Create Section" or "Edit Section"
  - Description: Brief explanation

**Form Structure:**
- **Section Type Selector:**
  - Dropdown to select section type
  - Shows all available section types
  - Grouped by category (if applicable)

- **Order Index:**
  - Number input
  - Determines section order on page

- **Published Toggle:**
  - Switch component
  - On = Published (visible on public site)
  - Off = Draft (only visible in CMS)

- **Content Fields:**
  - Dynamically generated based on section type
  - Uses Zod schema to determine field types
  - **Field Types:**
    - Text input (single line)
    - Textarea (multi-line)
    - Number input
    - Boolean switch
    - Select dropdown
    - Image upload (with preview)
    - Multi-image upload
    - Icon selector
    - Array fields (add/remove items)
    - Nested object fields

**Form Features:**
- Real-time validation
- Error messages below fields
- Required field indicators
- Field descriptions/help text
- Image previews
- Drag-to-reorder for arrays

**Actions:**
- Cancel button (outline variant)
- Save button (primary, shows "Saving..." when loading)

**On Save:**
- Validates all fields
- Shows success toast
- Closes dialog
- Refreshes page
- Updates section list

---

### 5. Section Preview Dialog

**What Opens:**
- Modal dialog (responsive: 95vw on mobile, 4xl on tablet, 6xl on desktop)
- **Header:**
  - Title: "Preview Section"
  - Description: "Published version" or "Draft preview - not visible to visitors"

**Content:**
- **Draft Warning:** Yellow alert box (if unpublished)
- **Section Render:**
  - Renders actual section component
  - Shows exactly how it appears on website
  - Responsive layout
  - Scrollable content area (only if content exceeds viewport)

**Actions:**
- Close button (X in top right)

---

### 6. Section Rollback Dialog

**What Opens:**
- Modal dialog
- **Header:**
  - Title: "Section History"
  - Description: "View and restore previous versions"

**Content:**
- **History List:**
  - Shows last 20 history entries
  - Each entry displays:
    - Timestamp (relative time, e.g., "2 hours ago")
    - Action type (Updated/Deleted)
    - Snapshot preview (key content fields)
    - "Restore" button
  - Sorted by newest first

**Actions:**
- Click "Restore" on any history entry:
  - Confirmation dialog appears
  - On confirm: Restores section to that version
  - Shows success toast
  - Closes dialog
  - Refreshes page

---

### 7. Global Content Editor (`/add-content/global`)

**What You See:**
- **Page Title:** "Global Content"
- **Description:** "Edit site-wide content"

**Content Cards:**
- 5 content type cards:
  1. **Navigation Bar**
     - Icon: Link2
     - Description: "Edit navigation links and logo"
  2. **Footer**
     - Icon: FileText
     - Description: "Edit footer links, description, and copyright"
  3. **Social Links**
     - Icon: Smartphone
     - Description: "Edit social media links (LinkedIn, Instagram)"
  4. **Contact Information**
     - Icon: Mail
     - Description: "Edit contact email, phone, and address"
  5. **Site Configuration**
     - Icon: Settings
     - Description: "Edit site-wide settings (tagline, waitlist count)"

**Each Card:**
- Shows "Edit" button
- Clicking opens editor dialog

**Editor Dialog (Navbar Example):**
- **Logo Section:**
  - Image upload field
  - Alt text input
  - Width/Height inputs
- **Links Section:**
  - Sortable list of links
  - Each link has:
    - Page selector dropdown
    - Label input
    - Delete button
  - "Add Link" button
- **Save/Cancel buttons**

---

### 8. Media Manager (`/add-content/media`)

**What You See:**
- **Page Title:** "Media"
- **Description:** "Manage media files"

**Features:**
- Upload area
- Media grid/list view
- File details (name, size, type, upload date)
- Delete functionality
- Search/filter

---

### 9. History Page (`/add-content/history`)

**What You See:**
- **Page Title:** "Content History"
- **Description:** "View all content changes"

**Features:**
- Full history list (all entities)
- Filters (by entity type, action, date)
- Search functionality
- Rollback actions

---

## Section Types & Data Structures

### Available Section Types (23 total)

#### Layout Sections
1. **hero** - Hero section with title, subtitle, CTA, carousel
2. **contact-hero** - Contact page hero
3. **pricing-hero** - Pricing page hero

#### Content Sections
4. **blog-post** - Blog post content
5. **faq-category** - FAQ category with questions
6. **feature-category** - Feature category with features
7. **how-it-works** - Step-by-step explanation
8. **gallery** - Image gallery with carousel
9. **testimonials** - Customer testimonials
10. **contact-info** - Contact information items
11. **contact-info-details** - Detailed contact info cards
12. **timeline** - Chronological timeline
13. **why-join** - Reasons to join
14. **values** - Company values
15. **content** - Generic flexible content

#### Commerce Sections
16. **pricing-plans** - Pricing plan options
17. **free-messages** - Free message count info
18. **message-bundles** - Message bundle pricing
19. **pricing-info** - Pricing information
20. **pricing-faq** - Pricing FAQs

#### CTA Sections
21. **app-download** - App download with platform links
22. **coming-soon** - Coming soon section

#### Special
23. **product-features** - Product features showcase

### Detailed Section Data Structures

#### Hero Section
```typescript
{
  title: string
  tagline?: string
  subtitle?: string
  cta: {
    text?: string
    buttonText?: string
    subtext?: string
    badge?: string
  }
  images: {
    women?: string[]  // Array of image paths
    men?: string[]    // Array of image paths
  }
}
```

#### Product Features Section
```typescript
{
  title: string
  subtitle?: string
  features: Array<{
    icon: string  // Icon name (Heart, Shield, Zap, etc.)
    title: string
    description: string
    highlights: string[]  // Array of bullet points
    image: string  // Image path
    color: string  // Background color (e.g., "bg-[#662D91]")
  }>
}
```

#### Gallery Section
```typescript
{
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
  images: Array<{
    image: string  // Image path
    alt?: string
    title?: string  // Couple name
    story?: string  // Couple story
  }>
  cta?: {
    text?: string
    highlight?: string
  }
}
```

#### Testimonials Section
```typescript
{
  title?: string
  subtitle?: string
  testimonials: Array<{
    name: string
    image: string  // Profile image path
    text: string
    location?: string
    rating?: number  // 1-5
    date?: string  // e.g., "Beta User"
  }>
}
```

#### How It Works Section
```typescript
{
  title?: string
  steps: Array<{
    step: string  // e.g., "01", "02"
    title: string
    description: string
    image?: string  // Screenshot path
  }>
}
```

#### Values Section
```typescript
{
  title?: string
  values: Array<{
    title: string
    description: string
    icon?: string
  }>
}
```

#### Pricing Plans Section
```typescript
{
  title?: string
  plans: Array<{
    name: string
    price: number
    billing_period: string  // "monthly" | "yearly"
    description?: string
    features: string[]  // Array of feature descriptions
    cta_text?: string
    popular?: boolean
    icon?: string
    image?: string
  }>
}
```

#### FAQ Category Section
```typescript
{
  title?: string
  subtitle?: string
  categories: Array<{
    name: string
    description?: string
    questions: Array<{
      question: string
      answer: string
    }>
  }>
}
```

#### Feature Category Section
```typescript
{
  title?: string
  subtitle?: string
  features: Array<{
    category_name: string
    category_description?: string
    features: Array<{
      title: string
      description: string
      icon: string
      image?: string
      highlights?: string[]
    }>
  }>
}
```

---

## CMS Styling & Design System

### Color Palette

#### Primary Colors
- **Primary Purple:** `#662D91` (HSL: 275 56% 38%)
  - Used for: Primary buttons, active states, links, brand elements
- **Primary Foreground:** `#FFFFFF` (white text on primary)

#### Background Colors

**Light Mode:**
- **Main Background:** `#FCFCFC` (very light gray)
- **Card Background:** `#FFFFFF` (white)
- **Sidebar Background:** `#FFFFFF` (white)
- **Menu Background:** `#FFFFFF` (white)

**Dark Mode:**
- **Main Background:** `#171717` (very dark gray, almost black)
- **Card Background:** `#171717` (same as main)
- **Sidebar Background:** `#171717` (same as main)
- **Menu Background:** `#1F1F1F` (slightly lighter than main)

#### Border Colors

**Light Mode:**
- **Border:** `#E5E7EB` (light gray, HSL: 240 5.9% 90%)
- **CMS Border:** `#E5E7EB`

**Dark Mode:**
- **Border:** `#2A2A2A` (dark gray, HSL: 240 3.7% 15.9%)
- **CMS Border:** `#2A2A2A`

#### Text Colors

**Light Mode:**
- **Primary Text:** `#0F172A` (very dark blue, HSL: 240 10% 3.9%)
- **Secondary Text:** `#6B7280` (medium gray, HSL: 240 3.8% 46.1%)
- **Tertiary Text:** `#9CA3AF` (light gray)

**Dark Mode:**
- **Primary Text:** `#FAFAFA` (almost white, HSL: 0 0% 98%)
- **Secondary Text:** `#A1A1AA` (light gray, HSL: 240 5% 64.9%)
- **Tertiary Text:** `#71717A` (medium gray)

#### Action Colors
- **Success/Green:** `#10b981` (for created/published actions)
- **Info/Blue:** `#3b82f6` (for updated actions)
- **Error/Red:** `#ef4444` (for deleted actions)
- **Warning/Orange:** `#f59e0b` (for unpublished actions)
- **Neutral/Gray:** `#898989` (for default states)

### Typography

#### Font Family
- **Primary Font:** `'Google Sans Flex', system-ui, sans-serif`
- **Font Weight:** 600 (semibold) for most UI elements
- **Font Rendering:** Antialiased, optimized for clarity

#### Font Sizes

**Headings:**
- **H1 (Page Title):** `24px` (1.5rem) - `font-semibold`
- **H2 (Card Title):** `18px` (1.125rem) - `font-semibold` (600 weight)
- **H3 (Section Title):** `16px` (1rem) - `font-semibold`

**Body Text:**
- **Primary Text:** `14px` (0.875rem)
- **Secondary Text:** `13px` (0.8125rem)
- **Small Text:** `12px` (0.75rem)
- **Extra Small:** `11px` (0.6875rem)
- **Tiny:** `10px` (0.625rem)

**Buttons:**
- **Button Text:** `13px` - `14px`
- **Font Weight:** `500` (medium) to `600` (semibold)

**Labels:**
- **Form Labels:** `13px` - `14px`
- **Font Weight:** `500` - `600`

### Spacing

#### Padding
- **Card Padding:** `16px` (1rem)
- **Card Header Padding:** `16px` (1rem) vertical, `16px` horizontal
- **Card Content Padding:** `16px` (1rem)
- **Dialog Padding:** `24px` (1.5rem)
- **Input Padding:** `10px` vertical, `12px` horizontal
- **Button Padding:** `10px` vertical, `20px` horizontal (h-10 px-5)

#### Margins
- **Section Spacing:** `24px` (1.5rem) - `32px` (2rem)
- **Card Gap:** `16px` (1rem)
- **Grid Gap:** `16px` (1rem)

#### Border Radius
- **Default Radius:** `8px` (0.5rem)
- **Card Radius:** `8px` (0.5rem)
- **Button Radius:** `8px` (0.5rem)
- **Input Radius:** `8px` (0.5rem)

### Component Sizes

#### Buttons
- **Height:** `40px` (h-10)
- **Small Height:** `36px` (h-9)
- **Padding:** `10px` vertical, `20px` horizontal
- **Font Size:** `13px` - `14px`
- **Font Weight:** `500` - `600`

#### Inputs
- **Height:** `40px` (h-10)
- **Padding:** `10px` vertical, `12px` horizontal
- **Font Size:** `14px`

#### Cards
- **Border:** `1px solid` (border color)
- **Background:** Card background color
- **Shadow:** Subtle shadow (if any)

#### Sidebar
- **Expanded Width:** `200px`
- **Collapsed Width:** `60px`
- **Height:** `100vh` (full viewport height)
- **Transition:** `300ms ease-in-out`

### CSS Classes

#### CMS-Specific Classes
- `.cms-text-primary` - Primary text color
- `.cms-text-secondary` - Secondary text color
- `.cms-text-tertiary` - Tertiary text color
- `.cms-card` - Card background
- `.cms-card-bg` - Card background color
- `.cms-border` - Border color
- `.cms-main-bg` - Main background color
- `.cms-sidebar-bg` - Sidebar background
- `.cms-sidebar-border` - Sidebar border
- `.cms-sidebar-button` - Sidebar button styling
- `.cms-menu-item-active` - Active menu item
- `.cms-menu-item-inactive` - Inactive menu item
- `.cms-menu-bg` - Menu background
- `.cms-menu-border` - Menu border

### Responsive Breakpoints

- **Mobile:** `< 640px` (sm)
- **Tablet:** `640px - 1024px` (md)
- **Desktop:** `> 1024px` (lg)
- **Large Desktop:** `> 1280px` (xl)

---

## Complete User Journey

### Journey 1: Creating a New Section

1. **Navigate to Pages** (`/add-content/pages`)
   - See grid of all pages
   - Click "Edit" on desired page

2. **Page Editor Opens** (`/add-content/pages/[slug]`)
   - See existing sections (if any)
   - Click "Add Section" button

3. **Section Editor Dialog Opens**
   - Select section type from dropdown
   - Form fields appear based on selected type
   - Fill in required fields:
     - Title, subtitle, content fields
     - Upload images if needed
     - Configure arrays (features, steps, etc.)
   - Set order index
   - Toggle published status
   - Click "Save"

4. **Section Created**
   - Dialog closes
   - Success toast appears
   - Page refreshes
   - New section appears in list
   - Can drag to reorder
   - Can click "Preview" to see how it looks
   - Can click "Edit" to modify
   - Can click "History" to see changes

### Journey 2: Editing Existing Section

1. **Navigate to Page** (`/add-content/pages/[slug]`)
2. **Find Section** in list
3. **Click "Edit"** button
4. **Section Editor Opens** with existing data
5. **Modify Fields** as needed
6. **Click "Save"**
7. **Changes Applied** - Section updates, history entry created

### Journey 3: Reordering Sections

1. **Navigate to Page** (`/add-content/pages/[slug]`)
2. **Drag Section** by grip icon (vertical dots on left)
3. **Drop in New Position**
4. **Order Updates Automatically**
5. **Success Toast** appears
6. **Page Refreshes** with new order

### Journey 4: Previewing Section

1. **Navigate to Page** (`/add-content/pages/[slug]`)
2. **Click "Preview"** button (eye icon) on section
3. **Preview Dialog Opens**
   - Shows section exactly as it appears on website
   - Responsive layout
   - Scrollable if content is long
   - Shows draft warning if unpublished
4. **Close Dialog** by clicking X or outside

### Journey 5: Rolling Back Section

1. **Navigate to Page** (`/add-content/pages/[slug]`)
2. **Click "History"** button (clock icon) on section
3. **History Dialog Opens**
   - Shows list of previous versions
   - Each entry shows timestamp and action
4. **Click "Restore"** on desired version
5. **Confirmation Dialog** appears
6. **Confirm Restore**
7. **Section Restored** to that version
8. **Success Toast** appears
9. **Page Refreshes** with restored content

### Journey 6: Publishing/Unpublishing Section

1. **Navigate to Page** (`/add-content/pages/[slug]`)
2. **Click "Edit"** on section
3. **Toggle "Published" Switch**
   - On = Published (visible on public site)
   - Off = Draft (only visible in CMS)
4. **Click "Save"**
5. **Status Updates**
   - Published badge appears/disappears
   - Section visibility changes on public site

### Journey 7: Editing Global Content (Navbar)

1. **Navigate to Global Content** (`/add-content/global`)
2. **Click "Edit"** on "Navigation Bar" card
3. **Editor Dialog Opens**
   - Logo upload section
   - Links list (sortable)
4. **Upload/Update Logo**
   - Click image upload field
   - Select image from media or upload new
   - Enter alt text
   - Set width/height
5. **Edit Links**
   - Use page selector to choose page
   - Enter link label
   - Drag to reorder
   - Delete unwanted links
   - Add new links
6. **Click "Save"**
7. **Navbar Updates** across entire website

### Journey 8: Managing Blog Posts

1. **Navigate to Blog** (`/add-content/blog`)
2. **See List of Posts**
   - Title, category, published status
   - Publish date
3. **Click "Create Post"** or "Edit" on existing
4. **Blog Editor Opens**
   - Title field
   - Slug field (auto-generated from title)
   - Content editor (rich text)
   - Excerpt field
   - Featured image upload
   - Category selector
   - Publish date picker
   - Published toggle
5. **Fill in Content**
6. **Click "Save"**
7. **Post Appears** in list and on blog page

---

## Technical Implementation Details

### Section Contract System

Each section type is backed by a **Section Contract** that defines:
- **Zod Schema** - Type-safe validation
- **Default Data** - Initial structure
- **Editor Component** - CMS editing interface
- **Renderer Component** - Frontend display
- **Metadata** - Label, description, icon, category

### Data Flow

1. **User Edits Section** in CMS
2. **Form Validates** using Zod schema
3. **Data Saves** to `sections` table (JSONB `content` field)
4. **Trigger Fires** - Logs to `content_history`
5. **Page Revalidates** - Next.js revalidates affected routes
6. **Public Site Updates** - New content appears

### Security

- **Authentication:** Supabase Auth
- **Authorization:** `assertAdmin()` function checks `admin_users` table
- **RLS Policies:** Row Level Security on all tables
- **Admin Check:** `is_admin()` PostgreSQL function
- **Defense in Depth:** Multiple layers of security

---

## Summary

This CMS provides a complete content management solution with:
- **12 Public Pages** + Global Content
- **23 Section Types** with contract-based architecture
- **Full CRUD Operations** for all content
- **Preview & Rollback** functionality
- **Drag-to-Reorder** sections
- **Publish/Unpublish** workflow
- **History Tracking** for all changes
- **Responsive Design** with dark/light themes
- **Type-Safe Validation** using Zod schemas
- **Database-Driven** - No hardcoded content

The system is designed for ease of use while maintaining type safety, security, and scalability.

