# qoupl Website - Technical Documentation

## Executive Summary

This repository contains the marketing website and waitlist management system for **qoupl**, an AI-powered dating platform targeting users aged 18-25. The website serves as the primary customer acquisition channel while the mobile applications are in development.

## Business Context

### Company
**Xencus Technologies Private Limited** - Parent company of qoupl

### Product
**qoupl** (pronounced "couple") - An intelligent dating platform that uses AI algorithms to match users based on:
- Personality compatibility
- Shared interests and values
- Lifestyle preferences
- Location proximity
- Behavioral patterns

### Target Market
- **Age Range**: 18-25 years (strictly enforced)
- **Geographic Focus**: India (initial launch), Global expansion planned
- **Platform**: iOS & Android mobile apps (in development)

### Current Status
- **Phase**: Pre-launch / Waitlist building
- **Website**: Live and collecting waitlist signups
- **Mobile Apps**: In active development
- **Backend**: Architecture defined, implementation in progress

## Technical Architecture

### Frontend Stack

#### Core Framework
- **Next.js 16.0.3** with App Router
  - Server-side rendering (SSR) for SEO
  - Static site generation (SSG) for performance
  - Edge runtime support for global distribution
  - Turbopack for fast development builds

- **React 19.2.0**
  - Latest features including Server Components
  - Optimized rendering performance
  - Suspense boundaries for progressive loading

#### Styling & UI
- **Tailwind CSS 3.4.18**
  - Utility-first approach
  - Custom purple theme configuration
  - Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
  - Dark mode via CSS variables

- **Shadcn UI**
  - Accessible components built on Radix UI
  - Customizable with Tailwind
  - Components: Button, Card, Dialog (future: Form, Select, etc.)

- **Framer Motion 12.23.24**
  - Page transitions
  - Scroll-triggered animations
  - Gesture recognition
  - Optimized performance with GPU acceleration

#### Typography
- **Poppins**: Headlines and UI elements (300-800 weights)
- **DM Sans**: Body text and forms (400-700 weights)
- Loaded via Next.js font optimization for performance

### Backend Integration (Planned)

#### Supabase Architecture
```
Database (PostgreSQL)
├── users table
│   ├── id (uuid, primary key)
│   ├── email (unique)
│   ├── full_name
│   ├── phone
│   ├── age (check constraint: 18-25)
│   ├── gender
│   ├── looking_for
│   ├── created_at
│   └── waitlist_status
│
├── waitlist_analytics
│   ├── signups_by_date
│   ├── demographics
│   └── source_tracking
│
└── user_preferences (future)
    └── ai_matching_data
```

#### API Endpoints (Planned)
```
POST /api/waitlist/join
  - Body: { name, email, phone, age, gender, lookingFor }
  - Validates age 18-25
  - Returns: { success, message, userId }

GET /api/waitlist/stats (Admin)
  - Returns: { totalSignups, demographics, growthRate }

POST /api/waitlist/verify-email
  - Body: { email, token }
  - Returns: { verified: true }
```

## Feature Breakdown

### 1. Splash Screen Animation
**File**: `components/splash-screen.tsx`

**Purpose**: Brand introduction with memorable first impression

**Technical Details**:
- Logo fills with purple color from bottom to top (liquid effect)
- Desktop (≥1024px): Shows crossfade animation of men/women images
- Mobile/Tablet (<1024px): Clean logo animation only (performance optimization)
- CSS clip-path for smooth fill animation
- Duration: ~3 seconds
- Framer Motion exit animation when complete

**Design Decisions**:
- Responsive: Images hidden on mobile to reduce data usage and improve load time
- Accessibility: Respects prefers-reduced-motion
- Performance: Priority images, optimized SVG logo

### 2. Hero Section
**File**: `components/sections/animated-hero.tsx`

**Features**:
- Glassmorphism effect with animated gradient orbs
- Responsive typography scaling
- Call-to-action buttons
- Social proof indicators (10,000+ waitlist count)
- Theme toggle (visible until scroll)

**Animations**:
- Gradient orbs: Radial gradients with position/scale animations
- Floating hearts: Random trajectories for romantic effect
- Text: Staggered fade-in with delay
- Interactive: Mouse parallax effect (desktop only)

### 3. How It Works Section
**File**: `components/sections/how-it-works.tsx`

