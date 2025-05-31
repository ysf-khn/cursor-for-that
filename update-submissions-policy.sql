-- Enable RLS on submissions table if not already enabled
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Allow update to submissions" ON submissions;

-- Create policy to allow updates to submissions
CREATE POLICY "Allow update to submissions" ON submissions FOR
UPDATE TO authenticated USING (true)
WITH
    CHECK (true);

-- Verify the policy was created
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
    tablename = 'submissions'
    AND cmd = 'UPDATE';