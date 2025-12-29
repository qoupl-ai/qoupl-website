-- Fix Homepage Section Types
-- This migration sets component_type for homepage sections based on their content structure
-- 
-- Step 1: Ensure component_type column exists (in case it was dropped or never created)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'sections' 
    AND column_name = 'component_type'
  ) THEN
    ALTER TABLE sections ADD COLUMN component_type TEXT;
    RAISE NOTICE 'Added component_type column to sections table';
  ELSE
    RAISE NOTICE 'component_type column already exists';
  END IF;
END $$;

-- Update hero section (has title, tagline/subtitle, images with men/women)
UPDATE sections
SET component_type = 'hero'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'hero')
  AND content->>'title' IS NOT NULL
  AND (content->>'tagline' IS NOT NULL OR content->>'subtitle' IS NOT NULL)
  AND content->'images' IS NOT NULL
  AND (content->'images'->'men' IS NOT NULL OR content->'images'->'women' IS NOT NULL);

-- Update how-it-works section (has steps array)
UPDATE sections
SET component_type = 'how-it-works'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'how-it-works')
  AND content->'steps' IS NOT NULL
  AND jsonb_typeof(content->'steps') = 'array';

-- Update product-features section (has features array with title/description)
UPDATE sections
SET component_type = 'product-features'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'product-features')
  AND content->'features' IS NOT NULL
  AND jsonb_typeof(content->'features') = 'array'
  AND content->'features'->0->>'title' IS NOT NULL;

-- Update gallery section (has images array with story/title)
UPDATE sections
SET component_type = 'gallery'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'gallery')
  AND content->'images' IS NOT NULL
  AND jsonb_typeof(content->'images') = 'array'
  AND (content->'images'->0->>'story' IS NOT NULL OR content->'images'->0->>'title' IS NOT NULL);

-- Update testimonials section (has testimonials array)
UPDATE sections
SET component_type = 'testimonials'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'testimonials')
  AND content->'testimonials' IS NOT NULL
  AND jsonb_typeof(content->'testimonials') = 'array';

-- Update coming-soon section (has platforms and benefits, but no screenshots)
-- Also check for title "qoupl is Launching Soon" or similar
UPDATE sections
SET component_type = 'coming-soon'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'coming-soon')
  AND content->'platforms' IS NOT NULL
  AND content->'benefits' IS NOT NULL
  AND (content->'screenshots' IS NULL OR jsonb_array_length(content->'screenshots') = 0);

-- Update app-download section (has platforms and screenshots)
UPDATE sections
SET component_type = 'app-download'
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND (component_type IS NULL OR component_type = '' OR component_type IS DISTINCT FROM 'app-download')
  AND content->'platforms' IS NOT NULL
  AND content->'screenshots' IS NOT NULL
  AND jsonb_typeof(content->'screenshots') = 'array'
  AND jsonb_array_length(content->'screenshots') > 0;

-- Verify updates - Show summary
DO $$
DECLARE
  home_page_id UUID;
  total_sections INT;
  fixed_sections INT;
  missing_types INT;
BEGIN
  -- Get home page ID
  SELECT id INTO home_page_id FROM pages WHERE slug = 'home' LIMIT 1;
  
  IF home_page_id IS NULL THEN
    RAISE NOTICE '❌ Home page not found!';
    RETURN;
  END IF;
  
  -- Count sections
  SELECT COUNT(*) INTO total_sections 
  FROM sections 
  WHERE page_id = home_page_id;
  
  -- Count fixed sections
  SELECT COUNT(*) INTO fixed_sections 
  FROM sections 
  WHERE page_id = home_page_id 
  AND component_type IS NOT NULL 
  AND component_type != '';
  
  -- Count missing types
  SELECT COUNT(*) INTO missing_types 
  FROM sections 
  WHERE page_id = home_page_id 
  AND (component_type IS NULL OR component_type = '');
  
  RAISE NOTICE '';
  RAISE NOTICE '📊 Migration Summary:';
  RAISE NOTICE '   Total sections: %', total_sections;
  RAISE NOTICE '   Sections with type: %', fixed_sections;
  RAISE NOTICE '   Sections missing type: %', missing_types;
  RAISE NOTICE '';
  
  IF missing_types > 0 THEN
    RAISE NOTICE '⚠️  Some sections still missing component_type!';
    RAISE NOTICE '   Check the detailed results below.';
  ELSE
    RAISE NOTICE '✅ All sections have component_type set!';
  END IF;
END $$;

-- Show detailed results
SELECT 
  order_index,
  component_type,
  CASE 
    WHEN component_type IS NULL OR component_type = '' THEN '❌ Missing type'
    ELSE '✅ ' || component_type
  END as status,
  LEFT(content::text, 50) || '...' as content_preview
FROM sections
WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
ORDER BY order_index;

