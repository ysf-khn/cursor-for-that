-- Create likes table for product likes
CREATE TABLE likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- Prevent duplicate likes from same user
);

-- Create indexes for better performance
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_product_id ON likes(product_id);
CREATE INDEX idx_likes_created_at ON likes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
-- Allow authenticated users to insert their own likes
CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own likes
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE TO authenticated 
  USING (auth.uid() = user_id);

-- Allow public read access to likes (for like counts)
CREATE POLICY "Allow public read access to likes" ON likes
  FOR SELECT TO anon, authenticated 
  USING (true);

-- Add like_count column to products table for caching (optional optimization)
ALTER TABLE products ADD COLUMN like_count INTEGER DEFAULT 0;

-- Function to update like count when likes are added/removed
-- Prevents negative like counts using GREATEST function
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

-- Create triggers to automatically update like counts
CREATE TRIGGER update_like_count_on_insert
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION update_product_like_count();

CREATE TRIGGER update_like_count_on_delete
  AFTER DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_product_like_count();

-- Initialize like counts for existing products
UPDATE products SET like_count = (
  SELECT COUNT(*) FROM likes WHERE likes.product_id = products.id
);

-- Fix any existing negative like counts
UPDATE products SET like_count = GREATEST(0, like_count) WHERE like_count < 0; 