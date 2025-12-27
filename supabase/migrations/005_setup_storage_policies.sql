-- Migration: Setup Storage Bucket Policies for All Buckets
-- Date: December 2024
-- Purpose: Allow admin users to upload files to all storage buckets

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================
-- Note: Storage policies must be created in Supabase Dashboard
-- Go to Storage > Policies and run these for each bucket

-- ============================================================================
-- HERO-IMAGES BUCKET
-- ============================================================================

-- Allow admins to upload
CREATE POLICY "Admins can upload to hero-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hero-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- Allow admins to update/delete
CREATE POLICY "Admins can manage hero-images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'hero-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  bucket_id = 'hero-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- Public can read
CREATE POLICY "Public can read hero-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'hero-images');

-- ============================================================================
-- BLOG-IMAGES BUCKET
-- ============================================================================

CREATE POLICY "Admins can upload to blog-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can manage blog-images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  bucket_id = 'blog-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Public can read blog-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- ============================================================================
-- COUPLE-PHOTOS BUCKET
-- ============================================================================

CREATE POLICY "Admins can upload to couple-photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'couple-photos' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can manage couple-photos"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'couple-photos' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  bucket_id = 'couple-photos' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Public can read couple-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'couple-photos');

-- ============================================================================
-- APP-SCREENSHOTS BUCKET
-- ============================================================================

CREATE POLICY "Admins can upload to app-screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'app-screenshots' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can manage app-screenshots"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'app-screenshots' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  bucket_id = 'app-screenshots' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Public can read app-screenshots"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'app-screenshots');

-- ============================================================================
-- USER-UPLOADS BUCKET (Private)
-- ============================================================================

CREATE POLICY "Admins can upload to user-uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can manage user-uploads"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Admins can upload to hero-images" ON storage.objects IS 'Allows admin users to upload files to hero-images bucket';
COMMENT ON POLICY "Public can read hero-images" ON storage.objects IS 'Allows public read access to hero-images bucket';