**User Journey**:
1. Create Profile - Onboarding flow
2. AI Matching - Algorithm explanation
3. Start Conversations - Ice breakers
4. Plan Dates - Integrated suggestions
5. Find Love - Success stories

**Technical Features**:
- Phone mockup component with realistic iOS notch
- Screenshot integration from `/public/qoupl/` folder
- Scroll-triggered parallax effects
- Alternating left/right layout for visual interest

### 4. Product Features
**File**: `components/sections/product-features.tsx`

**Cards**:
- Smart AI Matching (Heart icon, pink gradient)
- Safe & Verified (Shield icon, purple gradient)
- Instant Connections (Zap icon, violet gradient)

**UX Details**:
- Hover effects: Scale up, increase brightness
- Background images with gradient overlays
- Feature highlights with animated checkmarks
- Responsive: Stack on mobile, grid on desktop

### 5. Gallery & Testimonials
**Files**: `components/sections/gallery.tsx`, `components/sections/testimonials.tsx`

**Purpose**: Social proof and authenticity

**Images**:
- Real couples (from `/public/images/coupl/`)
- Beta user portraits (from `/public/images/men/` and `/public/images/women/`)

**Animations**:
- Parallax scroll effects
- Hover: Scale, brightness, heart icon appearance
- Testimonials: Instagram story-style cards

### 6. Waitlist Modal
**File**: `components/waitlist-modal.tsx`

**Form Fields**:
- Full Name (required)
- Email (required, validated)
- Phone (required, format: +91 XXXXX XXXXX)
- Gender (required: Male/Female/Other)
- Age (required, range: 18-25 only)
- Looking For (required: Male/Female/Both)

**Validation**:
```typescript
// Age restriction enforced
if (age < 18 || age > 25) {
  setError('Sorry! qoupl is only available for ages 18-25');
  return;
}
```

**UX Flow**:
1. User clicks "Join Waitlist" button
2. Modal opens with slide-up animation
3. Form fills in with inline validation
4. Submit button shows loading state
5. Success screen with animated heart icon
6. Auto-closes after 5 seconds

**Responsive**:
- Mobile: Full-screen modal with scrollable content
- Desktop: Centered dialog with max-width
- Gradient header with rounded corners
- Icons scale based on screen size

### 7. Footer & Navigation
**Files**: `components/sections/footer.tsx`, `components/navbar.tsx`

**Footer Links**:
- Product: Features, Pricing, FAQ, Waitlist
- Company: About, Blog, Careers, Contact
- Legal: Privacy, Terms, Community Guidelines, Safety

**Navbar**:
- Logo (links to home)
- Theme toggle
- Appears on scroll (sticky, backdrop blur)
- Mobile responsive

## Design System

### Color Palette

#### Light Mode
```css
--background: 0 0% 100%;        /* White */
--foreground: 240 10% 3.9%;     /* Near black */
--primary: 271 91% 65%;         /* Purple #a855f7 */
--primary-foreground: 0 0% 100%; /* White text */
--muted: 240 4.8% 95.9%;        /* Light gray */
--border: 240 5.9% 90%;         /* Light border */
```

#### Dark Mode
```css
--background: 240 10% 3.9%;      /* Dark gray */
--foreground: 0 0% 98%;          /* Off-white */
--primary: 271 91% 65%;          /* Purple (same) */
--muted: 240 3.7% 15.9%;         /* Dark muted */
--border: 240 3.7% 15.9%;        /* Dark border */
```

### Component Patterns

#### Button Styles
```typescript
// Primary CTA
className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white"

// Secondary
className="border-2 border-primary text-primary hover:bg-primary/10"

// Size variants
size="lg" // py-6 px-8 text-lg
size="default" // py-3 px-6 text-base
size="sm" // py-2 px-4 text-sm
```

#### Card Styles
```typescript
// Feature card
className="rounded-3xl shadow-xl border border-white/10 overflow-hidden"

// Testimonial card
className="rounded-3xl shadow-2xl overflow-hidden h-[500px]"
```

### Animation Principles

1. **Duration**: 0.3-0.8s for most transitions
2. **Easing**: Custom cubic-bezier for spring effects
3. **Delay**: Staggered by 0.1-0.2s for sequential elements
4. **Performance**: GPU-accelerated (transform, opacity only)
5. **Accessibility**: Respects `prefers-reduced-motion`

