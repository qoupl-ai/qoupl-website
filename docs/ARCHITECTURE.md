# qoupl Website Architecture

**Last Updated:** 2025-01-XX  
**Status:** Production  
**Version:** 2.0

## Overview

The qoupl website is a Next.js 16 application with a Supabase-powered CMS. The architecture follows a **canonical pages + sections model** where all page content is stored in the database and rendered dynamically.

## Core Principles

1. **Single Source of Truth:** All content lives in Supabase
2. **Type Safety:** TypeScript + Zod schemas for all CMS data
3. **Contract-Driven:** Section contracts define schema, validation, and rendering
4. **Server-First:** Public pages are server-rendered, CMS is client-side
5. **Defense-in-Depth:** Multiple layers of authorization (app + database)

## Database Architecture

### Canonical Tables

#### `pages`
- **Purpose:** Main website pages (home, about, pricing, etc.)
- **Key Fields:** `slug`, `title`, `description`, `published`
- **Usage:** One page = one route, multiple sections

#### `sections`
- **Purpose:** Page components/blocks with flexible JSONB content
- **Key Fields:** `page_id`, `section_type`, `order_index`, `content` (JSONB), `published`
- **Usage:** All page content (hero, features, FAQs, pricing, etc.) stored here
- **Types:** Defined in `contracts/` directory

#### `media`
- **Purpose:** Media library (images, files)
- **Key Fields:** `filename`, `storage_path`, `bucket_name`, `category`
- **Storage:** Supabase Storage buckets

#### `content_history`
- **Purpose:** Audit trail for all content changes
- **Key Fields:** `entity_type`, `entity_id`, `action`, `snapshot`, `performed_by`
- **Usage:** Rollback functionality, change tracking

### Content Management Tables

#### `blog_posts`
- **Purpose:** Blog articles
- **Status:** Active (separate from sections)
- **Usage:** Blog-specific content management

#### `blog_categories`
- **Purpose:** Blog post categorization
- **Status:** Active

#### `admin_users`
- **Purpose:** CMS admin access control
- **Key Fields:** `user_id`, `email`, `is_active`
- **Usage:** Authorization via `assertAdmin()`

#### `waitlist_signups`
- **Purpose:** User waitlist registrations
- **Status:** Active

#### `contact_submissions`
- **Purpose:** Contact form submissions
- **Status:** Active

### Deprecated Tables (Marked for Removal)

These tables are marked as redundant and should be dropped after verification:

- `faqs` + `faq_categories` → Migrated to `sections` (type: `faq-category`)
- `features` + `feature_categories` → Migrated to `sections` (type: `feature-category`)
- `pricing_plans` → Migrated to `sections` (type: `pricing-plans`)
- `global_content` → Migrated to `sections` on `__global__` page

**⚠️ WARNING:** Only drop these tables after:
1. Migration 008 has been executed
2. Data verified in sections table
3. Application tested and working

## Application Architecture

### Directory Structure

```
app/
  ├── (public routes)          # Server-rendered public pages
  │   ├── page.tsx             # Homepage
  │   ├── faq/page.tsx
  │   ├── pricing/page.tsx
  │   └── blog/[slug]/page.tsx
  │
  └── add-content/             # CMS admin interface
      ├── layout.tsx           # Admin auth check
      ├── pages/[slug]/page.tsx # Page editor
      └── history/page.tsx     # Content history

components/
  ├── sections/                # Section renderers (public)
  ├── cms/                     # CMS admin components
  │   ├── section-editor/      # Unified section editor
  │   ├── blog-dialog.tsx      # Blog post editor
  │   ├── faq-dialog.tsx       # FAQ editor
  │   └── ...
  └── ui/                      # shadcn/ui components

contracts/                     # Section contracts (schema + metadata)
lib/
  ├── supabase/               # Supabase clients
  ├── components/             # Component registry
  └── validation/             # Zod schemas

scripts/                       # One-time migrations & utilities
supabase/
  └── migrations/             # Database migrations
```

### CMS Model

