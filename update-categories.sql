-- Insert new categories if they don't exist
INSERT INTO
    categories (name, description)
VALUES
    (
        'SEO',
        'Search engine optimization tools that help improve website rankings and visibility'
    ) ON CONFLICT (name) DO NOTHING;

INSERT INTO
    categories (name, description)
VALUES
    (
        'Email',
        'Email marketing and automation tools for campaigns, newsletters, and communication'
    ) ON CONFLICT (name) DO NOTHING;