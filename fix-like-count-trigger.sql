-- Fix like count trigger to prevent negative values
-- This migration updates the trigger function and fixes existing negative counts

-- Update the trigger function to prevent negative like counts
CREATE OR REPLACE FUNCTION update_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET like_count = like_count + 1 
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products 
    SET like_count = GREATEST(0, like_count - 1)
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Fix any existing negative like counts
UPDATE products SET like_count = GREATEST(0, like_count) WHERE like_count < 0;

-- Recalculate all like counts to ensure accuracy
UPDATE products SET like_count = (
  SELECT COUNT(*) FROM likes WHERE likes.product_id = products.id
); 