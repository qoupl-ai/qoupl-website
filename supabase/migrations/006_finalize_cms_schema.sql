-- ============================================================================
-- Migration: Finalize and Simplify CMS Database Model
-- Date: 2025-01-XX
-- Purpose: Add constraints, rename columns for clarity, prepare for consolidation
-- 
-- This migration:
-- 1. Adds missing constraints to canonical CMS tables
-- 2. Renames columns for clarity and consistency
-- 3. Adds documentation comments for consolidation plan
-- 4. Prepares schema for future consolidation of redundant tables
-- 
-- CANONICAL CMS TABLES (keep):
--   - pages: Main website pages
--   - sections: Page components/blocks (flexible JSONB content)
--   - media: Media library
--   - content_history: Audit trail
--
-- REDUNDANT TABLES (marked for future consolidation into sections):
--   - faqs + faq_categories: Can be stored as sections with type 'faq-category'
--   - features + feature_categories: Can be stored as sections with type 'feature-category'
--   - pricing_plans: Can be stored as sections with type 'pricing-plans'
--   - global_content: Can be stored as sections on special 'global' page
--
-- BLOG TABLES (keep for now):
--   - blog_posts + blog_categories: Structured content, may keep separate
-- ============================================================================

-- ============================================================================
-- 1. PAGES TABLE - Add constraints and improve clarity
-- ============================================================================

-- Add check constraint for slug format (lowercase, alphanumeric, hyphens only)
ALTER TABLE pages 
  ADD CONSTRAINT pages_slug_format 
  CHECK (slug ~ '^[a-z0-9-]+$');

-- Add check constraint for published state consistency
-- (published pages should have required fields)
ALTER TABLE pages
  ADD CONSTRAINT pages_published_requires_title
  CHECK (NOT published OR title IS NOT NULL AND length(trim(title)) > 0);

-- Add comment documenting consolidation plan
COMMENT ON TABLE pages IS 
  'Canonical CMS table: Main website pages. Each page can have multiple sections.';

COMMENT ON COLUMN pages.slug IS 
  'URL-friendly identifier. Must be unique and lowercase with hyphens only.';

COMMENT ON COLUMN pages.metadata IS 
  'JSONB metadata for SEO, social sharing, and page-specific configuration.';

-- ============================================================================
-- 2. SECTIONS TABLE - Add constraints
-- ============================================================================

-- NOTE: component_type will be renamed to section_type in migration 007
-- after codebase updates. This migration prepares constraints that will work
-- with both column names temporarily.

-- Add check constraint for component_type (must be non-empty)
-- This will be updated in migration 007 when column is renamed
ALTER TABLE sections
  ADD CONSTRAINT sections_type_not_empty
  CHECK (length(trim(component_type)) > 0);

-- Add check constraint for order_index (must be non-negative)
ALTER TABLE sections
  ADD CONSTRAINT sections_order_non_negative
  CHECK (order_index >= 0);

-- Add check constraint for content (must be valid JSONB object)
ALTER TABLE sections
  ADD CONSTRAINT sections_content_is_object
  CHECK (jsonb_typeof(content) = 'object');

-- Add index on component_type for filtering by type
CREATE INDEX IF NOT EXISTS idx_sections_type 
  ON sections(component_type) 
  WHERE published = true;

-- Add composite index for type-based queries
CREATE INDEX IF NOT EXISTS idx_sections_page_type_order 
  ON sections(page_id, component_type, order_index);

-- Update comments
COMMENT ON TABLE sections IS 
  'Canonical CMS table: Page sections/components with flexible JSONB content. 
   All content types (hero, features, FAQs, pricing, etc.) are stored here.';

COMMENT ON COLUMN sections.component_type IS 
  'Type of section: hero, blog-post, faq-category, feature-category, pricing-plans, etc. 
   TODO: Rename to section_type in future migration after codebase update.';

COMMENT ON COLUMN sections.content IS 
  'JSONB content structure varies by section_type. See section-schemas.ts for validation.';

COMMENT ON COLUMN sections.order_index IS 
  'Display order within the page. Lower values appear first.';

-- ============================================================================
-- 3. MEDIA TABLE - Add constraints and improve clarity
-- ============================================================================

-- Add check constraint for filename (must be non-empty)
ALTER TABLE media
  ADD CONSTRAINT media_filename_not_empty
  CHECK (length(trim(filename)) > 0);

-- Add check constraint for storage_path (must be non-empty)
ALTER TABLE media
  ADD CONSTRAINT media_storage_path_not_empty
  CHECK (length(trim(storage_path)) > 0);