## Performance Optimization

### Image Optimization
- Next.js Image component with automatic optimization
- Responsive sizes based on viewport
- Priority loading for above-the-fold images
- WebP format with fallbacks

### Code Splitting
- Route-based splitting (automatic via App Router)
- Dynamic imports for heavy components
- Lazy loading for below-the-fold content

### Caching Strategy
- Static pages: ISR (Incremental Static Regeneration)
- API routes: SWR (Stale-While-Revalidate)
- Images: CDN caching via Vercel Edge Network

### Bundle Size
```
Total bundle: ~250KB (gzipped)
├── Next.js runtime: ~80KB
├── React: ~45KB
├── Framer Motion: ~55KB
├── App code: ~70KB
└── Tailwind CSS: 15KB (purged)
```

## SEO Strategy

### Meta Tags (implemented)
```typescript
export const metadata: Metadata = {
  title: "qoupl - Find Your Perfect Match",
  description: "AI-powered dating app. Coming soon to iOS and Android.",
  // TODO: Add Open Graph, Twitter cards, favicon
};
```

### Future Improvements
- [ ] Structured data (JSON-LD) for rich snippets
- [ ] Dynamic meta tags per page
- [ ] XML sitemap
- [ ] robots.txt configuration
- [ ] Canonical URLs
- [ ] Social media preview images

## Deployment

### Vercel Configuration
**File**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]  // Washington DC (initial)
}
```

### Environment Variables
```bash
# Development (.env.local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-key

# Production (Vercel)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-key
```

### CI/CD Pipeline
1. **Commit** → GitHub main branch
2. **Trigger** → Vercel auto-deployment
3. **Build** → Next.js production build
4. **Deploy** → Edge network distribution
5. **Notify** → Slack/Discord webhook

## Development Workflow

### Branch Strategy
```
main           (production)
├── develop    (staging)
├── feature/*  (new features)
├── bugfix/*   (bug fixes)
└── hotfix/*   (urgent production fixes)
```

### Commit Convention
```
feat: Add waitlist export functionality
fix: Resolve mobile menu overflow issue
docs: Update README with API endpoints
style: Format code with Prettier
refactor: Simplify hero animation logic
perf: Optimize image loading
test: Add waitlist form validation tests
chore: Update dependencies
```

### Code Quality
- **ESLint**: Enforced on pre-commit (Husky planned)
- **Prettier**: Auto-format on save
- **TypeScript**: Strict mode enabled
- **Testing**: Vitest + React Testing Library (planned)

## Roadmap

### Phase 1: Pre-Launch (Current)
- [x] Landing page with all sections
- [x] Waitlist form (frontend)
- [x] Responsive design
- [x] Dark mode
- [ ] Supabase integration
- [ ] Email confirmation
- [ ] Analytics tracking

### Phase 2: Launch Preparation
- [ ] Blog/Press section
- [ ] Admin dashboard for waitlist
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] A/B testing setup

### Phase 3: Post-Launch
- [ ] User onboarding portal
- [ ] Account management
- [ ] Subscription/payment pages
- [ ] Help center/Knowledge base
- [ ] Community features

## Known Issues & Limitations

### Current Limitations
1. **Waitlist**: Data not persisted (Supabase integration pending)
2. **Email**: No confirmation emails sent yet
3. **Analytics**: No tracking implemented
4. **Testing**: No automated tests written
5. **Accessibility**: Not fully WCAG 2.1 compliant

### Browser Support
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari 15+
- ⚠️ IE11 not supported

## Team & Contacts

### Development Team
- **Technical Lead**: [Name]
- **Frontend**: [Names]
- **Backend/AI**: [Names]
- **Design**: [Names]

### Key Stakeholders
- **Product Owner**: [Name]
- **CEO**: [Name]
- **CTO**: [Name]

### Communication Channels
- **Slack**: #qoupl-dev, #qoupl-general
- **Notion**: Project wiki and sprint planning
- **Figma**: Design files and prototypes
- **GitHub**: Code reviews and discussions

## Resources

### Internal
- **Figma Designs**: [Link to Figma workspace]
- **Notion Docs**: [Link to Notion]
- **API Documentation**: [Link when available]
- **Brand Guidelines**: [Link to brand assets]

### External
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Docs](https://supabase.com/docs)

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Maintained by**: qoupl Development Team
