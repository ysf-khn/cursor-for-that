-- Add slug column to products table
ALTER TABLE products ADD COLUMN slug VARCHAR(150) UNIQUE;

-- Create index for slug column for better performance
CREATE INDEX idx_products_slug ON products(slug);

-- Function to generate clean slug from product name
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique slug by checking for duplicates
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT)
RETURNS TEXT AS $$
DECLARE
    unique_slug TEXT;
    counter INTEGER := 1;
BEGIN
    unique_slug := base_slug;
    
    -- Keep checking until we find a unique slug
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = unique_slug) LOOP
        unique_slug := base_slug || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN unique_slug;
END;
$$ LANGUAGE plpgsql;

-- Generate clean slugs for existing products
UPDATE products 
SET slug = generate_unique_slug(generate_slug(name))
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing records
ALTER TABLE products ALTER COLUMN slug SET NOT NULL;

-- Function to automatically generate slug on insert/update
CREATE OR REPLACE FUNCTION set_product_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate slug if it's not provided or if name changed
    IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.name != NEW.name) THEN
        NEW.slug := generate_unique_slug(generate_slug(NEW.name));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set slug
CREATE TRIGGER set_product_slug_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION set_product_slug();

-- Add slug column to submissions table as well
ALTER TABLE submissions ADD COLUMN slug VARCHAR(150);

-- Create index for submissions slug
CREATE INDEX idx_submissions_slug ON submissions(slug);

-- Function to generate unique slug for submissions (checking both tables)
CREATE OR REPLACE FUNCTION generate_unique_submission_slug(base_slug TEXT)
RETURNS TEXT AS $$
DECLARE
    unique_slug TEXT;
    counter INTEGER := 1;
BEGIN
    unique_slug := base_slug;
    
    -- Keep checking until we find a unique slug (check both products and submissions)
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = unique_slug) 
       OR EXISTS (SELECT 1 FROM submissions WHERE slug = unique_slug) LOOP
        unique_slug := base_slug || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN unique_slug;
END;
$$ LANGUAGE plpgsql;

-- Generate clean slugs for existing submissions
UPDATE submissions 
SET slug = generate_unique_submission_slug(generate_slug(name))
WHERE slug IS NULL;

-- Function to automatically generate slug for submissions
CREATE OR REPLACE FUNCTION set_submission_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate slug if it's not provided or if name changed
    IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.name != NEW.name) THEN
        NEW.slug := generate_unique_submission_slug(generate_slug(NEW.name));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for submissions
CREATE TRIGGER set_submission_slug_trigger
    BEFORE INSERT OR UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION set_submission_slug(); 