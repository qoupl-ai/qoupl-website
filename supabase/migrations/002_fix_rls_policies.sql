-- Migration: Fix RLS Policies to Enforce admin_users Table Check
-- Date: December 2024
-- Purpose: Replace weak auth.role() checks with proper admin_users table verification

-- ============================================================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================================================

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================================================
-- DROP OLD WEAK POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admins full access pages" ON pages;
DROP POLICY IF EXISTS "Admins full access sections" ON sections;
DROP POLICY IF EXISTS "Admins full access global content" ON global_content;
DROP POLICY IF EXISTS "Admins full access blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins full access faqs" ON faqs;
DROP POLICY IF EXISTS "Admins full access features" ON features;
DROP POLICY IF EXISTS "Admins full access pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Admins full access media" ON media;
DROP POLICY IF EXISTS "Admins read waitlist" ON waitlist_signups;
DROP POLICY IF EXISTS "Admins full access contact" ON contact_submissions;

-- ============================================================================
-- CREATE SECURE POLICIES WITH admin_users CHECK
-- ============================================================================

-- Pages: Admins can do everything, public can read published
CREATE POLICY "Admins full access pages" ON pages
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Sections: Admins can do everything, public can read published
CREATE POLICY "Admins full access sections" ON sections
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Global content: Admins can do everything, public can read
CREATE POLICY "Admins full access global content" ON global_content
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Blog posts: Admins can do everything, public can read published
CREATE POLICY "Admins full access blog posts" ON blog_posts
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- FAQs: Admins can do everything, public can read published
CREATE POLICY "Admins full access faqs" ON faqs
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Features: Admins can do everything, public can read published
CREATE POLICY "Admins full access features" ON features
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Pricing plans: Admins can do everything, public can read published
CREATE POLICY "Admins full access pricing" ON pricing_plans
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Media: Admins can do everything, public can read
CREATE POLICY "Admins full access media" ON media
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Waitlist: Admins can read, anyone can insert
CREATE POLICY "Admins read waitlist" ON waitlist_signups
  FOR SELECT
  USING (is_admin());

-- Contact submissions: Admins can do everything, anyone can insert
CREATE POLICY "Admins full access contact" ON contact_submissions
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin() OR TG_OP = 'INSERT');

-- Content history: Only admins can read
CREATE POLICY "Admins read history" ON content_history
  FOR SELECT
  USING (is_admin());

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION is_admin() IS 'Returns true if the current authenticated user is an active admin in admin_users table';

