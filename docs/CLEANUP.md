# Codebase Cleanup Guide

This document tracks deprecated files and scripts that can be safely removed.

## ✅ Completed Cleanup

### Deprecated Files Removed
- `components/cms/section-editor.tsx.old` - Old monolithic editor (replaced by contract-driven editor)

## 🗑️ Safe to Remove (One-Time Migrations)

These scripts were used for one-time migrations and are no longer needed:

### Migration Scripts
- `scripts/migrate-all-content-to-sections.ts` - ✅ Migration complete
- `scripts/migrate-legacy-to-sections.ts` - ✅ Migration complete
- `scripts/migrate-all-pages-content.ts` - ✅ Migration complete
- `scripts/migrate-all-content-pages.ts` - ✅ Migration complete
- `scripts/migrate-content-to-supabase.ts` - ✅ Migration complete
- `scripts/migrate-all-images-to-storage.ts` - ✅ Migration complete
- `scripts/apply-migration-and-populate.ts` - ✅ Migration complete
- `scripts/apply-section-type-migration.ts` - ✅ Migration complete
- `scripts/run-migration-007.ts` - ✅ Migration complete
- `scripts/populate-content-pages.ts` - ✅ Migration complete
- `scripts/populate-legal-content.ts` - ✅ Migration complete

### Fix Scripts (One-Time Fixes)
- `scripts/fix-jsx-syntax.ts` - ✅ Fix complete
- `scripts/fix-remaining-screenshots.ts` - ✅ Fix complete
- `scripts/fix-hero-image-paths.ts` - ✅ Fix complete
- `scripts/fix-admin-user-id.ts` - ✅ Fix complete
- `scripts/fix-all-image-paths.ts` - ✅ Fix complete
- `scripts/fix-all-images-comprehensive.ts` - ✅ Fix complete

### Ensure Scripts (One-Time Setup)
- `scripts/ensure-section-type-column.ts` - ✅ Setup complete
- `scripts/ensure-home-page.ts` - ✅ Setup complete
- `scripts/ensure-all-pages.ts` - ✅ Setup complete

### Cleanup Scripts
- `scripts/cleanup-legacy-code.ts` - Utility script (can keep for reference or remove)

## 📦 Keep (Ongoing Utilities)

These scripts are useful for ongoing operations:

- `scripts/setup-storage.ts` - Create storage buckets (new deployments)
- `scripts/upload-images.ts` - Upload images to storage
- `scripts/create-tables.ts` - Reference for schema
- `scripts/add-admin-user.ts` - Admin management
- `scripts/list-admins.ts` - Admin listing
- `scripts/check-admin-status.ts` - Admin verification
- `scripts/check-storage-buckets.ts` - Storage verification
- `scripts/debug-sections.ts` - Debugging tool
- `scripts/seed-content.ts` - Content seeding (new deployments)
- `scripts/seed-pricing-sections.ts` - Pricing seeding
- `scripts/seed-contact-sections.ts` - Contact seeding
- `scripts/list-all-storage-files.ts` - Storage utility
- `scripts/check-blog-page.ts` - Blog verification
- `scripts/check-content-structure.ts` - Content verification
- `scripts/check-safety-community.ts` - Content verification
- `scripts/test-page-query.ts` - Testing utility
- `scripts/update-blog-images.ts` - Blog image updates
- `scripts/replace-local-image-references.ts` - Image reference updates
- `scripts/remove-local-images.ts` - Image cleanup

## 🗄️ Database Tables Status

### Active Tables (Keep)
- `pages` - Canonical CMS table
- `sections` - Canonical CMS table
- `media` - Canonical CMS table
- `content_history` - Canonical CMS table
- `blog_posts` - Active content management
- `blog_categories` - Active content management
- `admin_users` - Authorization
- `waitlist_signups` - Active feature
- `contact_submissions` - Active feature

### Deprecated Tables (Drop After Verification)
⚠️ **Only drop after verifying migration 008 completed and data is in sections table**

- `faqs` + `faq_categories` → Migrated to `sections` (type: `faq-category`)
- `features` + `feature_categories` → Migrated to `sections` (type: `feature-category`)
- `pricing_plans` → Migrated to `sections` (type: `pricing-plans`)
- `global_content` → Migrated to `sections` on `__global__` page

**Migration:** Run `supabase/migrations/009_drop_redundant_tables.sql` after verification

## 📝 Package.json Scripts to Remove

After removing the scripts above, also remove these from `package.json`:

```json
"migrate:content": "...",
"migrate:legacy": "...",
"migrate:pages": "...",
"migrate:content-pages": "...",
"populate:content": "...",
"populate:legal": "...",
"migrate:images": "...",
"replace:images": "...",
"remove:local-images": "...",
"migrate:all-content": "...",
"verify:section-type": "...",
"migrate:section-type": "...",
"setup:content": "...",
"cleanup:legacy": "..."
```

## 🎯 Cleanup Checklist

- [x] Delete `section-editor.tsx.old`
- [ ] Remove one-time migration scripts (listed above)
- [ ] Remove one-time fix scripts (listed above)
- [ ] Remove one-time ensure scripts (listed above)
- [ ] Update `package.json` to remove unused script commands
- [x] Create architecture documentation
- [ ] Verify redundant tables can be dropped
- [ ] Run migration 009 to drop redundant tables (after verification)

## ⚠️ Warnings

1. **Do not delete** active CMS components (blog-dialog, faq-dialog, etc.) - they are still in use
2. **Do not drop** database tables until migration is verified
3. **Keep** setup scripts for new deployments
4. **Keep** utility scripts for ongoing operations

