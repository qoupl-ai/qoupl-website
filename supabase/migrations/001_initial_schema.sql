-- qoupl Website - Initial Database Schema
-- Created: December 24, 2025
-- Purpose: CMS-driven content management for qoupl.ai

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ADMIN & AUTHENTICATION
-- ============================================================================

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read their own data
CREATE POLICY "Admins can read own data" ON admin_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

-- Pages table (12 pages)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Sections table (page components/blocks)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  component_type TEXT NOT NULL, -- 'hero', 'features', 'gallery', 'testimonials', etc.
  order_index INTEGER DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Global content (navbar, footer, contact info)
CREATE TABLE global_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- 'navbar', 'footer', 'contact_info', 'social_links'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- BLOG
-- ============================================================================

-- Blog categories
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT, -- Full article content (markdown or HTML)
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author TEXT,
  publish_date TIMESTAMPTZ,
  read_time INTEGER, -- in minutes
  featured_image TEXT, -- storage path
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- FAQ
-- ============================================================================

-- FAQ categories
CREATE TABLE faq_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ items
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES faq_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- FEATURES & PRICING
-- ============================================================================

-- Feature categories (smart_matching, safety_trust, communication, premium)
CREATE TABLE feature_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- lucide icon name
  image_path TEXT, -- screenshot path from storage
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual features
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES feature_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- lucide icon name
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Pricing plans
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_type TEXT NOT NULL, -- 'subscription', 'bundle', 'free'
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_period TEXT, -- 'monthly', 'one_time', null
  features JSONB DEFAULT '[]'::jsonb, -- array of feature strings
  is_popular BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- MEDIA & STORAGE
-- ============================================================================

-- Media library
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- full path in Supabase Storage
  bucket_name TEXT NOT NULL,
  file_type TEXT, -- MIME type
  file_size INTEGER, -- bytes
  alt_text TEXT,
  category TEXT, -- 'hero', 'blog', 'gallery', 'screenshot', etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- FORMS & SUBMISSIONS
-- ============================================================================

-- Waitlist signups
CREATE TABLE waitlist_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 25),
  looking_for TEXT,
  verified BOOLEAN DEFAULT false,
  signup_date TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'replied', 'resolved'
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================================================
-- CONTENT HISTORY (Audit Trail)
-- ============================================================================

-- Content history for publish tracking
CREATE TABLE content_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- 'blog_post', 'faq', 'page', 'section', etc.
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'published', 'unpublished', 'deleted'
  snapshot JSONB, -- full data snapshot before change
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Pages
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(published);

-- Sections
CREATE INDEX idx_sections_page_id ON sections(page_id);
CREATE INDEX idx_sections_published ON sections(published);
CREATE INDEX idx_sections_order ON sections(page_id, order_index);

-- Global content
CREATE INDEX idx_global_content_key ON global_content(key);

-- Blog
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, publish_date DESC);

-- FAQ
CREATE INDEX idx_faqs_category ON faqs(category_id);
CREATE INDEX idx_faqs_published ON faqs(published);
CREATE INDEX idx_faqs_order ON faqs(category_id, order_index);

-- Features
CREATE INDEX idx_features_category ON features(category_id);
CREATE INDEX idx_features_published ON features(published);

-- Media
CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_bucket ON media(bucket_name);

-- Waitlist
CREATE INDEX idx_waitlist_email ON waitlist_signups(email);
CREATE INDEX idx_waitlist_date ON waitlist_signups(signup_date DESC);

-- Contact
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_date ON contact_submissions(submitted_at DESC);

