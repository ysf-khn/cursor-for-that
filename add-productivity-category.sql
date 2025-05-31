-- Add Productivity category to the database
INSERT INTO
    categories (name, description)
VALUES
    (
        'Productivity',
        'Tools that enhance personal and team productivity, workflow optimization, and efficiency.'
    ) ON CONFLICT (name) DO NOTHING;