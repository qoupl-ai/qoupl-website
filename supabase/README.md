# Supabase Setup Guide for qoupl Website

This guide will help you set up Supabase for the qoupl website CMS.

## Prerequisites

- Supabase account ([sign up at supabase.com](https://supabase.com))
- Node.js 18+ and npm installed
- Git repository cloned locally

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: qoupl-website
   - **Database Password**: (choose a strong password and save it)
   - **Region**: Choose closest to your users (India region if available)
4. Click "Create new project"
5. Wait for project provisioning (~2 minutes)

## Step 2: Get API Keys

1. Once project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys" → anon/public)
   - **Service Role Key** (under "Project API keys" → service_role) ⚠️ **KEEP SECRET**

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Next.js Configuration
NODE_ENV=development
```

3. Replace the placeholders with your actual values from Step 2
4. **IMPORTANT**: Never commit `.env.local` to Git (already in `.gitignore`)

## Step 4: Run Database Migration

### Option A: Using Supabase Dashboard (Recommended for First-Time Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** button (or press Ctrl/Cmd + Enter)
7. Wait for execution to complete
8. Verify in **Table Editor** that all tables were created

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

## Step 5: Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see the following tables:
   - ✅ admin_users
   - ✅ pages (with 12 pre-seeded pages)
   - ✅ sections
   - ✅ global_content (with 3 pre-seeded entries)
   - ✅ blog_categories (with 5 categories)
   - ✅ blog_posts
   - ✅ faq_categories (with 8 categories)
   - ✅ faqs
   - ✅ feature_categories (with 4 categories)
   - ✅ features
   - ✅ pricing_plans
   - ✅ media
   - ✅ waitlist_signups
   - ✅ contact_submissions
   - ✅ content_history

## Step 6: Set Up Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create the following buckets:

### Bucket 1: hero-images
- **Name**: hero-images
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

### Bucket 2: couple-photos
- **Name**: couple-photos
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

### Bucket 3: app-screenshots
- **Name**: app-screenshots
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: image/jpeg, image/png

### Bucket 4: blog-images
- **Name**: blog-images
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

### Bucket 5: user-uploads
- **Name**: user-uploads
- **Public**: ❌ No (authenticated users only)
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp, image/gif

## Step 7: Set Up Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings:
   - **Enable email confirmations**: ❌ Disable (for development)
   - **Enable email confirmations**: ✅ Enable (for production)

### Create First Admin User

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Fill in:
   - **Email**: your-admin@email.com
   - **Password**: (choose a strong password)
   - **Auto Confirm User**: ✅ Yes (for development)
4. Click **Create user**
5. Copy the **User UID** (you'll need this for the next step)

### Add Admin Permission

1. Go to **Table Editor** → **admin_users**
2. Click **Insert** → **Insert row**
3. Fill in:
   - **user_id**: (paste the User UID from previous step)
   - **email**: (same email as above)
   - **name**: Your Name
   - **is_active**: true
4. Click **Save**

## Step 8: Test the Connection

Run the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- ✅ Site loads without errors
- ✅ No Supabase connection errors in console
- ✅ Forms are working (waitlist, contact)

## Step 9: Test CMS Access

1. Visit `http://localhost:3000/add-content`
2. You should be redirected to `/login`
3. Log in with your admin credentials
4. You should be redirected back to CMS dashboard
5. Verify you can see content management interface

## Database Schema Overview

### Content Tables
- **pages**: Main website pages (12 pages pre-seeded)
- **sections**: Page components/sections with flexible JSONB config
- **global_content**: Site-wide content (navbar, footer, contact info)

### Blog System
- **blog_categories**: Blog post categories
- **blog_posts**: Blog articles with markdown/HTML content

### FAQ System
- **faq_categories**: FAQ categories (8 pre-seeded)
- **faqs**: FAQ question/answer pairs

### Features & Pricing
- **feature_categories**: Feature groups (4 pre-seeded)
- **features**: Individual feature items
- **pricing_plans**: Subscription and bundle pricing

### Media & Forms
- **media**: Media library for all uploaded files
- **waitlist_signups**: Waitlist form submissions
- **contact_submissions**: Contact form submissions

### Admin & Audit
- **admin_users**: CMS admin users
- **content_history**: Audit trail for all content changes

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Access (Read-Only)
- ✅ Published pages, sections, blog posts
- ✅ Published FAQs, features, pricing
- ✅ Global content
- ✅ Media files

### Authenticated Admin Access
- ✅ Full CRUD on all content tables
- ✅ View waitlist signups
- ✅ Manage contact submissions
- ✅ View content history

### Anonymous Access
- ✅ Submit waitlist form
- ✅ Submit contact form

## Storage Policies

### Public Buckets (Read by Anyone)
- hero-images
- couple-photos
- app-screenshots
- blog-images

### Authenticated Buckets
- user-uploads (admins only)

## Useful SQL Queries

### Check Total Content Count
```sql
SELECT 'pages' as table_name, COUNT(*) FROM pages
UNION ALL
SELECT 'sections', COUNT(*) FROM sections
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'faqs', COUNT(*) FROM faqs
UNION ALL
SELECT 'features', COUNT(*) FROM features;
```

### View Recent Content History
```sql
SELECT
  entity_type,
  action,
  performed_at,
  (SELECT email FROM auth.users WHERE id = performed_by) as admin_email
FROM content_history
ORDER BY performed_at DESC
LIMIT 20;
```

### Check Waitlist Count
```sql
SELECT COUNT(*) as total_signups FROM waitlist_signups;
```

## Troubleshooting

### Error: "Failed to fetch"
- Verify environment variables are set correctly
- Check Supabase project is running (not paused)
- Verify API keys match your project

### Error: "Invalid API key"
- Double-check anon key and service role key
- Make sure no extra spaces in `.env.local`
- Restart Next.js dev server after changing env vars

### Tables not created
- Re-run the migration SQL in Supabase dashboard
- Check for SQL errors in query results
- Verify you have proper permissions

### RLS blocking access
- Verify user is authenticated
- Check admin_users table has entry for your user
- Review RLS policies in Table Editor

### Storage upload fails
- Verify bucket exists and is public
- Check file size limits
- Verify MIME type is allowed

## Next Steps

1. ✅ Database schema created
2. ✅ Storage buckets configured
3. ✅ Admin user created
4. ⏳ Migrate existing images to Supabase Storage
5. ⏳ Build CMS interface at `/add-content`
6. ⏳ Seed initial content (FAQs, blog posts, features)
7. ⏳ Refactor website to fetch from Supabase

## Support

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Next.js + Supabase: [https://supabase.com/docs/guides/getting-started/quickstarts/nextjs](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Security Checklist

- [ ] Service role key is in `.env.local` (not committed to Git)
- [ ] RLS is enabled on all tables
- [ ] Admin user is created and verified
- [ ] Email confirmations enabled in production
- [ ] Storage buckets have proper access policies
- [ ] Rate limiting enabled on public forms (future)

---

**Created**: December 24, 2025
**Last Updated**: December 24, 2025
