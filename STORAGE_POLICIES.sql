-- ============================================================================
-- STORAGE POLICIES FOR ALL BUCKETS
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor
-- This allows admin users to upload/manage files and public to read

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

-- Allow admins to update
CREATE POLICY "Admins can update hero-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'hero-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- Allow admins to delete
CREATE POLICY "Admins can delete hero-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
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

CREATE POLICY "Admins can update blog-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can delete blog-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
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

CREATE POLICY "Admins can update couple-photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'couple-photos' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can delete couple-photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
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

CREATE POLICY "Admins can update app-screenshots"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'app-screenshots' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can delete app-screenshots"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'app-screenshots' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Public can read app-screenshots"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'app-screenshots');

-- ============================================================================
-- USER-UPLOADS BUCKET (Private - Admin Only)
-- ============================================================================

CREATE POLICY "Admins can upload to user-uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can update user-uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can delete user-uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can read user-uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);
