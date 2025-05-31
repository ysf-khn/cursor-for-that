-- Storage policies for the logos bucket
-- These policies allow anonymous users to upload logos for product submissions
-- Policy to allow anonymous users to insert (upload) files to the logos bucket
CREATE POLICY "Allow anonymous uploads to logos bucket" ON storage.objects FOR INSERT TO anon
WITH
    CHECK (bucket_id = 'logos');

-- Policy to allow anonymous users to select (view) files from the logos bucket
CREATE POLICY "Allow anonymous access to logos bucket" ON storage.objects FOR
SELECT
    TO anon USING (bucket_id = 'logos');

-- Policy to allow authenticated users to insert (upload) files to the logos bucket
CREATE POLICY "Allow authenticated uploads to logos bucket" ON storage.objects FOR INSERT TO authenticated
WITH
    CHECK (bucket_id = 'logos');

-- Policy to allow authenticated users to select (view) files from the logos bucket
CREATE POLICY "Allow authenticated access to logos bucket" ON storage.objects FOR
SELECT
    TO authenticated USING (bucket_id = 'logos');

-- Optional: Policy to allow users to update their own uploads (if needed later)
-- CREATE POLICY "Allow users to update their own logos"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'logos' AND (select auth.uid()) = owner_id::uuid)
-- WITH CHECK (bucket_id = 'logos');
-- Optional: Policy to allow users to delete their own uploads (if needed later)
-- CREATE POLICY "Allow users to delete their own logos"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'logos' AND (select auth.uid()) = owner_id::uuid);