-- History
CREATE INDEX idx_history_entity ON content_history(entity_type, entity_id);
CREATE INDEX idx_history_date ON content_history(performed_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read published pages" ON pages
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read published sections" ON sections
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read global content" ON global_content
  FOR SELECT
  USING (true);

CREATE POLICY "Public read published blog posts" ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read blog categories" ON blog_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Public read published faqs" ON faqs
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read faq categories" ON faq_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Public read published features" ON features
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read feature categories" ON feature_categories
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read published pricing" ON pricing_plans
  FOR SELECT
  USING (published = true);

CREATE POLICY "Public read media" ON media
  FOR SELECT
  USING (true);

-- Allow anonymous inserts for forms
CREATE POLICY "Anyone can submit waitlist" ON waitlist_signups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Admin policies (full access for authenticated admins)
-- Note: In production, add additional checks via admin_users table

CREATE POLICY "Admins full access pages" ON pages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access sections" ON sections
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access global content" ON global_content
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access blog posts" ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access faqs" ON faqs
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access features" ON features
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access pricing" ON pricing_plans
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access media" ON media
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins read waitlist" ON waitlist_signups
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access contact" ON contact_submissions
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins read history" ON content_history
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_content_updated_at BEFORE UPDATE ON global_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log content history
CREATE OR REPLACE FUNCTION log_content_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO content_history (entity_type, entity_id, action, snapshot, performed_by)
    VALUES (TG_TABLE_NAME, OLD.id, 'updated', row_to_json(OLD), auth.uid());
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO content_history (entity_type, entity_id, action, snapshot, performed_by)
    VALUES (TG_TABLE_NAME, OLD.id, 'deleted', row_to_json(OLD), auth.uid());
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply history logging triggers
CREATE TRIGGER log_pages_history AFTER UPDATE OR DELETE ON pages
  FOR EACH ROW EXECUTE FUNCTION log_content_history();

CREATE TRIGGER log_blog_posts_history AFTER UPDATE OR DELETE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION log_content_history();

CREATE TRIGGER log_faqs_history AFTER UPDATE OR DELETE ON faqs
  FOR EACH ROW EXECUTE FUNCTION log_content_history();

CREATE TRIGGER log_sections_history AFTER UPDATE OR DELETE ON sections
  FOR EACH ROW EXECUTE FUNCTION log_content_history();

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert default pages
INSERT INTO pages (slug, title, description, published) VALUES
  ('home', 'Home', 'qoupl - Find your vibe. Match your energy. Connect for real.', true),
  ('about', 'About Us', 'Learn about qoupl''s mission and values', true),
  ('features', 'Features', 'Discover qoupl''s powerful features', true),
  ('pricing', 'Pricing', 'Simple, transparent pricing for everyone', true),
  ('faq', 'FAQ', 'Frequently asked questions', true),
  ('blog', 'Blog', 'Latest updates and articles', true),
  ('careers', 'Careers', 'Join our team', true),
  ('contact', 'Contact', 'Get in touch with us', true),
  ('safety', 'Safety & Security', 'Your safety is our priority', true),
  ('terms', 'Terms of Service', 'Legal terms and conditions', true),
  ('privacy', 'Privacy Policy', 'How we protect your data', true),
  ('community-guidelines', 'Community Guidelines', 'Rules for respectful community', true);

-- Insert blog categories
INSERT INTO blog_categories (name, slug, order_index) VALUES
  ('Technology', 'technology', 1),
  ('Relationships', 'relationships', 2),
  ('Safety', 'safety', 3),
  ('Psychology', 'psychology', 4),
  ('Tips & Tricks', 'tips-tricks', 5);

-- Insert FAQ categories
INSERT INTO faq_categories (name, slug, order_index) VALUES
  ('Getting Started', 'getting-started', 1),
  ('Matching & Discovery', 'matching-discovery', 2),
  ('Messaging & Communication', 'messaging-communication', 3),
  ('Safety & Privacy', 'safety-privacy', 4),
  ('Premium Features', 'premium-features', 5),
  ('Profile & Account', 'profile-account', 6),
  ('Technical Support', 'technical-support', 7),
  ('Success & Tips', 'success-tips', 8);

-- Insert feature categories
INSERT INTO feature_categories (name, slug, description, icon, image_path, order_index, published) VALUES
  ('Smart Matching', 'smart-matching', 'AI-powered matching algorithm', 'heart', '/qoupl/3.png', 1, true),
  ('Safety & Trust', 'safety-trust', 'Verified profiles and secure messaging', 'shield', '/qoupl/1.png', 2, true),
  ('Rich Communication', 'rich-communication', 'Multiple ways to connect', 'message-circle', '/qoupl/4.png', 3, true),
  ('Premium Experience', 'premium-experience', 'Enhanced features for better matches', 'sparkles', '/qoupl/6.png', 4, true);

-- Insert global content
INSERT INTO global_content (key, content) VALUES
  ('contact_info', '{"email": "support@qoupl.ai", "phone": "+91 9103732229", "address": "B-98, Sector-2, Noida, UP 201301", "support_email": "help@qoupl.ai"}'::jsonb),
  ('social_links', '{"linkedin": "https://linkedin.com/company/qoupl-ai", "instagram": "https://instagram.com/qoupl.ai"}'::jsonb),
  ('site_config', '{"waitlist_count": 10000, "tagline": "Be couple with qoupl", "subtitle": "Find your vibe. Match your energy. Connect for real."}'::jsonb);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE pages IS 'Main website pages (12 total)';
COMMENT ON TABLE sections IS 'Page sections/components with flexible JSONB config';
COMMENT ON TABLE global_content IS 'Sitewide content (navbar, footer, contact)';
COMMENT ON TABLE blog_posts IS 'Blog articles with categories';
COMMENT ON TABLE faqs IS 'FAQ items organized by category';
COMMENT ON TABLE features IS 'Product features grouped by category';
COMMENT ON TABLE pricing_plans IS 'Subscription plans and message bundles';
COMMENT ON TABLE media IS 'Media library for all images/files';
COMMENT ON TABLE waitlist_signups IS 'Waitlist form submissions';
COMMENT ON TABLE contact_submissions IS 'Contact form submissions';
COMMENT ON TABLE content_history IS 'Audit trail for all content changes';
COMMENT ON TABLE admin_users IS 'Admin users with CMS access';
