-- Migration: Fix Public Form RLS Policies
-- Date: January 2025
-- Purpose: Ensure anonymous users can submit waitlist and contact forms

-- ============================================================================
-- CREATE is_admin() FUNCTION IF IT DOESN'T EXIST
-- ============================================================================

-- Create the is_admin() function if it doesn't exist (from migration 002)
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
-- FIX WAITLIST SIGNUPS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit waitlist" ON waitlist_signups;

-- Create explicit policy for anonymous inserts
-- This allows anyone (including unauthenticated users) to insert into waitlist_signups
CREATE POLICY "Anyone can submit waitlist" ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure admins can still read
-- Drop and recreate to ensure it uses is_admin() function
DROP POLICY IF EXISTS "Admins read waitlist" ON waitlist_signups;
CREATE POLICY "Admins read waitlist" ON waitlist_signups
  FOR SELECT
  USING (is_admin());

-- ============================================================================
-- FIX CONTACT SUBMISSIONS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create explicit policy for anonymous inserts
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure admins can manage contact submissions
-- Drop and recreate to ensure it uses is_admin() function
DROP POLICY IF EXISTS "Admins full access contact" ON contact_submissions;
CREATE POLICY "Admins full access contact" ON contact_submissions
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to anon role
GRANT INSERT ON waitlist_signups TO anon;
GRANT INSERT ON contact_submissions TO anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Anyone can submit waitlist" ON waitlist_signups IS 
  'Allows anonymous and authenticated users to submit waitlist signups';

COMMENT ON POLICY "Anyone can submit contact form" ON contact_submissions IS 
  'Allows anonymous and authenticated users to submit contact form';

