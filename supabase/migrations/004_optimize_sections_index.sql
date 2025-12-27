-- Optimize sections table queries
-- This index covers the common query pattern: page_id + published + order_index
-- Used in getPageSections() and CMS editor queries

-- Drop the existing simpler index if it exists (we'll replace it with a better one)
DROP INDEX IF EXISTS idx_sections_order;

-- Create composite index that covers the most common query pattern
-- This index will be used when querying sections by page_id, filtering by published, and ordering by order_index
CREATE INDEX idx_sections_page_published_order ON sections(page_id, published, order_index);

-- Also create a partial index for published sections only (for public page queries)
-- This is more efficient for read-heavy workloads where we mostly query published content
CREATE INDEX idx_sections_page_published_order_partial 
ON sections(page_id, order_index) 
WHERE published = true;

-- Keep the individual indexes for other query patterns
-- (These are already created in 001_initial_schema.sql, but keeping for reference)
-- idx_sections_page_id - for queries that only filter by page_id
-- idx_sections_published - for queries that only filter by published

