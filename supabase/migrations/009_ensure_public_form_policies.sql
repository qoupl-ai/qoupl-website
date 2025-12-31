-- Migration: Ensure Public Form RLS Policies
-- Date: January 2025
-- Purpose: Ensure anonymous users can submit waitlist and contact forms
-- This migration can be run multiple times safely (idempotent)

-- ============================================================================
-- WAITLIST SIGNUPS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit waitlist" ON waitlist_signups;
DROP POLICY IF EXISTS "Admins read waitlist" ON waitlist_signups;

-- Create policy for anonymous inserts
-- This allows anyone (including unauthenticated users) to insert into waitlist_signups
CREATE POLICY "Anyone can submit waitlist" ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for admin reads
-- Only users who are in the admin_users table with is_active = true can read
CREATE POLICY "Admins read waitlist" ON waitlist_signups
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- ============================================================================
-- CONTACT SUBMISSIONS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Admins full access contact" ON contact_submissions;

-- Create policy for anonymous inserts
-- This allows anyone (including unauthenticated users) to insert into contact_submissions
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for admin full access
-- Admins can SELECT, UPDATE, DELETE (ALL operations)
-- USING controls which rows can be read/updated/deleted
-- WITH CHECK controls which rows can be inserted/updated
CREATE POLICY "Admins full access contact" ON contact_submissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant INSERT permission to anon role at the database level
-- This is required even if RLS policies allow it
GRANT INSERT ON waitlist_signups TO anon;
GRANT INSERT ON contact_submissions TO anon;

-- ============================================================================
-- ENSURE RLS IS ENABLED
-- ============================================================================

-- Ensure RLS is enabled on both tables
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

