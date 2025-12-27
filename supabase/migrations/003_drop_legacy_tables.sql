-- Migration: Drop Legacy Content Tables
-- Date: December 2024
-- Purpose: Remove legacy content-specific tables after migration to sections

-- ============================================================================
-- WARNING: This migration drops tables. Run migrate-legacy-to-sections.ts first!
-- ============================================================================

-- Drop foreign key constraints first
ALTER TABLE IF EXISTS blog_posts DROP CONSTRAINT IF EXISTS blog_posts_category_id_fkey;
ALTER TABLE IF EXISTS faqs DROP CONSTRAINT IF EXISTS faqs_category_id_fkey;
ALTER TABLE IF EXISTS features DROP CONSTRAINT IF EXISTS features_category_id_fkey;

-- Drop triggers
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
DROP TRIGGER IF EXISTS update_features_updated_at ON features;
DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON pricing_plans;
DROP TRIGGER IF EXISTS log_blog_posts_history ON blog_posts;
DROP TRIGGER IF EXISTS log_faqs_history ON faqs;

-- Drop RLS policies
DROP POLICY IF EXISTS "Public read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins full access blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read published faqs" ON faqs;
DROP POLICY IF EXISTS "Public read faq categories" ON faq_categories;
DROP POLICY IF EXISTS "Admins full access faqs" ON faqs;
DROP POLICY IF EXISTS "Public read published features" ON features;
DROP POLICY IF EXISTS "Public read feature categories" ON feature_categories;
DROP POLICY IF EXISTS "Admins full access features" ON features;
DROP POLICY IF EXISTS "Public read published pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Admins full access pricing" ON pricing_plans;

-- Drop indexes
DROP INDEX IF EXISTS idx_blog_posts_slug;
DROP INDEX IF EXISTS idx_blog_posts_category;
DROP INDEX IF EXISTS idx_blog_posts_published;
DROP INDEX IF EXISTS idx_faqs_category;
DROP INDEX IF EXISTS idx_faqs_published;
DROP INDEX IF EXISTS idx_faqs_order;
DROP INDEX IF EXISTS idx_features_category;
DROP INDEX IF EXISTS idx_features_published;

-- Drop tables (in dependency order)
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS faq_categories CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS feature_categories CASCADE;
DROP TABLE IF EXISTS pricing_plans CASCADE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sections IS 'Unified content model: All page content (blog posts, FAQs, features, pricing, etc.) stored as sections with type-based JSONB data';

