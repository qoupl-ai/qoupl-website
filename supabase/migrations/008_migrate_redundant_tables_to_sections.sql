-- ============================================================================
-- Migration: Migrate Data from Redundant Tables to Sections
-- Date: 2025-01-XX
-- Purpose: Consolidate FAQs, Features, Pricing Plans, and Global Content into sections
-- 
-- This migration:
-- 1. Migrates FAQ categories and FAQs to sections (section_type='faq-category')
-- 2. Migrates Feature categories and Features to sections (section_type='feature-category')
-- 3. Migrates Pricing Plans to sections (section_type='pricing-plans')
-- 4. Migrates Global Content to sections on a special 'global' page
-- 
-- WARNING: This migration will modify data. Backup your database first!
-- ============================================================================

-- ============================================================================
-- 1. Ensure 'global' page exists for global content
-- ============================================================================

INSERT INTO pages (slug, title, description, published)
VALUES ('global', 'Global Content', 'Sitewide content (navbar, footer, etc.)', false)
ON CONFLICT (slug) DO NOTHING;

-- Get the global page ID
DO $$
DECLARE
  global_page_id UUID;
BEGIN
  SELECT id INTO global_page_id FROM pages WHERE slug = 'global';
  
  IF global_page_id IS NULL THEN
    RAISE EXCEPTION 'Global page not found after creation';
  END IF;

  -- ============================================================================
  -- 2. MIGRATE FAQ CATEGORIES AND FAQS TO SECTIONS
  -- ============================================================================
  
  -- Migrate each FAQ category as a section
  INSERT INTO sections (page_id, section_type, order_index, content, published, created_at, updated_at)
  SELECT 
    (SELECT id FROM pages WHERE slug = 'faq' LIMIT 1) AS page_id,
    'faq-category' AS section_type,
    fc.order_index,
    jsonb_build_object(
      'category_id', fc.id::text,
      'faqs', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'question', f.question,
              'answer', f.answer,
              'order_index', f.order_index
            ) ORDER BY f.order_index
          )
          FROM faqs f
          WHERE f.category_id = fc.id AND f.published = true
        ),
        '[]'::jsonb
      )
    ) AS content,
    true AS published,
    fc.created_at,
    NOW() AS updated_at
  FROM faq_categories fc
  WHERE NOT EXISTS (
    SELECT 1 FROM sections s
    WHERE s.section_type = 'faq-category'
    AND s.content->>'category_id' = fc.id::text
  );

  RAISE NOTICE 'Migrated FAQ categories to sections';

  -- ============================================================================
  -- 3. MIGRATE FEATURE CATEGORIES AND FEATURES TO SECTIONS
  -- ============================================================================
  
  -- Migrate each feature category as a section
  INSERT INTO sections (page_id, section_type, order_index, content, published, created_at, updated_at)
  SELECT 
    (SELECT id FROM pages WHERE slug = 'features' LIMIT 1) AS page_id,
    'feature-category' AS section_type,
    fc.order_index,
    jsonb_build_object(
      'category_id', fc.id::text,
      'features', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'title', f.title,
              'description', f.description,
              'icon', f.icon,
              'order_index', f.order_index
            ) ORDER BY f.order_index
          )
          FROM features f
          WHERE f.category_id = fc.id AND f.published = true
        ),
        '[]'::jsonb
      )
    ) AS content,
    fc.published,
    fc.created_at,
    fc.updated_at
  FROM feature_categories fc
  WHERE fc.published = true
  AND NOT EXISTS (
    SELECT 1 FROM sections s
    WHERE s.section_type = 'feature-category'
    AND s.content->>'category_id' = fc.id::text
  );

  RAISE NOTICE 'Migrated feature categories to sections';

  -- ============================================================================
  -- 4. MIGRATE PRICING PLANS TO SECTIONS
  -- ============================================================================
  
  -- Migrate all pricing plans as a single section
  INSERT INTO sections (page_id, section_type, order_index, content, published, created_at, updated_at)
  SELECT 
    (SELECT id FROM pages WHERE slug = 'pricing' LIMIT 1) AS page_id,
    'pricing-plans' AS section_type,
    1 AS order_index,
    jsonb_build_object(
      'plans', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'name', pp.name,
              'price', pp.price,
              'currency', pp.currency,
              'billing_period', pp.billing_period,
              'features', pp.features,
              'is_popular', pp.is_popular,
              'order_index', pp.order_index
            ) ORDER BY pp.order_index
          )
          FROM pricing_plans pp
          WHERE pp.published = true
        ),
        '[]'::jsonb
      )
    ) AS content,
    true AS published,
    NOW() AS created_at,
    NOW() AS updated_at
  WHERE EXISTS (
    SELECT 1 FROM pricing_plans WHERE published = true
  )
  AND NOT EXISTS (
    SELECT 1 FROM sections s
    WHERE s.page_id = (SELECT id FROM pages WHERE slug = 'pricing' LIMIT 1)
    AND s.section_type = 'pricing-plans'
  );

  RAISE NOTICE 'Migrated pricing plans to sections';

  -- ============================================================================
  -- 5. MIGRATE GLOBAL CONTENT TO SECTIONS
  -- ============================================================================
  
  -- Migrate each global content key as a section on the 'global' page
  INSERT INTO sections (page_id, section_type, order_index, content, published, created_at, updated_at, updated_by)
  SELECT 
    global_page_id AS page_id,
    'content' AS section_type,
    CASE gc.key
      WHEN 'navbar' THEN 1
      WHEN 'footer' THEN 2
      WHEN 'contact_info' THEN 3
      WHEN 'social_links' THEN 4
      WHEN 'site_config' THEN 5
      ELSE 99
    END AS order_index,
    jsonb_build_object(
      'key', gc.key,
      'data', gc.content
    ) AS content,
    true AS published,
    NOW() AS created_at,
    gc.updated_at,
    gc.updated_by
  FROM global_content gc
  WHERE NOT EXISTS (
    SELECT 1 FROM sections s
    WHERE s.page_id = global_page_id
    AND s.section_type = 'content'
    AND s.content->>'key' = gc.key
  );

  RAISE NOTICE 'Migrated global content to sections';

  -- ============================================================================
  -- 6. VERIFICATION QUERIES (for manual checking)
  -- ============================================================================
  
  RAISE NOTICE 'Migration complete. Verification:';
  RAISE NOTICE 'FAQ sections: %', (SELECT COUNT(*) FROM sections WHERE section_type = 'faq-category');
  RAISE NOTICE 'Feature sections: %', (SELECT COUNT(*) FROM sections WHERE section_type = 'feature-category');
  RAISE NOTICE 'Pricing sections: %', (SELECT COUNT(*) FROM sections WHERE section_type = 'pricing-plans');
  RAISE NOTICE 'Global content sections: %', (SELECT COUNT(*) FROM sections WHERE page_id = global_page_id AND section_type = 'content');

END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE faqs IS 
  'DEPRECATED: Data migrated to sections table. This table can be dropped after verification.';

COMMENT ON TABLE faq_categories IS 
  'DEPRECATED: Data migrated to sections table. This table can be dropped after verification.';

COMMENT ON TABLE features IS 
  'DEPRECATED: Data migrated to sections table. This table can be dropped after verification.';

COMMENT ON TABLE feature_categories IS 
  'DEPRECATED: Data migrated to sections table. This table can be dropped after verification.';

COMMENT ON TABLE pricing_plans IS 
  'DEPRECATED: Data migrated to sections table. This table can be dropped after verification.';

COMMENT ON TABLE global_content IS 
  'DEPRECATED: Data migrated to sections table on ''global'' page. This table can be dropped after verification.';

