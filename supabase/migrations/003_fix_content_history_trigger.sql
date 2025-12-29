-- Migration: Fix content_history trigger to bypass RLS
-- Date: December 2024
-- Purpose: Allow trigger function to insert into content_history table

-- ============================================================================
-- FIX TRIGGER FUNCTION: Make it SECURITY DEFINER
-- ============================================================================

-- Update the log_content_history function to be SECURITY DEFINER
-- This allows it to bypass RLS when inserting into content_history
CREATE OR REPLACE FUNCTION log_content_history()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION log_content_history() IS 'Logs content changes to content_history table. Uses SECURITY DEFINER to bypass RLS.';