-- Add check constraint for bucket_name (must be non-empty)
ALTER TABLE media
  ADD CONSTRAINT media_bucket_name_not_empty
  CHECK (length(trim(bucket_name)) > 0);

-- Add check constraint for file_size (must be positive if provided)
ALTER TABLE media
  ADD CONSTRAINT media_file_size_positive
  CHECK (file_size IS NULL OR file_size > 0);

-- Add unique constraint on storage_path to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_storage_path_unique 
  ON media(storage_path) 
  WHERE storage_path IS NOT NULL;

-- Update comments
COMMENT ON TABLE media IS 
  'Canonical CMS table: Media library for all images and files. 
   Referenced by sections and other content via storage paths.';

COMMENT ON COLUMN media.storage_path IS 
  'Full path in Supabase Storage. Format: bucket_name/path/to/file.ext';

COMMENT ON COLUMN media.category IS 
  'Media category: hero, blog, gallery, screenshot, testimonial, feature, icon, logo, etc.';

COMMENT ON COLUMN media.metadata IS 
  'JSONB metadata: width, height, format, dimensions, etc.';

-- ============================================================================
-- 4. CONTENT_HISTORY TABLE - Add constraints and improve clarity
-- ============================================================================

-- Add check constraint for entity_type (must be non-empty)
ALTER TABLE content_history
  ADD CONSTRAINT content_history_entity_type_not_empty
  CHECK (length(trim(entity_type)) > 0);

-- Add check constraint for action (must be valid action type)
ALTER TABLE content_history
  ADD CONSTRAINT content_history_action_valid
  CHECK (action IN ('created', 'updated', 'published', 'unpublished', 'deleted'));

