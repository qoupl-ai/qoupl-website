-- ============================================================================
-- Migration: Rename component_type to section_type
-- Date: 2025-01-XX
-- Purpose: Rename column for clarity and consistency
-- 
-- This migration renames the component_type column to section_type in the
-- sections table. All code has been updated to use section_type.
-- ============================================================================

-- Rename the column
ALTER TABLE sections 
  RENAME COLUMN component_type TO section_type;

-- Update the constraint name to match new column name (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'sections_type_not_empty' 
    AND conrelid = 'sections'::regclass
  ) THEN
    ALTER TABLE sections
      RENAME CONSTRAINT sections_type_not_empty TO sections_section_type_not_empty;
  END IF;
END $$;

-- Update indexes that reference the old column name
DROP INDEX IF EXISTS idx_sections_type;
CREATE INDEX IF NOT EXISTS idx_sections_type 
  ON sections(section_type) 
  WHERE published = true;

DROP INDEX IF EXISTS idx_sections_page_type_order;
CREATE INDEX IF NOT EXISTS idx_sections_page_type_order 
  ON sections(page_id, section_type, order_index);

-- Update the view to use the new column name
DROP VIEW IF EXISTS v_published_sections;
CREATE OR REPLACE VIEW v_published_sections AS
SELECT 
  s.id,
  s.page_id,
  p.slug AS page_slug,
  p.title AS page_title,
  s.section_type,
  s.order_index,
  s.content,
  s.published,
  s.created_at,
  s.updated_at
FROM sections s
INNER JOIN pages p ON s.page_id = p.id
WHERE s.published = true AND p.published = true
ORDER BY p.slug, s.order_index;

-- Update the stats view
DROP VIEW IF EXISTS v_section_stats;
CREATE OR REPLACE VIEW v_section_stats AS
SELECT 
  section_type,
  COUNT(*) AS total_count,
  COUNT(*) FILTER (WHERE published = true) AS published_count,
  COUNT(*) FILTER (WHERE published = false) AS draft_count,
  COUNT(DISTINCT page_id) AS pages_using_type
FROM sections
GROUP BY section_type
ORDER BY total_count DESC;

-- Update comments
COMMENT ON COLUMN sections.section_type IS 
  'Type of section: hero, blog-post, faq-category, feature-category, pricing-plans, etc.';

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 007 completed: component_type renamed to section_type';
END $$;

