# qoupl Website

> **AI-Powered Dating Platform for College Students**

Official marketing website and landing page for qoupl, an AI-based dating application designed for college students aged 18-25.

## 🚀 Overview

This is the **public-facing website** for qoupl. It's a Next.js application that displays dynamic content managed through a separate CMS system. The website fetches all content (sections, blog posts, FAQs, etc.) from Supabase, allowing content updates without code deployments.

### Key Features

- **Dynamic Content Management**: All page content is stored in Supabase and rendered dynamically
- **Server-Side Rendering**: Built with Next.js App Router for optimal SEO and performance
- **Headless CMS Architecture**: Content is managed via a separate CMS repository
- **Real-time Updates**: Content changes in CMS instantly reflect on the website
- **Blog System**: Full-featured blog with categories, featured images, and SEO optimization
- **Waitlist System**: User registration and email collection
- **Contact Forms**: Integrated contact form with email notifications
- **Dark/Light Mode**: Theme switching with persistent user preferences
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🏗️ Architecture

### Content Flow

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────┐
│   CMS Repo      │────────▶│   Supabase   │◀────────│  Website    │
│  (Separate)     │  Writes │   Database   │  Reads  │  (This Repo)│
└─────────────────┘         └──────────────┘         └─────────────┘
```

1. **CMS Repository** (`qoupl-website-cms`): Admin interface for content management
2. **Supabase Database**: Stores all content (pages, sections, blog posts, FAQs, etc.)
3. **This Website**: Fetches and displays content from Supabase

### Database Tables

- `pages`: Page metadata (slug, title, published status)
- `sections`: Dynamic page sections/components with content
- `global_content`: Navbar, footer, and site-wide settings
- `blog_posts`: Blog articles with categories
- `blog_categories`: Blog category taxonomy
- `faqs`: Frequently asked questions
- `waitlist`: User waitlist registrations
- `contact_submissions`: Contact form submissions

## 🛠️ Technology Stack

### Core
- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5.9.3
- **React**: 19.2.0
- **Styling**: Tailwind CSS 3.4.18
- **UI Components**: Shadcn UI (Radix UI primitives)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (via `@supabase/ssr`)
- **Storage**: Supabase Storage (for images and media)
- **API Routes**: Next.js API routes

### Key Libraries
- `@supabase/ssr`: Server-side Supabase client
- `@supabase/supabase-js`: Supabase JavaScript client
- `framer-motion`: Animations
- `next-themes`: Theme management
- `react-hook-form` + `zod`: Form validation
- `date-fns`: Date formatting
- `@vercel/analytics`: Analytics
- `@vercel/speed-insights`: Performance monitoring

## 📁 Project Structure

```
qoupl-website/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── about/               # About page
│   ├── blog/                # Blog listing & posts
│   ├── careers/             # Careers page
│   ├── contact/             # Contact page
│   ├── faq/                 # FAQ page
│   ├── features/            # Features page
│   ├── pricing/             # Pricing page
│   ├── api/                 # API routes
│   │   ├── contact/         # Contact form handler
│   │   ├── waitlist/        # Waitlist registration
│   │   └── media/           # Media upload handler
│   └── ...
├── components/              # React components
│   ├── sections/            # Page section components
│   ├── ui/                  # Shadcn UI components
│   ├── navbar.tsx           # Navigation bar
│   ├── footer-client.tsx    # Footer component
│   └── ...
├── lib/                     # Utility libraries
│   ├── supabase/            # Supabase clients & helpers
│   │   ├── server.ts        # Server-side client
│   │   ├── client.ts        # Client-side client
│   │   ├── content.ts       # Content fetching functions
│   │   └── storage-url.ts   # Storage URL helpers
│   ├── components/          # Component registry
│   ├── validation/          # Zod schemas
│   └── utils.ts             # Utility functions
├── public/                   # Static assets
│   ├── images/              # Local images
│   └── ...
├── scripts/                 # Utility scripts
│   ├── migrate-content-to-supabase.ts
│   ├── seed-content.ts
│   └── ...
├── supabase/                # Supabase migrations
│   └── migrations/          # SQL migration files
├── middleware.ts            # Next.js middleware (auth)
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase project (shared with CMS)
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/qoupl-ai/qoupl-website.git
   cd qoupl-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Note**: These are the same values used in the CMS repository. The website only needs read access (anon key), while the CMS needs write access (service role key).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` |

### Optional

- `SUPABASE_SERVICE_ROLE_KEY`: Only needed if running admin scripts (not required for website to function)
- `VERCEL_ANALYTICS_ID`: Vercel Analytics (auto-configured)
- `VERCEL_SPEED_INSIGHTS_ID`: Speed Insights (auto-configured)

## 📝 Development Workflow

### Content Management

**Important**: Content is managed through the separate CMS repository, not this website repo.

1. **To update content**: Use the CMS at `qoupl-website-cms` repository
2. **Content changes**: Automatically reflect on the website (no deployment needed)
3. **Code changes**: Require deployment to update the website

### Adding New Pages

1. Create a new folder in `app/` (e.g., `app/new-page/`)
2. Add `page.tsx` that fetches sections:
   ```tsx
   import { getPageSections } from '@/lib/supabase/content'
   import { SectionsRenderer } from '@/lib/components/registry'
   
   export default async function NewPage() {
     const sections = await getPageSections('new-page-slug')
     return <SectionsRenderer sections={sections} />
   }
   ```
3. Create the page in CMS with matching slug
4. Add sections through CMS

### Adding New Section Types

1. Create component in `components/sections/`
2. Add to registry in `lib/components/registry.tsx`
3. Update validation schema in `lib/validation/section-schemas.ts`
4. Deploy website changes

### API Routes

- `/api/contact`: Handles contact form submissions (public, uses anon key)
- `/api/waitlist`: Handles waitlist registrations (public, uses anon key)

**Note**: Media uploads are handled by the CMS repository, not this website.

## 🗄️ Database Schema

### Key Tables

**pages**
- `id` (uuid)
- `slug` (text, unique)
- `title` (text)
- `published` (boolean)
- `created_at`, `updated_at`

**sections**
- `id` (uuid)
- `page_id` (uuid, foreign key)
- `component_type` (text) - e.g., 'hero', 'features', 'testimonials'
- `content` (jsonb) - Section-specific data
- `order_index` (integer)
- `published` (boolean)

**blog_posts**
- `id` (uuid)
- `title`, `slug`, `excerpt`, `content`
- `featured_image` (text)
- `category_id` (uuid)
- `published` (boolean)
- `publish_date` (timestamp)

**global_content**
- `key` (text, unique) - e.g., 'navbar', 'footer'
- `content` (jsonb) - Content data

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy**: Vercel auto-deploys on push to main branch

### Build Commands

- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Start Production**: `npm start`

## 🔗 Related Repositories

- **CMS Repository**: [qoupl-website-cms](https://github.com/qoupl-ai/qoupl-website-cms)
  - Separate repository for content management
  - Admin interface for editing website content
  - Deployed separately on Vercel

## 📚 Key Concepts

### Server Components vs Client Components

- **Server Components** (default): Fetch data, render on server
- **Client Components** (`'use client'`): Interactive UI, browser-only

### Content Fetching

All content is fetched server-side using:
- `getPageSections(slug)`: Get sections for a page
- `getGlobalContent(key)`: Get global content (navbar, footer)
- Direct Supabase queries for blog posts, FAQs, etc.

### Image Handling

- **Supabase Storage**: Images stored in Supabase Storage buckets
- **URL Generation**: `getStorageUrl(bucket, path)` helper function
- **Next.js Image**: Optimized image component with remote patterns configured

## 🐛 Troubleshooting

### Content Not Showing

1. Check if page exists in Supabase `pages` table
2. Verify sections are `published = true`
3. Check browser console for errors
4. Verify environment variables are set correctly

### Images Not Loading

1. Check Supabase Storage bucket exists
2. Verify image paths in database
3. Check `next.config.js` remote patterns
4. Ensure storage bucket is public

### Build Errors

1. Run `npm install` to ensure dependencies are up to date
2. Check TypeScript errors: `npm run build`
3. Verify all environment variables are set

## 📄 License

Private repository - All rights reserved

## 👥 Contributing

This is a private repository. For content updates, use the CMS repository.

---

**Built with ❤️ for qoupl**