-- Add check constraint for entity_id (must be valid UUID)
ALTER TABLE content_history
  ADD CONSTRAINT content_history_entity_id_uuid
  CHECK (entity_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Add index for querying by entity
CREATE INDEX IF NOT EXISTS idx_content_history_entity_type_id 
  ON content_history(entity_type, entity_id, performed_at DESC);

-- Update comments
COMMENT ON TABLE content_history IS 
  'Canonical CMS table: Audit trail for all content changes. 
   Tracks created, updated, published, unpublished, and deleted actions.';

COMMENT ON COLUMN content_history.entity_type IS 
  'Type of entity: page, section, blog_post, faq, feature, pricing_plan, etc.';

COMMENT ON COLUMN content_history.snapshot IS 
  'JSONB snapshot of entity state before change (for updates/deletes).';

-- ============================================================================
-- 5. REDUNDANT TABLES - Mark for consolidation, add documentation
-- ============================================================================

-- FAQ Tables - Marked for consolidation into sections
COMMENT ON TABLE faqs IS 
  'REDUNDANT: Will be consolidated into sections table with section_type=''faq-category''. 
   Each FAQ category will become a section with faqs array in content JSONB.';

COMMENT ON TABLE faq_categories IS 
  'REDUNDANT: Will be consolidated into sections table. 
   Category metadata will be stored in section content JSONB.';

-- Feature Tables - Marked for consolidation into sections
COMMENT ON TABLE features IS 
  'REDUNDANT: Will be consolidated into sections table with section_type=''feature-category''. 
   Each feature category will become a section with features array in content JSONB.';

COMMENT ON TABLE feature_categories IS 
  'REDUNDANT: Will be consolidated into sections table. 
   Category metadata will be stored in section content JSONB.';

-- Pricing Table - Marked for consolidation into sections
COMMENT ON TABLE pricing_plans IS 
  'REDUNDANT: Will be consolidated into sections table with section_type=''pricing-plans''. 
   All pricing plans will be stored as a single section with plans array in content JSONB.';

-- Global Content Table - Marked for consolidation into sections
COMMENT ON TABLE global_content IS 
  'REDUNDANT: Will be consolidated into sections table on a special ''global'' page. 
   Each global content key (navbar, footer, etc.) will become a section.';

-- ============================================================================
-- 6. BLOG TABLES - Keep for now, add constraints
-- ============================================================================

-- Add check constraint for blog_posts slug format
ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_slug_format
  CHECK (slug ~ '^[a-z0-9-]+$');

-- Add check constraint for read_time (must be positive if provided)
ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_read_time_positive
  CHECK (read_time IS NULL OR read_time > 0);

-- Add check constraint for published state
ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_published_requires_title
  CHECK (NOT published OR (title IS NOT NULL AND length(trim(title)) > 0));

-- Update comments
COMMENT ON TABLE blog_posts IS 
  'Blog articles. May be kept separate from sections due to structured content needs.';

COMMENT ON TABLE blog_categories IS 
  'Blog categories. May be kept separate from sections.';

-- ============================================================================
-- 7. ADD MISSING FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Ensure sections.page_id references pages.id (should already exist, but verify)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'sections_page_id_fkey'
  ) THEN
    ALTER TABLE sections
      ADD CONSTRAINT sections_page_id_fkey
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure media.uploaded_by references auth.users (should already exist, but verify)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'media_uploaded_by_fkey'
  ) THEN
    ALTER TABLE media
      ADD CONSTRAINT media_uploaded_by_fkey
      FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ensure content_history.performed_by references auth.users (should already exist, but verify)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'content_history_performed_by_fkey'
  ) THEN
    ALTER TABLE content_history
      ADD CONSTRAINT content_history_performed_by_fkey
      FOREIGN KEY (performed_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- 8. UPDATE TRIGGERS FOR RENAMED COLUMN
-- ============================================================================

-- Update content_history trigger function to use correct table name
-- (The function already uses TG_TABLE_NAME, so it should work, but verify)
-- No changes needed as the trigger function uses TG_TABLE_NAME dynamically

-- ============================================================================
-- 9. ADD HELPER FUNCTIONS FOR FUTURE CONSOLIDATION
-- ============================================================================

-- Function to get section type display name
CREATE OR REPLACE FUNCTION get_section_type_display_name(section_type TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE section_type
    WHEN 'hero' THEN 'Hero Section'
    WHEN 'blog-post' THEN 'Blog Post'
    WHEN 'faq-category' THEN 'FAQ Category'
    WHEN 'feature-category' THEN 'Feature Category'
    WHEN 'pricing-plans' THEN 'Pricing Plans'
    WHEN 'pricing-hero' THEN 'Pricing Hero'
    WHEN 'free-messages' THEN 'Free Messages'
    WHEN 'message-bundles' THEN 'Message Bundles'
    WHEN 'pricing-info' THEN 'Pricing Info'
    WHEN 'pricing-faq' THEN 'Pricing FAQ'
    WHEN 'contact-hero' THEN 'Contact Hero'
    WHEN 'contact-info' THEN 'Contact Info'
    WHEN 'contact-info-details' THEN 'Contact Info Details'
    WHEN 'how-it-works' THEN 'How It Works'
    WHEN 'gallery' THEN 'Gallery'
    WHEN 'testimonials' THEN 'Testimonials'
    WHEN 'app-download' THEN 'App Download'
    WHEN 'coming-soon' THEN 'Coming Soon'
    WHEN 'timeline' THEN 'Timeline'
    WHEN 'why-join' THEN 'Why Join'
    WHEN 'content' THEN 'Content'
    WHEN 'values' THEN 'Values'
    ELSE INITCAP(REPLACE(section_type, '-', ' '))
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION get_section_type_display_name IS 
  'Returns human-readable display name for section types. Used in CMS UI.';

-- ============================================================================
-- 10. CREATE VIEWS FOR EASIER QUERYING (PREPARATION FOR CONSOLIDATION)
-- ============================================================================

-- View for all published sections with page info
CREATE OR REPLACE VIEW v_published_sections AS
SELECT 
  s.id,
  s.page_id,
  p.slug AS page_slug,
  p.title AS page_title,
  s.component_type AS section_type,
  get_section_type_display_name(s.component_type) AS section_type_display,
  s.order_index,
  s.content,
  s.published,
  s.created_at,
  s.updated_at
FROM sections s
INNER JOIN pages p ON s.page_id = p.id
WHERE s.published = true AND p.published = true
ORDER BY p.slug, s.order_index;

COMMENT ON VIEW v_published_sections IS 
  'View of all published sections with page information. 
   Useful for frontend rendering and CMS queries.';

-- View for section statistics by type
CREATE OR REPLACE VIEW v_section_stats AS
SELECT 
  component_type AS section_type,
  get_section_type_display_name(component_type) AS section_type_display,
  COUNT(*) AS total_count,
  COUNT(*) FILTER (WHERE published = true) AS published_count,
  COUNT(*) FILTER (WHERE published = false) AS draft_count,
  COUNT(DISTINCT page_id) AS pages_using_type
FROM sections
GROUP BY component_type
ORDER BY total_count DESC;

COMMENT ON VIEW v_section_stats IS 
  'Statistics about section usage by type. Useful for CMS analytics.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 006_finalize_cms_schema completed successfully';
  RAISE NOTICE 'Canonical CMS tables: pages, sections, media, content_history';
  RAISE NOTICE 'Redundant tables marked for consolidation: faqs, features, pricing_plans, global_content';
  RAISE NOTICE 'Next steps: Plan data migration from redundant tables to sections';
END $$;

