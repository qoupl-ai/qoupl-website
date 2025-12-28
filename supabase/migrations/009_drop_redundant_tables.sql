-- ============================================================================
-- Migration: Drop Redundant CMS Tables
-- Date: 2025-01-XX
-- Purpose: Remove redundant tables after data migration to sections
-- 
-- WARNING: This migration DROPS tables. Only run after:
-- 1. Migration 008 has been executed successfully
-- 2. Data has been verified in sections table
-- 3. Application is working correctly with sections
-- 
-- This migration drops:
-- - faqs + faq_categories
-- - features + feature_categories
-- - pricing_plans
-- - global_content
-- ============================================================================

-- ============================================================================
-- 1. DROP FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Drop foreign keys from faqs
ALTER TABLE IF EXISTS faqs 
  DROP CONSTRAINT IF EXISTS faqs_category_id_fkey;

-- Drop foreign keys from features
ALTER TABLE IF EXISTS features 
  DROP CONSTRAINT IF EXISTS features_category_id_fkey;

-- ============================================================================
-- 2. DROP TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
DROP TRIGGER IF EXISTS update_features_updated_at ON features;
DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON pricing_plans;
DROP TRIGGER IF EXISTS update_global_content_updated_at ON global_content;
DROP TRIGGER IF EXISTS log_faqs_history ON faqs;

-- ============================================================================
-- 3. DROP RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Public read published faqs" ON faqs;
DROP POLICY IF EXISTS "Public read faq categories" ON faq_categories;
DROP POLICY IF EXISTS "Admins full access faqs" ON faqs;
DROP POLICY IF EXISTS "Public read published features" ON features;
DROP POLICY IF EXISTS "Public read feature categories" ON feature_categories;
DROP POLICY IF EXISTS "Admins full access features" ON features;
DROP POLICY IF EXISTS "Public read published pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Admins full access pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Public read global content" ON global_content;
DROP POLICY IF EXISTS "Admins full access global content" ON global_content;

-- ============================================================================
-- 4. DROP INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_faqs_category;
DROP INDEX IF EXISTS idx_faqs_published;
DROP INDEX IF EXISTS idx_faqs_order;
DROP INDEX IF EXISTS idx_features_category;
DROP INDEX IF EXISTS idx_features_published;
DROP INDEX IF EXISTS idx_global_content_key;

-- ============================================================================
-- 5. DROP TABLES (in dependency order)
-- ============================================================================

-- Drop child tables first
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS features CASCADE;

-- Drop parent tables
DROP TABLE IF EXISTS faq_categories CASCADE;
DROP TABLE IF EXISTS feature_categories CASCADE;
DROP TABLE IF EXISTS pricing_plans CASCADE;
DROP TABLE IF EXISTS global_content CASCADE;

-- ============================================================================
-- 6. UPDATE COMMENTS ON SECTIONS TABLE
-- ============================================================================

COMMENT ON TABLE sections IS 
  'Canonical CMS table: Page sections/components with flexible JSONB content. 
   All content types (hero, features, FAQs, pricing, global content, etc.) are stored here.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  -- Verify tables are dropped
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faqs') THEN
    RAISE WARNING 'Table faqs still exists';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'features') THEN
    RAISE WARNING 'Table features still exists';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pricing_plans') THEN
    RAISE WARNING 'Table pricing_plans still exists';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'global_content') THEN
    RAISE WARNING 'Table global_content still exists';
  END IF;

  RAISE NOTICE 'Migration 009 completed: Redundant tables dropped';
  RAISE NOTICE 'All content is now consolidated in the sections table';
END $$;