#### Section Contracts
- **Location:** `contracts/*.tsx`
- **Purpose:** Define section type schema, validation, rendering, and metadata
- **Structure:**
  ```typescript
  {
    type: 'section-type',
    schema: ZodSchema,
    defaultData: {...},
    renderer: Component,
    editor: Component,
    metadata: { label, description, category }
  }
  ```

#### Section Editor
- **Location:** `components/cms/section-editor/`
- **Purpose:** Contract-driven visual editor for sections
- **Features:**
  - Schema-based form generation
  - Preview capability
  - Rollback from history
  - Type-safe validation

#### Content Management
- **Blog Posts:** `app/add-content/blog/` - Dedicated blog editor
- **FAQs:** `app/add-content/faqs/` - FAQ management
- **Features:** `app/add-content/features/` - Feature management
- **Pricing:** `app/add-content/pricing/` - Pricing plan editor
- **Pages:** `app/add-content/pages/[slug]/` - Page section editor

### Rendering Flow

#### Public Pages
1. Server component fetches sections via `getPageSections(slug)`
2. `SectionsRenderer` maps sections to components via contracts
3. Components render with data from `section.content`

#### CMS Pages
1. Layout checks admin access via `assertAdmin()`
2. Page component fetches ALL sections (published + drafts)
3. `SortableSectionsList` displays sections with drag-and-drop
4. Section editor uses contracts for form generation

### Security Architecture

#### Authorization Layers
1. **Application Layer:** `assertAdmin()` in all server actions/pages
2. **Database Layer:** RLS policies using `is_admin()` function
3. **Network Layer:** Service role key only in scripts

#### Admin Client Usage
- **✅ Approved:** Scripts only (`scripts/*.ts`)
- **❌ Forbidden:** Server actions, API routes, page components
- **Pattern:** Use `assertAdmin()` + regular client (RLS enforces)

See `docs/SECURITY.md` for detailed security documentation.

## Data Flow

### Content Creation
```
Editor → Server Action → assertAdmin() → Supabase (RLS) → Database
```

### Content Rendering
```
Page → getPageSections() → Sections → Contracts → Renderers → HTML
```

### Content History
```
Update → Trigger → content_history → Rollback Available
```

## Key Technologies

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth + custom admin_users table
- **Validation:** Zod
- **UI:** shadcn/ui + Tailwind CSS
- **Forms:** react-hook-form
- **Drag & Drop:** @dnd-kit

## Migration Status

### Completed
- ✅ Initial schema creation
- ✅ RLS policies with admin_users check
- ✅ Section type migration (component_type → section_type)
- ✅ Content migration to sections
- ✅ Image migration to Supabase Storage

### Pending
- ⏳ Drop redundant tables (after verification)
- ⏳ Remove legacy migration scripts

## Scripts Reference

### Setup Scripts (Keep)
- `setup-storage.ts` - Create storage buckets
- `create-tables.ts` - Initial schema (reference)

### Migration Scripts (One-Time, Can Remove After Migration)
- `migrate-all-content-to-sections.ts` - ✅ Complete
- `migrate-legacy-to-sections.ts` - ✅ Complete
- `migrate-all-pages-content.ts` - ✅ Complete
- `migrate-all-content-pages.ts` - ✅ Complete
- `migrate-all-images-to-storage.ts` - ✅ Complete
- `apply-migration-and-populate.ts` - ✅ Complete
- `run-migration-007.ts` - ✅ Complete

### Utility Scripts (Keep)
- `add-admin-user.ts` - Admin management
- `list-admins.ts` - Admin listing
- `check-admin-status.ts` - Admin verification
- `check-storage-buckets.ts` - Storage verification
- `debug-sections.ts` - Debugging tool

## Best Practices

1. **Always use `assertAdmin()`** for authorization
2. **Use regular client** after `assertAdmin()` (RLS enforces)
3. **Follow contract system** for new section types
4. **Server-render** public pages
5. **Type everything** with TypeScript + Zod
6. **Document changes** in migrations

## Future Considerations

- Consider consolidating blog_posts into sections (if needed)
- Evaluate need for separate content management tables
- Monitor RLS policy performance
- Consider caching strategy for public pages

---

**Note:** This document is the source of truth for architecture decisions. Update when making significant changes.

