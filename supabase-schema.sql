-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(100), -- For backward compatibility and custom categories
  pricing VARCHAR(50) NOT NULL CHECK (pricing IN ('Free', 'Freemium', 'Paid')),
  logo_url VARCHAR(500),
  image_url VARCHAR(500), -- Product screenshot or preview image
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('active', 'rejected', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(100), -- For custom categories
  pricing VARCHAR(50) NOT NULL CHECK (pricing IN ('Free', 'Freemium', 'Paid')),
  email VARCHAR(255), -- Made optional
  logo_url VARCHAR(500),
  image_url VARCHAR(500), -- Product screenshot or preview image
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('AI Writing', 'Tools that use AI to help with writing, content creation, and text generation'),
  ('Code Automation', 'Development tools that automate coding tasks and improve developer productivity'),
  ('Task Management', 'Productivity tools that help organize, automate, and manage tasks and workflows'),
  ('Content Creation', 'Tools for creating, editing, and managing various types of content'),
  ('Developer Tools', 'Utilities and platforms designed specifically for software development'),
  ('Data Analysis', 'Tools for analyzing, visualizing, and processing data'),
  ('Design & UI/UX', 'Design tools and platforms for creating user interfaces and experiences'),
  ('Marketing Automation', 'Tools that automate marketing processes and campaigns'),
  ('Customer Support', 'Platforms for managing customer service and support operations'),
  ('Project Management', 'Tools for planning, tracking, and managing projects and teams'),
  ('Communication', 'Platforms for team communication and collaboration'),
  ('Sales & CRM', 'Customer relationship management and sales automation tools'),
  ('Finance & Accounting', 'Financial management and accounting automation tools'),
  ('HR & Recruitment', 'Human resources and talent acquisition tools'),
  ('E-commerce', 'Tools for online selling and e-commerce management'),
  ('Security', 'Cybersecurity and data protection tools'),
  ('Analytics', 'Web analytics and business intelligence tools'),
  ('Social Media', 'Social media management and automation tools'),
  ('Video & Audio', 'Multimedia creation and editing tools'),
  ('Education & Training', 'Learning management and educational tools'),
  ('Productivity', 'Tools that enhance personal and team productivity, workflow optimization, and efficiency');

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_category_name ON products(category_name);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE INDEX idx_submissions_category_id ON submissions(category_id);
CREATE INDEX idx_submissions_category_name ON submissions(category_name);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);

CREATE INDEX idx_categories_name ON categories(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active products" ON products
    FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT TO anon, authenticated USING (true);

-- Create policies for submissions - allow both anonymous and authenticated users to insert
CREATE POLICY "Allow anonymous insert to submissions" ON submissions
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to submissions" ON submissions
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to read submissions (useful for showing submission status)
CREATE POLICY "Allow users to read submissions" ON submissions
    FOR SELECT TO anon, authenticated USING (true);

-- Note: You may want to add more restrictive policies based on your authentication setup
-- For now, we're allowing public read access to products and categories, and public insert to submissions 