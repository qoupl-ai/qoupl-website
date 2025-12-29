-- Migration: Setup Storage Bucket Policies
-- Date: December 2024
-- Purpose: Allow admin users to upload files to storage buckets

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================

-- Note: Storage policies are set at the bucket level in Supabase
-- These SQL statements need to be run in the Supabase dashboard SQL editor
-- or via the Supabase CLI

-- For hero-images bucket: Allow admins to upload, public to read
-- Run this in Supabase SQL Editor:
/*
CREATE POLICY "Admins can upload to hero-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hero-images' AND
  (SELECT is_admin() FROM admin_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1)
);

CREATE POLICY "Public can read hero-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'hero-images');
*/

-- For blog-images bucket: Allow admins to upload, public to read
/*
CREATE POLICY "Admins can upload to blog-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  (SELECT is_admin() FROM admin_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1)
);

CREATE POLICY "Public can read blog-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');
*/

-- For couple-photos bucket: Allow admins to upload, public to read
/*
CREATE POLICY "Admins can upload to couple-photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'couple-photos' AND
  (SELECT is_admin() FROM admin_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1)
);

CREATE POLICY "Public can read couple-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'couple-photos');
*/

-- For app-screenshots bucket: Allow admins to upload, public to read
/*
CREATE POLICY "Admins can upload to app-screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'app-screenshots' AND
  (SELECT is_admin() FROM admin_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1)
);

CREATE POLICY "Public can read app-screenshots"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'app-screenshots');
*/

-- ============================================================================
-- ALTERNATIVE: Use Service Role (Bypasses all policies)
-- ============================================================================
-- The admin client uses the service role key which should bypass all policies
-- If uploads still fail, check:
-- 1. SUPABASE_SERVICE_ROLE_KEY is set correctly in .env.local
-- 2. The service role key has not been rotated
-- 3. Bucket exists and is accessible

-- ============================================================================
-- QUICK FIX: Allow authenticated users to upload (less secure, but works)
-- ============================================================================
-- If the above doesn't work, you can temporarily allow all authenticated users:
/*
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('hero-images', 'blog-images', 'couple-photos', 'app-screenshots'));
*/

COMMENT ON TABLE storage.objects IS 'Storage objects table. Policies must be configured in Supabase dashboard under Storage > Policies for each bucket.';

