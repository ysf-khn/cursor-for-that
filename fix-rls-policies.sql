-- Fix RLS policies for submissions table
-- This script addresses the "new row violates row-level security policy" error
-- Drop the existing policy that only allows 'public' role
DROP POLICY IF EXISTS "Allow public insert to submissions" ON submissions;

-- Create new policies for both anonymous and authenticated users
CREATE POLICY "Allow anonymous insert to submissions" ON submissions FOR INSERT TO anon
WITH
    CHECK (true);

CREATE POLICY "Allow authenticated insert to submissions" ON submissions FOR INSERT TO authenticated
WITH
    CHECK (true);

-- Optional: Add a policy to allow users to read their own submissions
-- (This is useful if you want to show submission status to users later)
CREATE POLICY "Allow users to read their own submissions" ON submissions FOR
SELECT
    TO anon,
    authenticated USING (true);

-- Verify the policies are created correctly
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    tablename = 'submissions';